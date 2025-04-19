"use client";
import useLoginModal from "@/hooks/use-login-modal";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
import { BsBellFill, BsHouseFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import SidebarItem from "./sidebar-item";
import SidebarLogo from "./sidebar-logo";
import TweetButton from "./tweet-button";

export default function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const loginModal = useLoginModal();

  const SIDEBAR_ITEMS = [
    {
      icon: BsHouseFill,
      label: "Home",
      href: "/",
    },
    {
      icon: BsBellFill,
      href: "/notifications",
      label: "Notifications",
      requireAuth: true,
      hasNotification: session?.user?.hasNotification,
    },
    {
      icon: FaUser,
      label: "Profile",
      href: `/users/${session?.user?.id}`,
      requireAuth: true,
    },
  ];

  return (
    <div className="col-span-1 h-full pr-4 md:pr-6">
      <div className="flex flex-col items-end">
        <div className="space-y-2 lg:w-[230px]'">
          <SidebarLogo />
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarItem
              key={item.href}
              label={item.label}
              icon={item.icon}
              hasNotification={item.hasNotification}
              onClick={() => {
                if (item.requireAuth && !session) {
                  loginModal.open();
                } else {
                  router.push(item.href);
                }
              }}
            />
          ))}
          {session && (
            <SidebarItem
              onClick={() => {
                signOut();
                router.refresh();
              }}
              icon={BiLogOut}
              label="Logout"
            />
          )}
          <TweetButton />
        </div>
      </div>
    </div>
  );
}
