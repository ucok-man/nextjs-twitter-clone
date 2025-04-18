/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prismaclient } from "./lib/prisma-client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prismaclient),
  debug: process.env.NODE_ENV === "development",

  providers: [
    Credentials({
      type: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async ({ email, password }) => {
        if (!email || !password) {
          throw new AuthError("Invalid email or password");
        }
        if (typeof email !== "string" || typeof password !== "string") {
          throw new AuthError("Invalid email or password");
        }

        const user = await prismaclient.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new AuthError("Invalid email or password");
        }

        const match = await compare(password, user.hashedPassword);
        if (!match) {
          throw new AuthError("Invalid email or password");
        }

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },

    jwt({ token, user, session, trigger }) {
      const u = user as Record<string, any>;
      if (trigger === "signIn" || trigger === "signUp") {
        for (const key in u) {
          token[key] = u[key];
        }
      }
      if (trigger === "update") {
        for (const key in session.user) {
          if (key === "id") continue;
          token[key] = session.user[key];
        }
      }
      return token;
    },
    session({ session, token }) {
      const u = session.user as any;
      console.log({ u });
      for (const key in token) {
        u[key] = token[key];
      }
      return { ...session, user: u };
    },
  },
});
