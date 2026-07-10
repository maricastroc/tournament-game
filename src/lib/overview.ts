import { roundName } from "@/lib/format";
import type { Bracket, Fixture, Group, GroupDetail } from "@/lib/types";

// How up-for-grabs a group still is: Σ p(1−p) over the advance odds — peaks when a spot
// is a coin-flip, drops to zero once every team is settled.
function unsettledScore(group: Group): number {
  return group.standings.reduce((sum, row) => {
    const prob = row.advanceProb ?? (row.qualified ? 1 : 0);
    return sum + prob * (1 - prob);
  }, 0);
}

// Gap across the qualification line — points first, then goal difference. Smaller = tighter.
function cutMargin(group: Group): number {
  const last = group.standings[group.qualifyCount - 1];
  const first = group.standings[group.qualifyCount];
  if (!last || !first) return Number.POSITIVE_INFINITY;
  return (last.points - first.points) * 1000 + (last.goalDifference - first.goalDifference);
}

// The group most worth watching: least settled by the forecast, breaking ties toward the
// tightest cut line (which is what carries a fully-played stage where every odd is 0 or 1).
export function pickFeaturedGroup(groups: Group[]): Group | null {
  if (groups.length === 0) return null;
  return groups
    .map((group) => ({ group, unsettled: unsettledScore(group), margin: cutMargin(group) }))
    .sort((a, b) => b.unsettled - a.unsettled || a.margin - b.margin)[0].group;
}

function nextGroupFixture(consoleGroups: GroupDetail[], featured: Group | null): Fixture | null {
  // Look at the most in-play group first, so "next up" points at what's actually at stake.
  const ordered = featured
    ? [...consoleGroups].sort((a, b) => Number(b.id === featured.id) - Number(a.id === featured.id))
    : consoleGroups;

  for (const group of ordered) {
    const fixture = group.fixtures.find(
      (candidate) => candidate.status !== "finished" && candidate.home && candidate.away,
    );
    if (fixture?.home && fixture.away) {
      return {
        id: fixture.id,
        home: fixture.home,
        away: fixture.away,
        homeScore: null,
        awayScore: null,
        status: "scheduled",
        groupName: `Group ${group.name} · next up`,
        note: "the next result to move this group",
        version: fixture.version,
      };
    }
  }
  return null;
}

function nextReadyTie(bracket: Bracket): Fixture | null {
  const maxRound = Math.max(...bracket.ties.map((tie) => tie.round), 1);
  const tie = bracket.ties.find(
    (candidate) => candidate.status === "ready" && candidate.home.team && candidate.away.team,
  );
  if (!tie?.home.team || !tie.away.team) return null;

  return {
    id: tie.id,
    home: tie.home.team,
    away: tie.away.team,
    homeScore: null,
    awayScore: null,
    status: "scheduled",
    groupName: `${roundName(tie.round, maxRound)} · next up`,
    note: "both teams confirmed — awaiting kickoff",
    version: 0,
  };
}

// The next unplayed match that matters — a scheduled group game while the groups are still
// running, otherwise the next knockout tie whose two sides are known.
export function pickNextFixture(
  consoleGroups: GroupDetail[],
  featured: Group | null,
  bracket: Bracket,
): Fixture | null {
  return nextGroupFixture(consoleGroups, featured) ?? nextReadyTie(bracket);
}
