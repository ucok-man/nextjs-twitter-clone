"use client";

import Avatar from "@/components/avatar";
import { Comment, User } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/navigation";

type Props = {
  comment: Comment & { user: User };
};

export default function CommentCard({ comment }: Props) {
  const router = useRouter();

  return (
    <div className="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition">
      <div className="flex flex-row items-start gap-3">
        <Avatar user={comment.user} />
        <div>
          <div className="flex flex-row items-center gap-2">
            <p
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/users/${comment.userId}`);
              }}
              className="text-white font-semibold cursor-pointer hover:underline"
            >
              {comment.user.name}
            </p>
            <span
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/users/${comment.userId}`);
              }}
              className=" text-neutral-500 cursor-pointer hover:underline hidden md:block"
            >
              @{comment.user.username}
            </span>
            <span className="text-neutral-500 text-sm">
              {formatDistanceToNowStrict(new Date(comment.createdAt))}
            </span>
          </div>
          <div className="text-white mt-1">{comment.body}</div>
        </div>
      </div>
    </div>
  );
}
