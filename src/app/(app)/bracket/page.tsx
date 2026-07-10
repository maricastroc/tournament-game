import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/PageHeading";
import { Bracket } from "@/components/bracket/Bracket";
import { BracketLegend } from "@/components/bracket/BracketLegend";
import { getBracket } from "@/lib/data";
import { getCurrentTournamentId } from "@/lib/tournament/current";

export const metadata: Metadata = { title: "Bracket" };
export const dynamic = "force-dynamic";

export default async function BracketPage() {
  const tournamentId = await getCurrentTournamentId();
  const bracket = await getBracket(tournamentId);

  return (
    <div className="pb-4">
      <PageHeading
        eyebrow="Knockout"
        title="Bracket"
        subtitle="Every winner advances through the bracket — the path to the trophy, updated with each result."
        actions={bracket.ties.length > 0 ? <BracketLegend /> : undefined}
      />
      {bracket.ties.length > 0 ? (
        <Bracket data={bracket} />
      ) : (
        <div className="px-5 pt-3 sm:px-6">
          <div className="rounded-[11px] border border-dashed border-line-2 px-6 py-12 text-center text-[14px] text-ink-mute">
            No knockout bracket yet — generate it once the group stage is set.
          </div>
        </div>
      )}
    </div>
  );
}
