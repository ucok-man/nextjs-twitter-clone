"use client";
import { NAVBAR_ITEMS } from "@/constants";
import { BiLogOut } from "react-icons/bi";
import SidebarItem from "./sidebar-item";
import SidebarLogo from "./sidebar-logo";
import TweetButton from "./tweet-button";

export default function Sidebar() {
  return (
    <div className="col-span-1 h-full pr-4 md:pr-6">
      <div className="flex flex-col items-end">
        <div className="space-y-2 lg:w-[230px]'">
          <SidebarLogo />
          {NAVBAR_ITEMS.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
            />
          ))}
          <SidebarItem onClick={() => {}} icon={BiLogOut} label="Logout" />
          <TweetButton />
        </div>
      </div>
    </div>
  );
}
