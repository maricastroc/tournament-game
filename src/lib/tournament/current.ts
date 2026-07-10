import { cookies } from "next/headers";
import { CURRENT_TOURNAMENT_COOKIE, DEMO_TOURNAMENT_ID } from "./constants";

export { CURRENT_TOURNAMENT_COOKIE, DEMO_TOURNAMENT_ID } from "./constants";

export async function getCurrentTournamentId(): Promise<number> {
  const store = await cookies();
  const raw = store.get(CURRENT_TOURNAMENT_COOKIE)?.value;
  const id = raw ? Number(raw) : Number.NaN;
  return Number.isInteger(id) && id > 0 ? id : DEMO_TOURNAMENT_ID;
}
