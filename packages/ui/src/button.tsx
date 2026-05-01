"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button = ({ children, className, type = "button", ...props }: ButtonProps) => {
  return (
    <button className={className} type={type} {...props}>
      {children}
    </button>
  );
};
