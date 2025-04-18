"use client";

import Avatar from "@/components/avatar";
import Button from "@/components/button";
import TextArea from "@/components/textarea";
import { refetchNow } from "@/context";
import useLoginModal from "@/hooks/use-login-modal";
import useRegisterModal from "@/hooks/use-register-modal";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const CreatePostSchema = z.object({
  body: z.string().trim().min(1).max(500),
});

export default function TweetForm() {
  const { data: session } = useSession();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [showUnderline, setShowUnderline] = useState(false);
  const [disableTweet, setDisableTweet] = useState(true);

  const { mutate: createPost, isPending: createPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof CreatePostSchema>) => {
      const { data } = await axios.post("/api/posts", payload);
      return data;
    },
    onError: (err: AxiosError) => {
      if (err.status! >= 500) {
        toast.error("Sorry we have problem in our server");
      }
    },
    onSuccess: () => {
      toast.success("Your tweet has been posted!");
      form.reset();
      refetchNow(["getAllPost"]);
    },
  });

  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      body: "",
    },
  });

  return (
    <div className="border-b border-neutral-800 px-5 py-2">
      {session?.user ? (
        <div className="flex flex-row gap-4">
          <div>
            <Avatar user={session.user as User} />
          </div>
          <form
            onSubmit={form.handleSubmit((payload) => createPost(payload))}
            className="w-full"
          >
            <TextArea
              disabled={createPending}
              placeholder="What's happening?"
              className="text-[18px] border-none"
              rows={1}
              containerClass="peer"
              {...form.register("body")}
              onChange={(e) => {
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
      ) : (
        <div className="py-8">
          <h1 className="text-white text-2xl text-center mb-4 font-bold">
            Welcome To Twitter
          </h1>
          <div className="flex flex-row items-center justify-center gap-4">
            <Button onClick={() => loginModal.open()}>Login</Button>
            <Button onClick={() => registerModal.open()} secondary>
              Register
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
