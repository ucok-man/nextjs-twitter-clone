import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  secondary?: boolean;
  fullWidth?: boolean;
  large?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  outline?: boolean;
  type?: "submit" | "button";
}

export default function Button(props: Props) {
  return (
    <button
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
      className={`disabled:opacity-70 disabled:cursor-not-allowed rounded-full font-semibold hover:opacity-80 transition border-2
          ${props.fullWidth ? "w-full" : "w-fit"}
          ${props.secondary ? "bg-white" : "bg-sky-500"}
          ${props.secondary ? "text-black/80" : "text-white"}
          ${props.secondary ? "border-black" : "border-sky-500"}
          ${props.large ? "text-xl" : "text-md"}
          ${props.large ? "px-5" : "px-4"}
          ${props.large ? "py-3" : "py-2"}
          ${props.outline ? "bg-transparent" : ""}
          ${props.outline ? "border-white" : ""}
          ${props.outline ? "text-white" : ""}
        `}
    >
      {props.children}
    </button>
  );
}
