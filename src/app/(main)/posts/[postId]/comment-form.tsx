"use client";

import Avatar from "@/components/avatar";
import Button from "@/components/button";
import TextArea from "@/components/textarea";
import { refetchNow } from "@/context";
import useLoginModal from "@/hooks/use-login-modal";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Comment, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const CreateCommentSchema = z.object({
  body: z.string().trim().min(1).max(500),
});

type Props = {
  postId: string;
};

export default function CommentForm({ postId }: Props) {
  const { data: session, update: updateSession } = useSession();
  const loginModal = useLoginModal();

  const [showUnderline, setShowUnderline] = useState(false);
  const [disableTweet, setDisableTweet] = useState(true);

  const { mutate: createComment, isPending: createPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof CreateCommentSchema>) => {
      const { data } = await axios.post(
        `/api/posts/${postId}/comments`,
        payload
      );
      return data as { comment: Comment; currentUser?: User };
    },
    onError: (err: AxiosError) => {
      if (err.status! >= 400) {
        toast.error("Sorry we have problem in our server");
      }
    },
    onSuccess: (data) => {
      form.reset();
      refetchNow(["getAllPost", "getAllMyPost", "getPostById"]);
      if (data.currentUser) {
        updateSession({
          user: data.currentUser,
        });
      }
    },
  });

  const form = useForm<z.infer<typeof CreateCommentSchema>>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      body: "",
    },
  });

  return (
    <div className="border-b border-neutral-800 px-5 py-2">
      <div className="flex flex-row gap-4">
        <div>
          <Avatar user={session?.user as User} />
        </div>
        <form
          onSubmit={form.handleSubmit((payload) => createComment(payload))}
          className="w-full"
        >
          <TextArea
            disabled={createPending}
            placeholder="Tweet your reply"
            className="text-[18px] border-none"
            rows={1}
            containerClass="peer"
            {...form.register("body")}
            onFocus={(e) => {
              if (!session?.user) {
                e.preventDefault();
                loginModal.open();
                return;
              }
            }}
            onKeyDown={(e) => {
              if (!session?.user) {
                e.preventDefault();
                loginModal.open();
                return;
              }
            }}
            onChange={(e) => {
              if (!session?.user) return;
              e.target.style.height = "auto"; // Reset height first
              e.target.style.height = `${e.target.scrollHeight}px`; // Set new height
              const value = e.target.value;
              if (value === "" && showUnderline === true) {
                setShowUnderline(false);
              }
              if (value !== "" && showUnderline === false) {
                setShowUnderline(true);
              }

              if (value.trim() === "" && disableTweet === false) {
                setDisableTweet(true);
              }
              if (value.trim() !== "" && disableTweet === true) {
                setDisableTweet(false);
              }

              form.register("body").onChange(e);
            }}
          />

          <hr
            className={cn(
              "opacity-0 peer-focus-within:opacity-100 border-neutral-800 peer-:opacity-100 transition-all",
              showUnderline && "opacity-100"
            )}
          />

          <div className="mt-4 mb-2 flex flex-row justify-end">
            <Button disabled={createPending || disableTweet}>Tweet</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
