import { Comment, Post, User } from "@prisma/client";

export type PostWithUserComment = Post & {
  createdBy: User;
  comments: Comment[];
};
