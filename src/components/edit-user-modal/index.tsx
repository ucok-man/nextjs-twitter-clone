/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { refetchNow } from "@/context";
import useEditUserModal from "@/hooks/use-edit-user-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Button from "../button";
import Input from "../input";
import InputImage from "../input-image";
import Modal from "../modal";
import TextArea from "../textarea";

const formschema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  bio: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) => val === undefined || (val.length >= 10 && val.length <= 200),
      { message: "Bio must be between 10 and 200 characters" }
    )
    .optional(),

  image: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),

  coverImage: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
});

type Props = {
  children: ReactNode;
};

export default function UserEditModal({ children }: Props) {
  const editmodal = useEditUserModal();
  const { data: session, update: refetchSession } = useSession();

  const { mutate: editProfile, isPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof formschema>) => {
      const { data } = await axios.put<User>(
        `/api/users/${session?.user?.id}`,
        payload
      );
      return data;
    },
    onError: (err: AxiosError) => {
      if (err.status === 422) {
        const response = err.response?.data as any;
        for (const key in response.error) {
          toast.error(`${response.error[key]}`);
          return;
        }
      }

      toast.error("Sorry, our server encounter some problem. Try again later!");
    },

    onSuccess: async (data) => {
      form.reset();
      editmodal.close();
      toast.success("Your profile has been updated");
      refetchNow(["getUserById", "getAllUser"]);
      refetchSession({ user: data });
    },
  });

  const form = useForm<z.infer<typeof formschema>>({
    resolver: zodResolver(formschema),
    defaultValues: {},
  });
  const formerr = form.formState.errors;

  useEffect(() => {
    form.setValue("name", session?.user?.name || "");
    form.setValue("username", session?.user?.username || "");
    form.setValue("bio", session?.user?.bio || undefined);
    form.setValue("image", session?.user?.image || undefined);
    form.setValue("coverImage", session?.user?.coverImage || undefined);
  }, [session, form]);

  return (
    <>
      <Modal.Root isOpen={editmodal.isOpen} onClose={editmodal.close}>
        <Modal.Header>
          <h3 className="text-3xl font-semibold text-white">
            Edit your profile
          </h3>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={form.handleSubmit((payload) => editProfile(payload))}
            className="flex flex-col gap-4"
          >
            <InputImage
              value={session?.user?.coverImage || ""}
              disabled={isPending}
              onChange={(image) => {
                form.setValue("coverImage", image);
              }}
              label="Upload cover image"
            />
            {formerr?.coverImage && (
              <p className="text-red-500 text-sm relative -top-3 px-1">
                {formerr.coverImage.message}
              </p>
            )}

            <InputImage
              value={session?.user?.image || ""}
              disabled={isPending}
              onChange={(image) => {
                form.setValue("image", image);
              }}
              label="Upload profile image"
            />
            {formerr?.image && (
              <p className="text-red-500 text-sm relative -top-3 px-1">
                {formerr.image.message}
              </p>
            )}

            <Input
              disabled={isPending}
              placeholder="Full Name"
              {...form.register("name")}
            />
            {formerr?.name && (
              <p className="text-red-500 text-sm relative -top-3 px-1">
                {formerr.name.message}
              </p>
            )}

            <Input
              disabled={isPending}
              placeholder="Username"
              {...form.register("username")}
            />
            {formerr?.username && (
              <p className="text-red-500 text-sm relative -top-3 px-1">
                {formerr.username.message}
              </p>
            )}

            <TextArea
              disabled={isPending}
              placeholder="Bio"
              className="h-40"
              {...form.register("bio")}
            />
            {formerr?.bio && (
              <p className="text-red-500 text-sm relative -top-3 px-1">
                {formerr.bio.message}
              </p>
            )}

            <Button
              disabled={isPending}
              type="submit"
              secondary
              fullWidth
              large
            >
              Save
            </Button>
          </form>
        </Modal.Body>
      </Modal.Root>

      {children}
    </>
  );
}
