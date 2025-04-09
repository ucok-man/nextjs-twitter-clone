"use client";

import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";

type Props = {
  showBackArrow?: boolean;
  children: string;
};

export default function Header({ showBackArrow, children }: Props) {
  const router = useRouter();

  return (
    <div className="border-b border-neutral-800 p-5">
      <div className="flex flex-row items-center gap-2">
        {showBackArrow && (
          <BiArrowBack
            onClick={() => router.back()}
            size={20}
            className="cursor-pointer hover:opacity-70 transition-all text-white"
          />
        )}
        <h1 className="text-white text-xl font-semibold">{children}</h1>
      </div>
    </div>
  );
}
