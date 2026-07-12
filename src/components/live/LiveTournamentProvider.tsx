"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLiveTournament, type LiveTournamentState } from "@/lib/live/useLiveTournament";

const LiveTournamentContext = createContext<LiveTournamentState>({
  status: "connecting",
  lastUpdateAt: null,
});

/**
 * Mounts a single SSE subscription for the current tournament. Because it wraps the app shell it
 * survives in-app navigation (standings → bracket → console) as one stable connection, and it
 * reconnects only when the tournament id itself changes. The subscription drives router.refresh()
 * on every newer revision; this provider just surfaces the connection status (e.g. to the Topbar).
 */
export function LiveTournamentProvider({
  tournamentId,
  children,
}: {
  tournamentId: number | null;
  children: ReactNode;
}) {
  const live = useLiveTournament(tournamentId);
  return <LiveTournamentContext.Provider value={live}>{children}</LiveTournamentContext.Provider>;
}

export function useLiveStatus(): LiveTournamentState {
  return useContext(LiveTournamentContext);
}
