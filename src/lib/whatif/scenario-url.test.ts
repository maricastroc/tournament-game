import { describe, expect, it } from "vitest";
import type { ScenarioResult } from "@/lib/types";
import { decodeScenario, encodeScenario } from "./scenario-url";

describe("scenario-url", () => {
  it("round-trips a set of pins including penalties", () => {
    const pins: ScenarioResult[] = [
      { fixtureId: 100, homeScore: 0, awayScore: 2 },
      { fixtureId: 3, homeScore: 1, awayScore: 1, homePenalties: 4, awayPenalties: 2 },
    ];

    const encoded = encodeScenario(pins);
    expect(encoded).toBe("100:0-2,3:1-1~4-2");
    expect(decodeScenario(encoded)).toEqual(pins);
  });

  it("returns an empty list for missing or empty input", () => {
    expect(decodeScenario(null)).toEqual([]);
    expect(decodeScenario(undefined)).toEqual([]);
    expect(decodeScenario("")).toEqual([]);
  });

  it("skips malformed or out-of-range entries but keeps valid ones", () => {
    const decoded = decodeScenario("100:1-0,nonsense,7:5-,0:1-1,3:200-0,9:2-1");
    expect(decoded).toEqual([
      { fixtureId: 100, homeScore: 1, awayScore: 0 },
      { fixtureId: 9, homeScore: 2, awayScore: 1 },
    ]);
  });

  it("keeps the last result when a fixture repeats", () => {
    expect(decodeScenario("5:1-0,5:2-3")).toEqual([{ fixtureId: 5, homeScore: 2, awayScore: 3 }]);
  });
});
