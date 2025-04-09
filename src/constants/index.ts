import { BsBellFill, BsHouseFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

export const NAVBAR_ITEMS = [
  {
    icon: BsHouseFill,
    label: "Home",
    href: "/",
  },
  {
    icon: BsBellFill,
    href: "/notifications",
    label: "Notifications",
  },
  {
    icon: FaUser,
    label: "Profile",
    href: `/users/123`,
  },
];
