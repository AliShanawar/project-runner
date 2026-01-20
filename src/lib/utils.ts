import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import React, { type ReactNode } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showSuccessToast(message: string | ReactNode) {
  toast.custom(() =>
    React.createElement(
      "div",
      { className: "flex items-center gap-3" },
      React.createElement("img", {
        src: "/success.svg",
        alt: "Success",
        className: "h-8 w-8 shrink-0",
      }),
      React.createElement(
        "div",
        { className: "text-sm font-medium text-gray-900" },
        message
      )
    )
  );
}
