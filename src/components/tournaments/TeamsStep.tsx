import type { Dispatch, SetStateAction } from "react";
import { Plus, X } from "lucide-react";
import type { DraftTeam } from "@/lib/tournament/draft";
import { StepCard, WizardButton } from "./wizard";

interface TeamsStepProps {
  drafts: DraftTeam[];
  setDrafts: Dispatch<SetStateAction<DraftTeam[]>>;
  validCount: number;
  busy: boolean;
  onSubmit: () => void;
}

function editDraft(
  setDrafts: Dispatch<SetStateAction<DraftTeam[]>>,
  index: number,
  patch: Partial<DraftTeam>,
) {
  setDrafts((drafts) => drafts.map((d, i) => (i === index ? { ...d, ...patch } : d)));
}

export function TeamsStep({ drafts, setDrafts, validCount, busy, onSubmit }: TeamsStepProps) {
  return (
    <StepCard title="Add the teams">
      <div className="flex flex-col gap-2">
        {drafts.map((draft, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={draft.flag}
              onChange={(e) => editDraft(setDrafts, index, { flag: e.target.value })}
              placeholder="🏳️"
              aria-label={`Flag for team ${index + 1}`}
              className="w-14 rounded-[9px] border border-line-2 bg-surface-2 px-2 py-2.5 text-center text-[18px] outline-none focus:border-amber-line"
            />
            <input
              value={draft.name}
              onChange={(e) => editDraft(setDrafts, index, { name: e.target.value })}
              placeholder={`Team ${index + 1}`}
              className="flex-1 rounded-[9px] border border-line-2 bg-surface-2 px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-amber-line"
            />
            <button
              type="button"
              onClick={() => setDrafts((d) => d.filter((_, i) => i !== index))}
              aria-label={`Remove team ${index + 1}`}
              className="grid h-[38px] w-[38px] place-items-center rounded-[9px] border border-line text-ink-mute transition-colors hover:border-loss/40 hover:text-loss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setDrafts((d) => [...d, { name: "", flag: "" }])}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[9px] border border-dashed border-line-2 py-2.5 text-[13px] text-ink-dim transition-colors hover:border-amber-line hover:text-amber-ink"
      >
        <Plus className="h-3.5 w-3.5" />
        Add team
      </button>

      <p className="mt-3 font-mono text-[11px] text-ink-mute">
        {validCount} teams · at least 4 needed
      </p>

      <WizardButton disabled={busy || validCount < 4} onClick={onSubmit}>
        {busy ? "Saving…" : "Continue"}
      </WizardButton>
    </StepCard>
  );
}
