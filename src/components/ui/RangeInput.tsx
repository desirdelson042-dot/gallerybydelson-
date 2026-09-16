export function RangeInput({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.05,
  suffix,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-neutral-900"
      />
      <span className="w-14 shrink-0 text-right text-xs text-neutral-500">
        {value}
        {suffix}
      </span>
    </div>
  );
}
