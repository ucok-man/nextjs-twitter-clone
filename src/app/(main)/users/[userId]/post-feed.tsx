"use client";

import PostCard from "@/components/post-card";
import { PostWithUserComment } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  userId: string;
};

export default function PostFeed(props: Props) {
  const { data: posts, isPending } = useQuery({
    queryKey: ["getAllMyPost"],
    queryFn: async () => {
      const url = `/api/posts/users/${props.userId}`;
      const { data } = await axios.get<PostWithUserComment[]>(url);
      return data;
    },
  });
  if (isPending) return null;

  return (
    <div>
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
