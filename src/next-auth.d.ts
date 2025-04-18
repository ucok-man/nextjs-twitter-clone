/* eslint-disable @typescript-eslint/no-empty-object-type */
import { User as PrismaUser } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface User extends PrismaUser {}
}
