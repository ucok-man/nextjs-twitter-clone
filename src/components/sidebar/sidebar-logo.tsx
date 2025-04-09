import Link from "next/link";
import { BsTwitter } from "react-icons/bs";

export default function SidebarLogo() {
  return (
    <Link
      href={"/"}
      className="rounded-full h-14 w-14 p-4 items-center flex justify-center hover:bg-blue-300 hover:bg-opacity-10 cursor-pointer transition-all"
    >
      <BsTwitter size={28} className="text-white" />
    </Link>
  );
}
