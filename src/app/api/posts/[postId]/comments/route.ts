import { auth } from "@/auth";
import { apiResponseErr, apiResponseOK } from "@/lib/api-response";
import { formatZodError } from "@/lib/format-zod-error";
import { prismaclient } from "@/lib/prisma-client";
import { z } from "zod";

const CreateCommentSchema = z.object({
  body: z.string().trim().min(1).max(500),
});

export const POST = auth(async function POST(req, ctx) {
  if (!req.auth) {
    return apiResponseErr(401, {
      message: "You are not allowed to access this resource",
    });
  }

  if (!ctx.params?.postId || typeof ctx.params?.postId !== "string") {
    return apiResponseErr(400, {
      message: "Invalid post id parameter",
    });
  }

  const { data: dto, error } = CreateCommentSchema.safeParse(await req.json());
  if (error) {
    return apiResponseErr(422, formatZodError(error.flatten()));
  }

  const postId = ctx.params.postId as string;

  try {
    const currentUser = await prismaclient.user.findUnique({
      where: {
        id: req.auth.user?.id,
      },
    });
    if (!currentUser) {
      return apiResponseErr(
        404,
        "The resource you are looking for cannot be found"
      );
    }

    const post = await prismaclient.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return apiResponseErr(
        404,
        "The resource you are looking for cannot be found"
      );
    }

    await prismaclient.notification.create({
      data: {
        body: "Someone replied on your tweet!",
        userId: post.userId,
      },
    });

    const updatedUserNotification = await prismaclient.user.update({
      where: {
        id: post.userId,
      },
      data: {
        hasNotification: true,
      },
    });

    const comment = await prismaclient.comment.create({
      data: {
        body: dto.body,
        postId: postId,
        userId: currentUser.id,
      },
    });

    return apiResponseOK(201, {
      comment: comment,
      currentUser:
        updatedUserNotification.id === currentUser.id
          ? updatedUserNotification
          : null,
    });
  } catch (error) {
    console.log(`error create comment: ${error}`);
    return apiResponseErr(500, { message: "We have problem in our server" });
  }
});
