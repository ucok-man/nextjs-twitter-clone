"use client";
import { cn } from "@/lib/utils";
import { ComponentProps, forwardRef } from "react";

type Props = {
  label?: string;
} & Omit<ComponentProps<"textarea">, "ref">;

const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ id, label, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="text-xl text-white font-semibold mb-2">
            {label}
          </label>
        )}

        <textarea
          {...props}
          className={cn(
            "w-full p-4 text-lg bg-black border-2 border-neutral-800 rounded-md outline-none text-white focus:border-sky-500 focus:border-2 transition-all duration-300 disabled:bg-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed resize-none",
            className
          )}
          ref={ref}
          id={id}
        ></textarea>
      </div>
    );
  }
);

TextArea.displayName = "Textarea";
export default TextArea;
