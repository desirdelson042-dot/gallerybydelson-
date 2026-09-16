import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-neutral-900 text-white hover:bg-neutral-700",
  secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
  ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
};

export function Button({
  variant = "secondary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
    />
  );
}
