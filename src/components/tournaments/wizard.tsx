export function Steps({ step }: { step: number }) {
  const labels = ["Name", "Teams", "Groups"];
  return (
    <div className="mb-6 flex items-center gap-2">
      {labels.map((label, index) => {
        const n = index + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <span
              className={[
                "grid h-6 w-6 place-items-center rounded-full font-mono text-[11px] font-bold",
                active
                  ? "bg-amber text-[#1a1205]"
                  : done
                    ? "border border-amber-line text-amber-ink"
                    : "border border-line-2 text-ink-mute",
              ].join(" ")}
            >
              {n}
            </span>
            <span
              className={`font-mono text-[10.5px] uppercase tracking-[0.1em] ${active ? "text-ink" : "text-ink-mute"}`}
            >
              {label}
            </span>
            {index < labels.length - 1 && <span className="h-px flex-1 bg-line" />}
          </div>
        );
      })}
    </div>
  );
}

export function StepCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up rounded-[13px] border border-line bg-surface-2/50 p-5">
      <h2 className="mb-4 font-serif text-[19px] font-semibold tracking-[-0.01em]">{title}</h2>
      {children}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-mute">
        {label}
      </div>
      {children}
    </div>
  );
}

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: number[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={[
            "flex-1 rounded-[7px] border py-2 text-[13px] transition-colors",
            option === value
              ? "border-line-2 bg-surface-3 text-ink"
              : "border-line bg-surface-2 text-ink-mute hover:text-ink-dim",
          ].join(" ")}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function WizardButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-5 flex w-full items-center justify-center rounded-[11px] bg-amber px-4 py-3 text-[14px] font-bold text-[#1a1205] shadow-[0_8px_22px_-8px_rgba(242,169,59,0.6)] transition-all duration-150 enabled:hover:brightness-105 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
    >
      {children}
    </button>
  );
}
