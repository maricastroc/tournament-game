import { PageHeading } from "@/components/ui/PageHeading";
import { StandingsTable } from "@/components/standings/StandingsTable";
import { TiebreakNote } from "@/components/standings/TiebreakNote";
import { LiveCard } from "@/components/overview/LiveCard";
import { NextCard } from "@/components/overview/NextCard";
import { StatTiles } from "@/components/overview/StatTiles";
import { TitleRaceTeaser } from "@/components/overview/TitleRaceTeaser";
import { ChampionRoad } from "@/components/overview/ChampionRoad";
import { Superlatives } from "@/components/overview/Superlatives";
import { TheFinalCard } from "@/components/overview/TheFinalCard";
import { ChampionCard } from "@/components/bracket/ChampionCard";
import { getOverview } from "@/lib/data";
import { getCurrentTournamentId } from "@/lib/tournament/current";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const tournamentId = await getCurrentTournamentId();
  const { featuredGroup, liveFixture, nextFixture, stats, titleOdds, champion, recap } =
    await getOverview(tournamentId);
  const completed = champion !== null;

  return (
    <div className="pb-8">
      <PageHeading
        eyebrow={completed ? "Final result" : "Today"}
        title={completed ? "How it ended" : "What needs your attention"}
        subtitle={
          completed
            ? "The champion's road to the trophy, the final that settled it, and how the numbers shook out."
            : "The next match to decide, the group where qualification is tightest, and the race for the trophy — in one place."
        }
      />

      {champion && recap ? (
        <div className="grid grid-cols-1 gap-y-8 px-5 pt-4 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:gap-x-8 lg:gap-y-0">
          <section className="min-w-0 lg:border-r lg:border-line lg:pr-8">
            <ChampionRoad champion={champion} road={recap.championRoad} />
            {recap.superlatives.length > 0 && (
              <div className="mt-7">
                <div className="eyebrow mb-3.5">Tournament highlights</div>
                <Superlatives items={recap.superlatives} />
              </div>
            )}
          </section>

          <aside className="flex min-w-0 flex-col gap-4">
            <ChampionCard champion={champion} />
            {recap.final && <TheFinalCard final={recap.final} />}
            <StatTiles stats={stats} />
          </aside>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-8 px-5 pt-4 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:gap-x-8 lg:gap-y-0">
          <section className="min-w-0 lg:border-r lg:border-line lg:pr-8">
            {featuredGroup ? (
              <>
                <div className="mb-3.5 flex items-center gap-2.5">
                  <span className="eyebrow">Standings</span>
                  <span className="rounded-[5px] border border-amber-line px-1.5 py-px font-mono text-[11px] uppercase tracking-[0.08em] text-amber-ink">
                    Group {featuredGroup.name}
                  </span>
                </div>
                <StandingsTable group={featuredGroup} />
                {featuredGroup.tiebreakNote && <TiebreakNote note={featuredGroup.tiebreakNote} />}
              </>
            ) : (
              <div className="rounded-[11px] border border-dashed border-line-2 px-5 py-10 text-center text-[14px] text-ink-mute">
                No group stage yet. Build one from the tournaments screen.
              </div>
            )}
          </section>

          <aside className="flex min-w-0 flex-col gap-4">
            {liveFixture && <LiveCard fixture={liveFixture} />}
            {nextFixture && <NextCard fixture={nextFixture} />}
            {titleOdds.length > 1 ? (
              <TitleRaceTeaser odds={titleOdds} />
            ) : (
              <StatTiles stats={stats} />
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
