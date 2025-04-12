"use client";

import { queryclient } from "@/context";
import useLoginModal from "@/hooks/use-login-modal";
import useRegisterModal from "@/hooks/use-register-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Button from "../button";
import Input from "../input";
import Modal from "../modal";

const formschema = z.object({
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

export default function LoginModal({ children }: Props) {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const form = useForm<z.infer<typeof formschema>>({
    resolver: zodResolver(formschema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
      <Modal.Root isOpen={loginModal.isOpen} onClose={loginModal.close}>
        <Modal.Header>
          <h3 className="text-3xl font-semibold text-white">Login</h3>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={form.handleSubmit(async (payload) => {
              const result = await signIn("credentials", {
                redirect: false,
                ...payload,
              });
              if (result?.error) {
                toast.error("Invalid email or password");
                form.resetField("password");
              } else {
                toast.success(`Welcome, ${form.getValues("email")}`);
                loginModal.close();
                form.reset();
                queryclient.refetchQueries({
                  queryKey: ["followbar"],
                });
              }
            })}
            className="flex flex-col gap-4"
          >
            <Input placeholder="Email" {...form.register("email")} />
            <Input placeholder="Password" {...form.register("password")} />

            <Button disabled={false} type="submit" secondary fullWidth large>
              Sign In
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-neutral-400 text-center mt-4">
            <p>
              First time using Twitter?
              <span
                onClick={() => {
                  loginModal.close();
                  registerModal.open();
                }}
                className="text-white cursor-pointer hover:underline underline-offset-4"
              >
                {" "}
                Create an account
              </span>
            </p>
          </div>
        </Modal.Footer>
      </Modal.Root>

      {children}
    </>
  );
}
