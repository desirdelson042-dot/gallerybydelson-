"use client";

import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
}: {
  tabs: { label: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex gap-1 border-b border-neutral-200">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium transition",
              active === i
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-700",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-5">{tabs[active].content}</div>
    </div>
  );
}
