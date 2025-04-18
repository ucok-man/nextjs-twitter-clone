/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiResponseErr, apiResponseOK } from "@/lib/api-response";
import { formatZodError } from "@/lib/format-zod-error";
import { prismaclient } from "@/lib/prisma-client";
import { hash } from "bcryptjs";
import { NextRequest } from "next/server";
import { z } from "zod";

const Schema = z.object({
  name: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(60, "Password must be at most 60 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
});

export async function POST(req: NextRequest) {
  const { data: dto, error } = Schema.safeParse(await req.json());
  if (error) {
    return apiResponseErr(422, formatZodError(error.flatten()));
  }

  try {
    const usernameExist = await prismaclient.user.findFirst({
      where: { username: dto.username },
    });
    if (usernameExist) {
      return apiResponseErr(422, {
        username: "Username already in use",
      });
    }

    const emailExist = await prismaclient.user.findFirst({
      where: { email: dto.email },
    });
    if (emailExist) {
      return apiResponseErr(422, {
        email: "User with this email already exist",
      });
    }

    const hashpassword = await hash(dto.password, 12);
    const user = await prismaclient.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        username: dto.username,
        hashedPassword: hashpassword,
        emailVerified: new Date(),
      },
    });

    const { hashedPassword, ...rest } = user;

    return apiResponseOK(200, rest);
  } catch (error) {
    console.log(`error register user ${error}`);
    return apiResponseErr(500, { message: "We have problem in our server" });
  }
}
