"use client";

import Button from "@/components/button";
import { refetchNow } from "@/context";
import useEditUserModal from "@/hooks/use-edit-user-modal";
import useLoginModal from "@/hooks/use-login-modal";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { BiCalendar } from "react-icons/bi";

type Props = {
  user: User;
};

export default function UserBio({ user }: Props) {
  const loginModal = useLoginModal();
  const editmodal = useEditUserModal();
  const { data: current, update: updateSession } = useSession();

  const createdAt = format(user.createdAt, "MMMM yyyy");

  const { mutate: toogleFollow } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.patch(`/api/users/${user.id}/follow`);
      return data as { message: string; followUser: User; currentUser: User };
    },
    onSuccess: (data) => {
      updateSession({
        user: data.currentUser,
      });
      refetchNow(["getUserById"]);
    },
  });

  return (
    <section>
      <div className="border-b border-neutral-800 pb-4">
        <div className="flex justify-end p-2">
          {current?.user?.id === user.id ? (
            <Button secondary onClick={() => editmodal.open()}>
              Edit
            </Button>
          ) : (
            <Button
              secondary
              onClick={() => {
                if (!current?.user) {
                  loginModal.open();
                  return;
                }

                toogleFollow();
              }}
            >
              {current?.user?.followingIds.includes(user.id)
                ? "Unfollow"
                : "Follow"}
            </Button>
          )}
        </div>
        <div className="mt-8 px-4">
          <div className="flex flex-col">
            <p className="text-white text-2xl font-semibold">{user.name}</p>
            <p className="text-md text-neutral-500">@{user.username}</p>
          </div>
          <div className="flex flex-col mt-4">
            <p className="text-white">{user.bio}</p>
            <div className="flex flex-row items-center gap-2 mt-4 text-neutral-500">
              <BiCalendar size={24} />
              <p>Join {createdAt}</p>
            </div>
          </div>
          <div className="flex flex-row items-center mt-4 gap-6">
            <div className="flex flex-row items-center gap-1">
              <p className="text-white">{user.followingIds.length}</p>
              <p className="text-neutral-500">Following</p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <p className="text-white">{user.followerIds.length}</p>
              <p className="text-neutral-500">Followers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
