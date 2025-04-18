"use client";

import Avatar from "@/components/avatar";
import { User } from "@prisma/client";
import Image from "next/image";

type Props = {
  user: User;
};

export default function UserHero({ user }: Props) {
  return (
    <section>
      <div className="bg-neutral-700 h-44 relative">
        {user.coverImage && (
          <Image
            src={user.coverImage}
            alt="Cover Image"
            fill
            className="object-cover"
          />
        )}
        <div className="absolute -bottom-16 left-4">
          <Avatar user={user} hasBorder isLarge />
        </div>
      </div>
    </section>
  );
}
