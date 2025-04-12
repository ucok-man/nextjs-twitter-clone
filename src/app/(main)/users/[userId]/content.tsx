"use client";

import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import UserBio from "./user-bio";
import UserHero from "./user-hero";

type Props = {
  userId: string;
};

export default function Content({ userId }: Props) {
  const { data: user, isPending } = useQuery({
    queryKey: ["getUserById", "profilePage"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}`);
      return data as User;
    },
  });

  if (isPending || (!isPending && !user)) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={80} />
      </div>
    );
  }

  return (
    <>
      <UserHero user={user} />
      <UserBio user={user} />
    </>
  );
}
