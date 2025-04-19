import { Comment, User } from "@prisma/client";
import CommentCard from "./comment-card";

type Props = {
  comments: (Comment & { user: User })[];
};

export default function CommentFeed({ comments }: Props) {
  return (
    <div>
      {comments?.map((comment, idx) => (
        <CommentCard key={idx} comment={comment} />
      ))}
    </div>
  );
}
