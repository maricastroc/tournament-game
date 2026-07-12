import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { LiveTournamentProvider } from "@/components/live/LiveTournamentProvider";
import { getTournamentMeta } from "@/lib/data";
import { getCurrentTournamentId } from "@/lib/tournament/current";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const tournamentId = await getCurrentTournamentId();
  const meta = await getTournamentMeta(tournamentId);
  return (
    <LiveTournamentProvider tournamentId={tournamentId}>
      <AppShell meta={meta}>{children}</AppShell>
    </LiveTournamentProvider>
  );
}
