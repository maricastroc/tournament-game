import type { Team } from "@/lib/types";

export function Flag({
  team,
  className = "",
}: {
  team: Pick<Team, "flag" | "code" | "name">;
  className?: string;
}) {
  if (team.flag) {
    return (
      <span className={`inline-block leading-none ${className}`} aria-hidden="true">
        {team.flag}
      </span>
    );
  }

  // Self-contained: the caller's className sizes the emoji glyph (e.g. w-5 text-[17px]),
  // which would crush a 2–3 letter code — so the code chip keeps its own small, content-width type.
  return (
    <span
      className="inline-grid min-w-5 place-items-center rounded-[5px] border border-line bg-surface-3 px-1 py-0.5 font-mono text-[9px] font-semibold leading-none tracking-wide text-ink-mute"
      aria-hidden="true"
    >
      {team.code ?? team.name.slice(0, 3).toUpperCase()}
    </span>
  );
}
