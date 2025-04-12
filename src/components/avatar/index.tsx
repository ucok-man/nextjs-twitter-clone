"use client";

import { UserWithCountFollowing } from "@/lib/get-user-by-id-response";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

type Props = {
  userId: string;
  isLarge?: boolean;
  hasBorder?: boolean;
};

export default function Avatar(props: Props) {
  const { data: user, isPending } = useQuery({
    queryKey: ["getUserById", "avatar"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${props.userId}`);
      return data as UserWithCountFollowing;
    },
  });

  if (isPending) return null;

  return (
    <Link
      href={`/users/${props.userId}`}
      className={`
       ${props.hasBorder && "border-4 border-black"} 
       ${props.isLarge && "size-32"}
        size-12 rounded-full hover:opacity-90 cursor-pointer relative
       `}
    >
      <Image
        src={user?.image || "/images/default-profile.png"}
        alt="Avatar"
        fill
        className="object-cover rounded-full"
      />
    </Link>
  );
}
