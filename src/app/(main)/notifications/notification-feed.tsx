"use client";

import { Notification, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { BsTwitter } from "react-icons/bs";
import { ClipLoader } from "react-spinners";

export default function NotificationFeed() {
  const { data: session, update: updateSession } = useSession();
  const { data, isFetching, isPending } = useQuery({
    queryKey: ["getAllNotifications", session?.user?.id],
    queryFn: async () => {
      const { data } = await axios.get("/api/notifications");
      return data as { currentUser: User; notifications: Notification[] };
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (session?.user?.hasNotification) {
      updateSession({
        user: data?.currentUser,
      });
    }
  }, [data?.currentUser, session?.user?.hasNotification, updateSession]);

  if (isPending || isFetching) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={80} />
      </div>
    );
  }
  if (!isPending && !data) {
    toast.error("Sorry we have problem in our server");
    return null;
  }

  if (data.notifications.length <= 0) {
    return (
      <div className="text-neutral-600 text-center p-6 text-xl">
        No notifications
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {data.notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-center justify-between p-6 border-b border-neutral-800"
        >
          <div className="flex flex-row items-center gap-4 w-full">
            <BsTwitter className="shrink-0" color="white" size={32} />
            <p className="text-white">{notification.body}</p>
          </div>
          <div className="text-white shrink-0">
            {formatDistanceToNowStrict(notification.createdAt)} ago
          </div>
        </div>
      ))}
    </div>
  );
}
