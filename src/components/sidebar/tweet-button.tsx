"use client";

import useLoginModal from "@/hooks/use-login-modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaFeather } from "react-icons/fa";

export default function TweetButton() {
  const { data: session } = useSession();
  const loginModal = useLoginModal();
  const router = useRouter();
  return (
    <div
      onClick={() => {
        if (!session) {
          loginModal.open();
          return;
        }

        // TODO: handle tweet action
        router.push("/");
      }}
    >
      <div className="mt-6 lg:hidden rounded-full h-14 w-14 p-4 flex items-center justify-center bg-sky-500 hover:bg-opacity-80 transition cursor-pointer">
        <FaFeather size={24} className="text-white" />
      </div>
      <div className="mt-6 hidden lg:block px-4 py-2 rounded-full bg-sky-500 hover:bg-opacity-90 cursor-pointer">
        <p className="hidden lg:block text-center font-semibold text-white text-[20px]">
          Tweet
        </p>
      </div>
    </div>
  );
}
