import { apiResponseErr, apiResponseOK } from "@/lib/api-response";
import { prismaclient } from "@/lib/prisma-client";
import { NextRequest } from "next/server";

type Params = {
  params: {
    postId: string;
  };
};

export async function GET(req: NextRequest, { params }: Params) {
  if (!params.postId || typeof params.postId !== "string") {
    return apiResponseErr(400, {
      message: "Invalid post id parameter",
    });
  }

  try {
    const post = await prismaclient.post.findUnique({
      where: {
        id: params.postId,
      },
      include: {
        createdBy: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!post) {
      return apiResponseErr(404, {
        message: "The resource you are looking for cannot be found",
      });
    }

    return apiResponseOK(200, post);
  } catch (error) {
    console.log(`error get all user post: ${error}`);
    return apiResponseErr(500, { message: "We have problem in our server" });
  }
}
