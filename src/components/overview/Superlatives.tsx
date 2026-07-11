import type { Superlative } from "@/lib/types";
import { Flag } from "@/components/ui/Flag";

export function Superlatives({ items }: { items: Superlative[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-[7px] border border-line bg-surface px-3.5 py-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-mute">
            {item.label}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[15px] font-medium text-ink">
            <Flag team={item.team} className="text-[16px]" />
            <span className="truncate">{item.team.name}</span>
          </div>
          <div className="mt-1 font-mono text-[12px] text-ink-dim">{item.detail}</div>
        </div>
      ))}
    </div>
  );
}
