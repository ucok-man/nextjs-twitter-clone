"use client";

import PostCard from "@/components/post-card";
import { PostWithUserComment } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function PostFeed() {
  const { data: posts } = useQuery({
    queryKey: ["getAllPost"],
    queryFn: async () => {
      const url = "/api/posts";
      const { data } = await axios.get<PostWithUserComment[]>(url);
      return data;
    },
  });

  return (
    <div>
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
