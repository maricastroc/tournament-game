import { X } from "lucide-react";
import type { ScenarioResult, WhatIfFixture } from "@/lib/types";

interface ScenarioPinsProps {
  fixtures: WhatIfFixture[];
  pins: Map<number, ScenarioResult>;
  onUnpin: (fixtureId: number) => void;
  onReset: () => void;
}

export function ScenarioPins({ fixtures, pins, onUnpin, onReset }: ScenarioPinsProps) {
  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-mute">
          Scenario · {pins.size} pinned
        </span>
        {pins.size > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="font-mono text-[11px] text-ink-mute underline-offset-2 hover:text-ink hover:underline"
          >
            reset
          </button>
        )}
      </div>

      {pins.size === 0 ? (
        <p className="rounded-md border border-dashed border-line-2 px-4 py-5 text-center text-[12.5px] text-ink-mute">
          Nothing pinned — the tables show reality. Pin a result to project a what-if.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {[...pins.values()].map((result) => {
            const fixture = fixtures.find((f) => f.id === result.fixtureId);
            if (!fixture) return null;
            return (
              <li
                key={result.fixtureId}
                className="flex items-center justify-between gap-2 rounded-md border border-line bg-surface px-3 py-2"
              >
                <span className="min-w-0 truncate text-[12.5px]">
                  <span className="text-ink-mute">{fixture.label.split(" · ")[0]} · </span>
                  <span className="font-semibold">
                    {fixture.home.name} {result.homeScore}–{result.awayScore} {fixture.away.name}
                  </span>
                  {result.homePenalties != null && result.awayPenalties != null && (
                    <span className="font-mono text-[11px] text-ink-mute">
                      {" "}
                      (pens {result.homePenalties}–{result.awayPenalties})
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  aria-label="Remove from scenario"
                  onClick={() => onUnpin(result.fixtureId)}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-sm text-ink-mute transition-colors hover:bg-surface-3 hover:text-loss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
