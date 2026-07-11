import type { Bracket as BracketData, BracketTie } from "@/lib/types";
import { Bracket } from "@/components/bracket/Bracket";
import { MatchCard } from "@/components/bracket/MatchCard";

interface ProjectedBracketProps {
  bracket: BracketData;
  baseline: BracketData;
}

const sideKey = (tie: BracketTie) =>
  `${tie.home.team?.id ?? "-"}:${tie.away.team?.id ?? "-"}:${tie.winnerId ?? "-"}`;

export function ProjectedBracket({ bracket, baseline }: ProjectedBracketProps) {
  const baselineByTie = new Map(baseline.ties.map((tie) => [tie.id, sideKey(tie)]));

  const changed = (tie: BracketTie) => {
    const before = baselineByTie.get(tie.id);
    return before !== undefined && before !== sideKey(tie);
  };

  return (
    <Bracket
      data={bracket}
      renderCard={(tie) =>
        changed(tie) ? (
          <div className="rounded-[9px] ring-1 ring-amber-line ring-offset-2 ring-offset-surface">
            <MatchCard tie={tie} />
          </div>
        ) : (
          <MatchCard tie={tie} />
        )
      }
    />
  );
}
