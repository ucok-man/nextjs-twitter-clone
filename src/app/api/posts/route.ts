/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@/auth";
import { apiResponseErr, apiResponseOK } from "@/lib/api-response";
import { formatZodError } from "@/lib/format-zod-error";
import { prismaclient } from "@/lib/prisma-client";
import { NextRequest } from "next/server";
import { z } from "zod";

const CreatePostSchema = z.object({
  body: z.string().trim().min(1).max(500),
});

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return apiResponseErr(401, {
      message: "You are not allowed to access this resource",
    });
  }

  const { data: dto, error } = CreatePostSchema.safeParse(await req.json());
  if (error) {
    return apiResponseErr(422, formatZodError(error.flatten()));
  }

  try {
    const post = await prismaclient.post.create({
      data: {
        userId: req.auth.user!.id as string,
        body: dto.body,
      },
    });
    return apiResponseOK(200, post);
  } catch (error) {
    console.log(`error creating post: ${error}`);
    return apiResponseErr(500, { message: "We have problem in our server" });
  }
});

export async function GET(req: NextRequest) {
  try {
    const posts = await prismaclient.post.findMany({
      include: {
        createdBy: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return apiResponseOK(200, posts);
  } catch (error) {
    console.log(`error get all post: ${error}`);
    return apiResponseErr(500, { message: "We have problem in our server" });
  }
}
