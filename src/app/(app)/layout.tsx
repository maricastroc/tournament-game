import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { getTournamentMeta } from "@/lib/data";
import { getCurrentTournamentId } from "@/lib/tournament/current";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const tournamentId = await getCurrentTournamentId();
  const meta = await getTournamentMeta(tournamentId);
  return <AppShell meta={meta}>{children}</AppShell>;
}
