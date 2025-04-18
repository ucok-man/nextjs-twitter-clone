"use client";

import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type Props = {
  user: User;
  isLarge?: boolean;
  hasBorder?: boolean;
};

export default function Avatar(props: Props) {
  return (
    <Link href={`/users/${props.user.id}`}>
      <div
        className={cn(
          "size-12 rounded-full hover:opacity-90 cursor-pointer relative",
          props.hasBorder && "border-4 border-black",
          props.isLarge && "size-32"
        )}
      >
        <Image
          src={props.user?.image || "/images/default-profile.png"}
          alt="Avatar"
          fill
          className="object-cover rounded-full"
        />
      </div>
    </Link>
  );
}
