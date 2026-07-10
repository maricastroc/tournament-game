import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/PageHeading";
import { ConsoleScreen } from "@/components/console/ConsoleScreen";
import { getConsoleGroups } from "@/lib/data";
import { getCurrentTournamentId } from "@/lib/tournament/current";

export const metadata: Metadata = { title: "Console" };
export const dynamic = "force-dynamic";

export default async function ConsolePage() {
  const tournamentId = await getCurrentTournamentId();
  const groups = await getConsoleGroups(tournamentId);

  return (
    <div className="pb-8">
      <PageHeading
        eyebrow="Console"
        title="Edit a result"
        subtitle="Pick a match, adjust the score, and watch the group table recalculate — then save it, atomically."
      />
      <ConsoleScreen groups={groups} />
    </div>
  );
}
