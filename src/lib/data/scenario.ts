import { api, type ScenarioInput } from "@/lib/api/client";
import { roundName, roundTag } from "@/lib/format";
import type {
  Bracket,
  ScenarioProjection,
  ScenarioResult,
  StandingRow,
  Team,
  WhatIfFixture,
  WhatIfSetup,
} from "@/lib/types";
import { DEMO_TOURNAMENT_ID } from "@/lib/tournament/constants";
import { TEAMS } from "./copa-atlas";
import { demoProjectScenario, demoWhatIfSetup } from "./demo-scenario";

// Re-exported for the what-if components; the shapes live in types.ts to keep the demo
// projector (demo-scenario.ts) free of a circular import back into this module.
export type { WhatIfFixture, WhatIfSetup } from "@/lib/types";

const LIVE_ENABLED = process.env.NEXT_PUBLIC_USE_LIVE_API !== "false";
const EMPTY_SETUP: WhatIfSetup = { fixtures: [], baseline: { groups: [], bracket: null } };

function enrichTeam(team: Team | null): Team | null {
  return team === null ? null : (TEAMS[team.id] ?? team);
}

function enrichRow(row: StandingRow): StandingRow {
  return { ...row, team: TEAMS[row.team.id] ?? row.team };
}

/**
 * The scenario bracket arrives resolved but flat (no slot, no "Winner X" labels),
 * mirroring the raw bracket endpoint. This finishes it exactly like the live bracket
 * seam does, so it renders through the same components.
 */
function finalizeBracket(bracket: Bracket): Bracket {
  const ties = [...bracket.ties].sort((a, b) => a.round - b.round || a.id - b.id);

  const slotByRound = new Map<number, number>();
  for (const tie of ties) {
    const slot = (slotByRound.get(tie.round) ?? 0) + 1;
    slotByRound.set(tie.round, slot);
    tie.slot = slot;
    tie.home = { ...tie.home, team: enrichTeam(tie.home.team) };
    tie.away = { ...tie.away, team: enrichTeam(tie.away.team) };
  }

  const maxRound = Math.max(...ties.map((tie) => tie.round), 1);
  for (const tie of ties) {
    if (tie.round === 1) continue;
    if (!tie.home.team) {
      tie.home.placeholder ??= `Winner ${roundTag(tie.round - 1, maxRound, tie.slot * 2 - 1)}`;
    }
    if (!tie.away.team) {
      tie.away.placeholder ??= `Winner ${roundTag(tie.round - 1, maxRound, tie.slot * 2)}`;
    }
  }

  return { ...bracket, champion: enrichTeam(bracket.champion), ties };
}

function enrich(projection: ScenarioProjection): ScenarioProjection {
  return {
    groups: projection.groups.map((group) => ({
      ...group,
      standings: group.standings.map(enrichRow),
    })),
    bracket: projection.bracket ? finalizeBracket(projection.bracket) : null,
  };
}

/** Projects the scenario through the API's pure engines and enriches team names/flags. */
async function liveProjectScenario(
  tournamentId: number,
  results: ScenarioResult[],
): Promise<ScenarioProjection> {
  const input: ScenarioInput[] = results.map((result) => ({
    fixture_id: result.fixtureId,
    home_score: result.homeScore,
    away_score: result.awayScore,
    home_penalties: result.homePenalties ?? null,
    away_penalties: result.awayPenalties ?? null,
  }));

  return enrich(await api.projectScenario(tournamentId, input));
}

/**
 * Runs a set of hypothetical results and returns the projected standings + bracket.
 * Writes nothing. Falls back to the offline demo projector when live is disabled or the
 * API is unreachable, so the deployed demo tournament runs what-ifs without a backend.
 */
export async function projectScenario(
  tournamentId: number,
  results: ScenarioResult[],
): Promise<ScenarioProjection> {
  if (!LIVE_ENABLED) {
    return tournamentId === DEMO_TOURNAMENT_ID
      ? demoProjectScenario(results)
      : EMPTY_SETUP.baseline;
  }

  try {
    return await liveProjectScenario(tournamentId, results);
  } catch (error) {
    if (tournamentId === DEMO_TOURNAMENT_ID) return demoProjectScenario(results);
    throw error;
  }
}

/**
 * Loads the pickable fixtures (every match with both sides known) plus the untouched
 * baseline projection — the "reality" the scenario is diffed against.
 */
async function liveWhatIfSetup(tournamentId: number): Promise<WhatIfSetup> {
  const detail = await api.getTournament(tournamentId);
  const enrichName = (team: Team): Team => TEAMS[team.id] ?? team;

  const fixtures: WhatIfFixture[] = [];

  for (const stage of detail.stages) {
    if (stage.type === "group") {
      for (const group of stage.groups) {
        for (const fixture of group.fixtures) {
          if (!fixture.home || !fixture.away) continue;
          fixtures.push({
            id: fixture.id,
            phase: "group",
            label: `Group ${group.name} · ${enrichName(fixture.home).name} vs ${enrichName(fixture.away).name}`,
            home: enrichName(fixture.home),
            away: enrichName(fixture.away),
            homeScore: fixture.homeScore,
            awayScore: fixture.awayScore,
            status: fixture.status,
            isKnockout: false,
          });
        }
      }
      continue;
    }

    const maxRound = Math.max(...stage.ties.map((tie) => tie.round), 1);
    const roundByTie = new Map(stage.ties.map((tie) => [tie.id, tie.round]));
    for (const fixture of stage.fixtures) {
      if (!fixture.home || !fixture.away) continue;
      const round = fixture.tieId !== null ? (roundByTie.get(fixture.tieId) ?? 1) : 1;
      fixtures.push({
        id: fixture.id,
        phase: "knockout",
        label: `${roundName(round, maxRound)} · ${enrichName(fixture.home).name} vs ${enrichName(fixture.away).name}`,
        home: enrichName(fixture.home),
        away: enrichName(fixture.away),
        homeScore: fixture.homeScore,
        awayScore: fixture.awayScore,
        status: fixture.status,
        isKnockout: true,
      });
    }
  }

  return { fixtures, baseline: await liveProjectScenario(tournamentId, []) };
}

export async function getWhatIfSetup(tournamentId: number): Promise<WhatIfSetup> {
  if (!LIVE_ENABLED) {
    return tournamentId === DEMO_TOURNAMENT_ID ? demoWhatIfSetup() : EMPTY_SETUP;
  }

  try {
    return await liveWhatIfSetup(tournamentId);
  } catch (error) {
    if (tournamentId === DEMO_TOURNAMENT_ID) return demoWhatIfSetup();
    throw error;
  }
}
