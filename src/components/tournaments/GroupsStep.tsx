import type { Team } from "@/lib/types";
import { distribute, groupOptions, GROUP_LETTERS } from "@/lib/tournament/draft";
import { Field, Segmented, StepCard, WizardButton } from "./wizard";

interface GroupsStepProps {
  teams: Team[];
  numGroups: number;
  setNumGroups: (n: number) => void;
  qualifyCount: number;
  setQualifyCount: (n: number) => void;
  withKnockout: boolean;
  setWithKnockout: (on: boolean) => void;
  bracketValid: boolean;
  busy: boolean;
  onSubmit: () => void;
}

export function GroupsStep({
  teams,
  numGroups,
  setNumGroups,
  qualifyCount,
  setQualifyCount,
  withKnockout,
  setWithKnockout,
  bracketValid,
  busy,
  onSubmit,
}: GroupsStepProps) {
  return (
    <StepCard title="Split into groups">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Groups">
          <Segmented
            options={groupOptions(teams.length)}
            value={numGroups}
            onChange={setNumGroups}
          />
        </Field>
        <Field label="Advance per group">
          <Segmented options={[1, 2]} value={qualifyCount} onChange={setQualifyCount} />
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {distribute(teams, numGroups).map((teamIds, index) => (
          <div key={index} className="rounded-[9px] border border-line bg-surface p-3">
            <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-amber-ink">
              Group {GROUP_LETTERS[index]}
            </div>
            <ul className="flex flex-col gap-1">
              {teamIds.map((id) => {
                const team = teams.find((t) => t.id === id);
                return (
                  <li key={id} className="flex items-center gap-2 text-[13px] text-ink-dim">
                    <span>{team?.flag}</span>
                    <span className="truncate">{team?.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <label className="mt-4 flex items-center gap-2.5 text-[13px] text-ink-dim">
        <input
          type="checkbox"
          checked={withKnockout && bracketValid}
          disabled={!bracketValid}
          onChange={(e) => setWithKnockout(e.target.checked)}
          className="h-4 w-4 accent-[var(--color-amber)]"
        />
        Also generate the knockout bracket
        {!bracketValid && (
          <span className="font-mono text-[10.5px] text-ink-mute">
            (needs 4, 8 or 16 qualifiers)
          </span>
        )}
      </label>

      <WizardButton disabled={busy} onClick={onSubmit}>
        {busy ? "Generating…" : "Create tournament"}
      </WizardButton>
    </StepCard>
  );
}
