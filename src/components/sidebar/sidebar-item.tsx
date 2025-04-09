"use client";

import { IconType } from "react-icons";

type Props = {
  label: string;
  icon: IconType;
  onClick?: () => void;
};

export default function SidebarItem(props: Props) {
  return (
    <div
      onClick={props.onClick}
      className="flex flex-row items-center text-white w-full"
    >
      <div className="flex relative rounded-full gap-4 p-4 hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer items-center w-full">
        <props.icon size={24} />
        <p className="hidden lg:block text-lg">{props.label}</p>
        {/* <BsDot className="text-sky-500 absolute -top-4 left-0" size={70} /> */}
      </div>
    </div>
  );
}
