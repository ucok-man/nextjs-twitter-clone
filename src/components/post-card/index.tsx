"use client";

import useLoginModal from "@/hooks/use-login-modal";
import { PostWithUserComment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import Avatar from "../avatar";

type Props = {
  post: PostWithUserComment;
};

export default function PostCard({ post }: Props) {
  const loginModal = useLoginModal();
  const { data: session } = useSession();
  const router = useRouter();

  const { mutate: toogleLike } = useMutation({
    mutationFn: async (payload: { postId: string; likedId: string }) => {
      return {};
    },
  });

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/posts/${post.id}`);
      }}
      className="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition"
    >
      <div className="flex flex-row items-start gap-3">
        <Avatar user={post.createdBy} />
        <div>
          <div className="flex flex-row items-center gap-2">
            <p
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/users/${post.userId}}`);
              }}
              className="text-white font-semibold cursor-pointer hover:underline"
            >
              {post.createdBy.name}
            </p>
            <span
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/users/${post.userId}}`);
              }}
              className="text-neutral-500 cursor-pointer hover:underline hidden md:block"
            >
              @{post.createdBy.username}
            </span>
            <span className="text-neutral-500 text-sm">
              {formatDistanceToNowStrict(new Date(post.createdAt))}
            </span>
          </div>
          <div className="text-white mt-1">{post.body}</div>
          <div className="flex flex-row items-center mt-3 gap-10">
            <div className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500">
              <AiOutlineMessage size={20} />
              <p>{post.comments?.length || 0}</p>
            </div>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!session?.user?.id) {
                  loginModal.open();
                  return;
                }
                toogleLike({
                  postId: post.id,
                  likedId: session.user.id,
                });
              }}
              className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500"
            >
              <AiOutlineHeart
                className={cn(
                  "transition-all",
                  post.likedIds.length > 0 && "fill-red-500 text-red-500"
                )}
                size={20}
              />
              <p>{post.likedIds.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
