/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@/auth";
import { apiResponseErr, apiResponseOK } from "@/lib/api-response";
import { formatZodError } from "@/lib/format-zod-error";
import { prismaclient } from "@/lib/prisma-client";
import { NextRequest } from "next/server";
import { z } from "zod";

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
      omit: {
        hashedPassword: true,
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

const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  bio: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) => val === undefined || (val.length >= 10 && val.length <= 200),
      { message: "Bio must be between 10 and 200 characters" }
    )
    .optional(),

  image: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),

  coverImage: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
});

export const PUT = auth(async function PUT(req, ctx) {
  const { data: dto, error } = UpdateUserSchema.safeParse(await req.json());
  if (error) {
    return apiResponseErr(422, formatZodError(error.flatten()));
  }

  try {
    if (!ctx.params?.userId || typeof ctx.params?.userId !== "string") {
      return apiResponseErr(400, {
        message: "Invalid user id parameter",
      });
    }

    const user = await prismaclient.user.findUnique({
      where: {
        id: ctx.params.userId,
      },
    });
    if (!user) {
      return apiResponseErr(404, {
        message: "The resource you are looking for cannot be found",
      });
    }

    user.name = dto.name;
    user.username = dto.username;
    user.bio = dto.bio || null;
    user.image = dto.image || null;
    user.coverImage = dto.coverImage || null;

    const { id, ...updatedval } = user;
    const updateduser = await prismaclient.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...updatedval,
      },
    });

    const { hashedPassword, ...rest } = updateduser;

    return apiResponseOK(200, rest);
  } catch (error) {
    console.log(`Error update user by id: ${error}`);
    return apiResponseErr(500, {
      message: "Sorry we have problem in our server",
    });
  }
});
