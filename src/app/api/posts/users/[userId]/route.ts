import { apiResponseErr, apiResponseOK } from "@/lib/api-response";
import { prismaclient } from "@/lib/prisma-client";
import { NextRequest } from "next/server";

type Params = {
  params: { userId: string };
};

export async function GET(req: NextRequest, { params }: Params) {
  if (!params.userId || typeof params.userId !== "string") {
    return apiResponseErr(400, {
      message: "Invalid user id parameter",
    });
  }

  try {
    const posts = await prismaclient.post.findMany({
      where: {
        userId: params.userId,
      },
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
    console.log(`error get all user post: ${error}`);
    return apiResponseErr(500, { message: "We have problem in our server" });
  }
}
