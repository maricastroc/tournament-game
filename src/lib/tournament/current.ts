import { cookies } from "next/headers";
import { ApiError, api } from "@/lib/api/client";
import { CURRENT_TOURNAMENT_COOKIE, DEMO_TOURNAMENT_ID } from "./constants";

export { CURRENT_TOURNAMENT_COOKIE, DEMO_TOURNAMENT_ID } from "./constants";

const LIVE_ENABLED = process.env.NEXT_PUBLIC_USE_LIVE_API !== "false";

export async function getCurrentTournamentId(): Promise<number> {
  const store = await cookies();
  const raw = store.get(CURRENT_TOURNAMENT_COOKIE)?.value;
  const id = raw ? Number(raw) : Number.NaN;

  if (!Number.isInteger(id) || id <= 0 || id === DEMO_TOURNAMENT_ID) {
    return DEMO_TOURNAMENT_ID;
  }

  // A stale cookie can point to a tournament that no longer exists — e.g. after a
  // reseed or a deletion. Rather than rendering an empty shell forever, ignore it
  // and fall back to the demo tournament.
  if (LIVE_ENABLED && !(await tournamentExists(id))) {
    return DEMO_TOURNAMENT_ID;
  }

  return id;
}

async function tournamentExists(id: number): Promise<boolean> {
  try {
    await api.getTournament(id);
    return true;
  } catch (error) {
    // Only a definitive 404 means "gone" — keep the id on transient errors so a
    // real tournament isn't demoted to the demo on a network blip.
    if (error instanceof ApiError && error.status === 404) return false;
    return true;
  }
}
