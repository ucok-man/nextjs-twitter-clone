"use client";

import PostCard from "@/components/post-card";
import { Comment, Post, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import CommentForm from "./comment-form";

type Props = {
  postId: string;
};

export default function Content({ postId }: Props) {
  const { data: post, isPending } = useQuery({
    queryKey: ["getPostById"],
    queryFn: async () => {
      const { data } = await axios.get<
        Post & { createdBy: User; comments: (Comment & { user: User })[] }
      >(`/api/posts/${postId}`);
      return data;
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={80} />
      </div>
    );
  }

  if (!isPending && !post) {
    toast.error("Sorry we have problem in our server");
    return null;
  }

  return (
    <div>
      <PostCard post={post} />
      <CommentForm postId={postId} />
    </div>
  );
}
