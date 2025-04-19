"use client";

import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import PostFeed from "./post-feed";
import UserBio from "./user-bio";
import UserHero from "./user-hero";

type Props = {
  userId: string;
};

export default function Content({ userId }: Props) {
  const {
    data: user,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["getUserById", userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}`);
      return data as User;
    },
  });

  if (isPending || isFetching) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={80} />
      </div>
    );
  }

  if (!isPending && !user) {
    toast.error("Sorry we have problem in our server");
    return null;
  }

  return (
    <>
      <UserHero user={user} />
      <UserBio user={user} />
      <PostFeed userId={user.id} />
    </>
  );
}
