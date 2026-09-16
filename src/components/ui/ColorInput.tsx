export function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-10 cursor-pointer rounded-md border border-neutral-200 bg-white p-1"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
      />
    </div>
  );
}
