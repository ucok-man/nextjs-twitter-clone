"use client";

import { PostWithUserComment } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostCard from "../post-card";

type Props = {
  userId?: string;
};

export default function PostFeed(props: Props) {
  const { data: posts } = useQuery({
    queryKey: ["getAllPost"],
    queryFn: async () => {
      const url = props.userId
        ? `/api/posts/users/${props.userId}`
        : "/api/posts";
      const { data } = await axios.get<PostWithUserComment[]>(url);
      return data;
    },
  });

  console.log({ posts });

  return (
    <div>
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
