"use client";
import { ComponentProps, forwardRef } from "react";

type Props = {
  label?: string;
} & Omit<ComponentProps<"input">, "className" | "ref">;

const Input = forwardRef<HTMLInputElement, Props>(
  ({ id, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="text-xl text-white font-semibold mb-2">
            {label}
          </label>
        )}
        <input
          {...props}
          className="w-full p-4 text-lg bg-black border-2 border-neutral-800 rounded-md outline-none text-white focus:border-sky-500 focus:border-2 transition-all duration-300 disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed"
          ref={ref}
          id={id}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
