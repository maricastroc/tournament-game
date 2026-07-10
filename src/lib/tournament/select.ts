import { CURRENT_TOURNAMENT_COOKIE } from "./constants";

export function setCurrentTournamentCookie(id: number): void {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${CURRENT_TOURNAMENT_COOKIE}=${id}; path=/; max-age=${oneYear}; samesite=lax`;
}
