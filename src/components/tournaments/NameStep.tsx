import { StepCard, WizardButton } from "./wizard";

interface NameStepProps {
  name: string;
  onNameChange: (name: string) => void;
  busy: boolean;
  onSubmit: () => void;
}

export function NameStep({ name, onNameChange, busy, onSubmit }: NameStepProps) {
  return (
    <StepCard title="Name your tournament">
      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="e.g. Copa Atlas 2026"
        className="w-full rounded-[9px] border border-line-2 bg-surface-2 px-3.5 py-3 text-[15px] text-ink outline-none transition-colors focus:border-amber-line"
      />
      <WizardButton disabled={busy || name.trim().length < 2} onClick={onSubmit}>
        {busy ? "Creating…" : "Create & continue"}
      </WizardButton>
    </StepCard>
  );
}
