"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { ScenarioResult } from "@/lib/types";
import type { WhatIfFixture } from "@/lib/data/scenario";
import { Select } from "@/components/ui/Select";
import { Stepper } from "@/components/console/Stepper";

interface ScenarioBuilderProps {
  fixtures: WhatIfFixture[];
  pins: Map<number, ScenarioResult>;
  onPin: (result: ScenarioResult) => void;
  onUnpin: (fixtureId: number) => void;
  onReset: () => void;
}

export function ScenarioBuilder({ fixtures, pins, onPin, onUnpin, onReset }: ScenarioBuilderProps) {
  const [selectedId, setSelectedId] = useState<number>(fixtures[0]?.id ?? 0);
  const selected = fixtures.find((fixture) => fixture.id === selectedId) ?? fixtures[0];

  const pinned = pins.get(selectedId);
  const [home, setHome] = useState(pinned?.homeScore ?? selected?.homeScore ?? 0);
  const [away, setAway] = useState(pinned?.awayScore ?? selected?.awayScore ?? 0);
  const [homePens, setHomePens] = useState(pinned?.homePenalties ?? 4);
  const [awayPens, setAwayPens] = useState(pinned?.awayPenalties ?? 2);

  if (!selected) {
    return (
      <div className="rounded-md border border-dashed border-line-2 px-6 py-12 text-center text-[14px] text-ink-mute">
        This tournament has no matches to play with yet.
      </div>
    );
  }

  const shootout = selected.isKnockout && home === away;

  const reselect = (id: number) => {
    const next = fixtures.find((fixture) => fixture.id === id);
    const existing = pins.get(id);
    setSelectedId(id);
    setHome(existing?.homeScore ?? next?.homeScore ?? 0);
    setAway(existing?.awayScore ?? next?.awayScore ?? 0);
    setHomePens(existing?.homePenalties ?? 4);
    setAwayPens(existing?.awayPenalties ?? 2);
  };

  const pin = () => {
    onPin({
      fixtureId: selected.id,
      homeScore: home,
      awayScore: away,
      homePenalties: shootout ? homePens : null,
      awayPenalties: shootout ? awayPens : null,
    });
  };

  return (
    <div>
      <span className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-mute">
        Pick a match
      </span>
      <Select
        value={String(selected.id)}
        onValueChange={(next) => reselect(Number(next))}
        ariaLabel="Match"
        triggerClassName="w-full"
        items={fixtures.map((fixture) => ({
          value: String(fixture.id),
          label: `${fixture.label}${
            fixture.status === "finished" ? ` (${fixture.homeScore}–${fixture.awayScore})` : ""
          }`,
        }))}
      />

      <div className="mt-4 flex items-center justify-center gap-4 rounded-md border border-line bg-surface-2 p-5">
        <Side team={selected.home} value={home} onChange={setHome} />
        <span className="font-mono text-[14px] text-ink-mute">×</span>
        <Side team={selected.away} value={away} onChange={setAway} />
      </div>

      {shootout && (
        <div className="mt-2 flex items-center justify-center gap-4 rounded-md border border-dashed border-line-2 px-5 py-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-mute">
            Penalties
          </span>
          <Stepper
            value={homePens}
            onChange={setHomePens}
            label={`${selected.home.name} penalties`}
          />
          <span className="font-mono text-[13px] text-ink-mute">×</span>
          <Stepper
            value={awayPens}
            onChange={setAwayPens}
            label={`${selected.away.name} penalties`}
          />
        </div>
      )}

      <button
        type="button"
        onClick={pin}
        className="mt-4 flex w-full items-center justify-center rounded-md bg-amber px-4 py-3 text-[15px] font-bold text-[#1a1205] transition-all duration-150 hover:-translate-y-0.5 hover:brightness-[1.07] active:translate-y-0 active:scale-[0.99]"
      >
        {pins.has(selected.id) ? "Update this result" : "Pin this result"}
      </button>

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
            Nothing pinned — the tables on the right show reality. Pin a result to project a
            what-if.
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
    </div>
  );
}

function Side({
  team,
  value,
  onChange,
}: {
  team: { name: string; flag?: string };
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex w-23 flex-col items-center gap-2">
      <span className="text-[28px] leading-none" aria-hidden="true">
        {team.flag}
      </span>
      <span className="text-center text-[13px] font-semibold">{team.name}</span>
      <Stepper value={value} onChange={onChange} label={team.name} />
    </div>
  );
}
