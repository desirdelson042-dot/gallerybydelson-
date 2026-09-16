import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 disabled:opacity-50"
    >
      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-neutral-900" : "bg-neutral-200",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4 left-0.5" : "left-0.5",
          )}
        />
      </span>
      {label && <span className="text-sm text-neutral-700">{label}</span>}
    </button>
  );
}
