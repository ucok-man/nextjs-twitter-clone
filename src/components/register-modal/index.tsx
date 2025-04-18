/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { refetchNow } from "@/context";
import useLoginModal from "@/hooks/use-login-modal";
import useRegisterModal from "@/hooks/use-register-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Button from "../button";
import Input from "../input";
import Modal from "../modal";

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
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(60, "Password must be at most 60 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
});

type Props = {
  children: ReactNode;
};

export default function RegisterModal({ children }: Props) {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async (payload: z.infer<typeof formschema>) => {
      const { data } = await axios.post("/api/register", payload);
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

    onSuccess: async () => {
      const result = await signIn("credentials", {
        redirect: false,
        ...form.getValues(),
      });
      form.reset();
      registerModal.close();
      if (result?.error) {
        loginModal.open();
      } else {
        toast.success("New account has been created");
      }
      refetchNow(["followbar"]);
    },
  });

  const form = useForm<z.infer<typeof formschema>>({
    resolver: zodResolver(formschema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const formerr = form.formState.errors;

  return (
    <>
      <Modal.Root isOpen={registerModal.isOpen} onClose={registerModal.close}>
        <Modal.Header>
          <h3 className="text-3xl font-semibold text-white">
            Create an Account
          </h3>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={form.handleSubmit((payload) => signUp(payload))}
            className="flex flex-col gap-4"
          >
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

            <Input
              disabled={isPending}
              placeholder="Email"
              {...form.register("email")}
            />
            {formerr?.email && (
              <p className="text-red-500 text-sm relative -top-3 px-1">
                {formerr.email.message}
              </p>
            )}

            <Input
              disabled={isPending}
              type="password"
              placeholder="Password"
              {...form.register("password")}
            />
            {formerr?.password && (
              <p className="text-red-500 text-sm relative -top-3 px-1">
                {formerr.password.message}
              </p>
            )}

            <Button
              disabled={isPending}
              type="submit"
              secondary
              fullWidth
              large
            >
              Sign Up
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-neutral-400 text-center mt-4">
            <p>
              Already have an account?
              <span
                onClick={() => {
                  registerModal.close();
                  loginModal.open();
                }}
                className="text-white cursor-pointer hover:underline underline-offset-4"
              >
                {" "}
                Sign In
              </span>
            </p>
          </div>
        </Modal.Footer>
      </Modal.Root>

      {children}
    </>
  );
}
