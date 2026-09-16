import { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block space-y-1.5 ${className ?? ""}`}>
      <span className="block text-xs font-medium text-neutral-600">{label}</span>
      {children}
      {hint && <span className="block text-xs text-neutral-400">{hint}</span>}
    </label>
  );
}
