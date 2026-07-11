import type { FixtureDetail, GroupDetail } from "@/lib/types";
import { Flag } from "@/components/ui/Flag";

function FixtureRow({ fixture }: { fixture: FixtureDetail }) {
  const { home, away, homeScore, awayScore, status } = fixture;
  if (!home || !away) return null;

  const played = status === "finished" && homeScore != null && awayScore != null;

  return (
    <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-line py-2.5 text-[13px] first:border-t-0">
      <span className="flex min-w-0 items-center justify-end gap-2">
        <span className="truncate text-right">{home.name}</span>
        <Flag team={home} className="text-[15px]" />
      </span>
      {played ? (
        <span className="rounded-[5px] border border-line-2 bg-surface px-2.5 py-1 font-mono text-[13px] font-bold tabular-nums text-ink">
          {homeScore} <span className="text-ink-mute">–</span> {awayScore}
        </span>
      ) : (
        <span className="px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-ink-mute">
          vs
        </span>
      )}
      <span className="flex min-w-0 items-center gap-2">
        <Flag team={away} className="text-[15px]" />
        <span className="truncate">{away.name}</span>
      </span>
    </li>
  );
}

export function GroupResults({ groups }: { groups: GroupDetail[] }) {
  const playable = groups.filter((group) => group.fixtures.some((f) => f.home && f.away));

  if (playable.length === 0) {
    return (
      <div className="px-5 pt-3 sm:px-6">
        <div className="rounded-[11px] border border-dashed border-line-2 px-6 py-12 text-center text-[14px] text-ink-mute">
          No group fixtures yet.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 px-5 pt-3 sm:px-6 lg:grid-cols-2">
      {playable.map((group) => (
        <section key={group.id} className="rounded-md border border-line bg-surface-2/60 p-5">
          <header className="mb-2 flex items-center gap-2.5">
            <span className="eyebrow">Group</span>
            <span className="rounded-[5px] border border-amber-line px-1.5 py-px font-mono text-[11px] uppercase tracking-[0.08em] text-amber-ink">
              {group.name}
            </span>
          </header>
          <ul>
            {group.fixtures.map((fixture) => (
              <FixtureRow key={fixture.id} fixture={fixture} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
