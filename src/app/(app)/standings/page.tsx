import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/PageHeading";
import { GroupCard } from "@/components/standings/GroupCard";
import { getGroups } from "@/lib/data";
import { getCurrentTournamentId } from "@/lib/tournament/current";

export const metadata: Metadata = { title: "Standings" };
export const dynamic = "force-dynamic";

export default async function StandingsPage() {
  const tournamentId = await getCurrentTournamentId();
  const groups = await getGroups(tournamentId);

  return (
    <div className="pb-8">
      <PageHeading
        eyebrow="Group stage"
        title="Standings"
        subtitle="A live projection of the matches — points, goal difference and the qualification cut, always recalculated."
      />
      {groups.length > 0 ? (
        <div className="grid gap-5 px-5 pt-3 sm:px-6 lg:grid-cols-2">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="px-5 pt-3 sm:px-6">
          <div className="rounded-[11px] border border-dashed border-line-2 px-6 py-12 text-center text-[14px] text-ink-mute">
            This tournament has no group stage yet.
          </div>
        </div>
      )}
    </div>
  );
}
