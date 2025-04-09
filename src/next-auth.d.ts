import "next-auth";

declare module "next-auth" {
  // Extend user session to hold the access_token
  interface User {
    id: string;
    username?: string | null;
    bio?: string | null;
    email?: string | null;
    emailVerified?: Date | null;
    image?: string | null;
    coverImage?: string | null;
    profileImage?: string | null;
    hashedPassword?: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
    followingIds: string[];
    hasNotification: boolean;
  }
}
