"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Tab = "table" | "results";

const TABS: { key: Tab; label: string }[] = [
  { key: "table", label: "Table" },
  { key: "results", label: "Results" },
];

export function GroupStageTabs({ table, results }: { table: ReactNode; results: ReactNode }) {
  const [tab, setTab] = useState<Tab>("table");

  return (
    <>
      <div className="flex gap-2 px-5 pt-4 sm:px-6">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            aria-pressed={tab === key}
            className={[
              "rounded-md border px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors",
              tab === key
                ? "border-amber bg-amber font-bold text-[#1a1205]"
                : "border-line-2 text-ink-dim hover:border-amber-line hover:text-ink",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "table" ? table : results}
    </>
  );
}
