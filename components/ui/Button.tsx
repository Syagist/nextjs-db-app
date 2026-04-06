// components/ui/Button.tsx
"use client";

import React from "react";
import clsx from "clsx";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

const primaryClasses =
  "bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60";

const secondaryClasses =
  "rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50";

export function Button({
  size = "md",
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const allButtonsClass = 'transition cursor-pointer'
  const baseClass = variant === "primary" ? primaryClasses : secondaryClasses;
  return (
    <button
      className={clsx(allButtonsClass, baseClass, sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

// Short aliases for clarity
export const PrimaryButton = (props: Omit<ButtonProps, "variant">) => (
  <Button variant="primary" {...props} />
);
export const SecondaryButton = (props: Omit<ButtonProps, "variant">) => (
  <Button variant="secondary" {...props} />
);
