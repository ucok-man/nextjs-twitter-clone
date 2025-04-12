/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiResponseErr, apiResponseOK } from "@/lib/api-response";
import { prismaclient } from "@/lib/prisma-client";
import { NextRequest } from "next/server";

type Params = {
  params: { userId: string };
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    if (!params.userId || typeof params.userId !== "string") {
      return apiResponseErr(400, {
        message: "Invalid user id parameter",
      });
    }

    const user = await prismaclient.user.findUnique({
      where: {
        id: params.userId,
      },
      include: {
        _count: {
          select: {
            followings: true,
          },
        },
      },
    });
    if (!user) {
      return apiResponseErr(404, {
        message: "The resource you are looking for cannot be found",
      });
    }

    return apiResponseOK(200, user);
  } catch (error) {
    console.log(`Error get user by id: ${error}`);
    return apiResponseErr(500, {
      message: "Sorry we have problem in our server",
    });
  }
}
