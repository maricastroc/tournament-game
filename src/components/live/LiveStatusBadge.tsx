"use client";

import { useEffect, useState } from "react";
import { useLiveStatus } from "./LiveTournamentProvider";
import type { LiveStatus } from "@/lib/live/useLiveTournament";

const STATUS: Record<
  LiveStatus,
  { label: string; dot: string; text: string; ring: string; pulse: boolean }
> = {
  live: {
    label: "Live",
    dot: "bg-win",
    text: "text-win",
    ring: "border-win/35 bg-win/8",
    pulse: false,
  },
  connecting: {
    label: "Connecting",
    dot: "bg-amber",
    text: "text-amber-ink",
    ring: "border-amber-line bg-amber-soft",
    pulse: true,
  },
  reconnecting: {
    label: "Reconnecting",
    dot: "bg-amber",
    text: "text-amber-ink",
    ring: "border-amber-line bg-amber-soft",
    pulse: true,
  },
  offline: {
    label: "Offline",
    dot: "bg-ink-mute",
    text: "text-ink-mute",
    ring: "border-line bg-surface-2/60",
    pulse: false,
  },
};

const UPDATED_MS = 1200;

export function LiveStatusBadge() {
  const { status, lastUpdateAt } = useLiveStatus();

  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  useEffect(() => {
    if (lastUpdateAt == null) return;
    const timer = setTimeout(() => setDismissedAt(lastUpdateAt), UPDATED_MS);
    return () => clearTimeout(timer);
  }, [lastUpdateAt]);

  const style = STATUS[status];
  const showUpdated = status === "live" && lastUpdateAt != null && dismissedAt !== lastUpdateAt;

  return (
    <span
      role="status"
      aria-live="polite"
      title={showUpdated ? "Just updated" : `Live updates: ${style.label.toLowerCase()}`}
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 font-mono text-[11px] tracking-[0.14em] ${style.ring} ${style.text}`}
    >
      <span
        className={`h-1.75 w-1.75 rounded-full ${showUpdated ? "bg-win" : style.dot} ${style.pulse ? "motion-safe:animate-pulse-live" : ""}`}
      />
      <span className="hidden sm:inline">{showUpdated ? "Updated" : style.label}</span>
    </span>
  );
}
