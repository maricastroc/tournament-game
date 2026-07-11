import type { ReactNode } from "react";
import type { StandingRow } from "@/lib/types";

function Badge({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span
      className={`rounded-[5px] border px-1.5 py-px font-mono text-[10px] uppercase tracking-[0.06em] ${className}`}
    >
      {children}
    </span>
  );
}

export function OutlookBadge({ row }: { row: StandingRow }) {
  if (!row.outlook) return null;
  if (row.outlook === "clinched") {
    return <Badge className="border-win/40 bg-win/10 text-win">through</Badge>;
  }
  if (row.outlook === "eliminated") {
    return <Badge className="border-line-2 text-ink-mute">out</Badge>;
  }
  const pct = Math.round((row.advanceProb ?? 0) * 100);
  return (
    <Badge className="border-amber-line bg-amber-soft text-amber-ink">
      {pct < 1 ? "<1%" : `${pct}%`}
    </Badge>
  );
}
