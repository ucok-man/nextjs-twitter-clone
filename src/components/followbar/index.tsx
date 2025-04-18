"use client";

import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Avatar from "../avatar";

export default function FollowBar() {
  const { data: users, isPending } = useQuery({
    queryKey: ["getAllUser", "followbar"],
    queryFn: async () => {
      const { data } = await axios.get<User[]>("/api/users");
      return data;
    },
  });

  if (isPending) return null;
  if (!users || !users.length) return null;

  console.log({ users });

  return (
    <div className="px-6 py-4 hidden lg:block">
      <div className="bg-neutral-800 rounded-xl p-4">
        <h2 className="text-white text-xl font-semibold">Who to follow</h2>
        <div className="flex flex-col gap-6 mt-4">
          {users.map((user, idx) => (
            <div key={idx} className="flex flex-row gap-4">
              <Avatar user={user} />
              <div className="flex flex-col">
                <p className="text-white font-semibold text-sm">{user.name}</p>
                <p className="text-neutral-400 text-sm">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
