import { formatGoalDifference } from "@/lib/format";
import type { StandingRow, TiebreakNote } from "@/lib/types";

export const GROUP_IDS = [1, 2, 3, 4] as const;
const GROUP_NAMES: Record<number, string> = { 1: "A", 2: "B", 3: "C", 4: "D" };

export function groupName(id: number): string {
  return GROUP_NAMES[id] ?? String(id);
}

function separator(a: StandingRow, b: StandingRow): string {
  if (a.goalDifference !== b.goalDifference) {
    return `goal difference — ${formatGoalDifference(a.goalDifference)} × ${formatGoalDifference(b.goalDifference)}`;
  }
  if (a.goalsFor !== b.goalsFor) {
    return `goals scored — ${a.goalsFor} × ${b.goalsFor}`;
  }
  return "the head-to-head record";
}

export function buildTiebreakNote(standings: StandingRow[]): TiebreakNote | undefined {
  const [first, second] = standings;
  if (!first || !second || first.points !== second.points) return undefined;
  if (first.played === 0) return undefined;

  return {
    teams: [first.team.name, second.team.name],
    points: first.points,
    detail:
      `${first.team.name} and ${second.team.name} both finished on ${first.points} pts. ` +
      `${first.team.name} stays ahead on ${separator(first, second)}.`,
  };
}
