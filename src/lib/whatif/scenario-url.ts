import type { ScenarioResult } from "@/lib/types";

const PIN = /^(\d+):(\d+)-(\d+)(?:~(\d+)-(\d+))?$/;
const MAX = 99;

export function encodeScenario(pins: ScenarioResult[]): string {
  return pins
    .map((pin) => {
      const base = `${pin.fixtureId}:${pin.homeScore}-${pin.awayScore}`;
      return pin.homePenalties != null && pin.awayPenalties != null
        ? `${base}~${pin.homePenalties}-${pin.awayPenalties}`
        : base;
    })
    .join(",");
}

export function decodeScenario(raw: string | null | undefined): ScenarioResult[] {
  if (!raw) return [];

  const byFixture = new Map<number, ScenarioResult>();
  for (const part of raw.split(",")) {
    const match = PIN.exec(part);
    if (!match) continue;

    const [fixtureId, homeScore, awayScore] = [match[1], match[2], match[3]].map(Number);
    if (fixtureId <= 0 || homeScore > MAX || awayScore > MAX) continue;

    const result: ScenarioResult = { fixtureId, homeScore, awayScore };
    if (match[4] !== undefined) {
      const [homePenalties, awayPenalties] = [match[4], match[5]].map(Number);
      if (homePenalties > MAX || awayPenalties > MAX) continue;
      result.homePenalties = homePenalties;
      result.awayPenalties = awayPenalties;
    }

    byFixture.set(fixtureId, result);
  }

  return [...byFixture.values()];
}
