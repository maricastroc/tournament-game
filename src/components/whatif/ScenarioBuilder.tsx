"use client";

import type { ScenarioResult, WhatIfFixture } from "@/lib/types";
import { Select } from "@/components/ui/Select";
import { Stepper } from "@/components/console/Stepper";
import { useScenarioEditor } from "./useScenarioEditor";
import { ScenarioPins } from "./ScenarioPins";

interface ScenarioBuilderProps {
  fixtures: WhatIfFixture[];
  pins: Map<number, ScenarioResult>;
  onPin: (result: ScenarioResult) => void;
  onUnpin: (fixtureId: number) => void;
  onReset: () => void;
}

export function ScenarioBuilder({ fixtures, pins, onPin, onUnpin, onReset }: ScenarioBuilderProps) {
  const editor = useScenarioEditor(fixtures, pins);
  const { selected, home, away, homePens, awayPens, shootout } = editor;

  if (!selected) {
    return (
      <div className="rounded-md border border-dashed border-line-2 px-6 py-12 text-center text-[14px] text-ink-mute">
        This tournament has no matches to play with yet.
      </div>
    );
  }

  return (
    <div>
      <span className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-mute">
        Pick a match
      </span>
      <Select
        value={String(selected.id)}
        onValueChange={(next) => editor.reselect(Number(next))}
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
        <Side team={selected.home} value={home} onChange={editor.setHome} />
        <span className="font-mono text-[14px] text-ink-mute">×</span>
        <Side team={selected.away} value={away} onChange={editor.setAway} />
      </div>

      {shootout && (
        <div className="mt-2 flex items-center justify-center gap-4 rounded-md border border-dashed border-line-2 px-5 py-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-mute">
            Penalties
          </span>
          <Stepper
            value={homePens}
            onChange={editor.setHomePens}
            label={`${selected.home.name} penalties`}
          />
          <span className="font-mono text-[13px] text-ink-mute">×</span>
          <Stepper
            value={awayPens}
            onChange={editor.setAwayPens}
            label={`${selected.away.name} penalties`}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => onPin(editor.toResult())}
        className="mt-4 flex w-full items-center justify-center rounded-md bg-amber px-4 py-3 text-[15px] font-bold text-[#1a1205] transition-all duration-150 hover:-translate-y-0.5 hover:brightness-[1.07] active:translate-y-0 active:scale-[0.99]"
      >
        {pins.has(selected.id) ? "Update this result" : "Pin this result"}
      </button>

      <ScenarioPins fixtures={fixtures} pins={pins} onUnpin={onUnpin} onReset={onReset} />
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
