/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiResponseErr, apiResponseOK } from "@/lib/api-response";
import { prismaclient } from "@/lib/prisma-client";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const users = await prismaclient.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return apiResponseOK(200, users);
  } catch (error) {
    console.log(`Error get all users: ${error}`);
    return apiResponseErr(500, {
      message: "Sorry we have problem in our server",
    });
  }
}
