import { describe, expect, it } from "vitest";
import { demoProjectScenario, demoWhatIfSetup } from "./demo-scenario";

const groupA = (p: ReturnType<typeof demoProjectScenario>) =>
  p.groups.find((group) => group.name === "A")!;
const tie = (p: ReturnType<typeof demoProjectScenario>, id: number) =>
  p.bracket!.ties.find((t) => t.id === id)!;

// Synthetic id of the Brazil (1) vs Japan (2) group A opener — group.id * 100 + index.
const BRAZIL_JAPAN = 100;

describe("demoProjectScenario", () => {
  it("reproduces reality with no pins: Brazil tops group A, seeds feed the bracket", () => {
    const p = demoProjectScenario([]);
    const a = groupA(p);

    expect(a.standings.map((row) => row.team.name)).toEqual([
      "Brazil",
      "Japan",
      "Croatia",
      "Morocco",
    ]);
    // A1 (Brazil) and B2 (France) meet in QF1.
    expect(tie(p, 1).home.team?.name).toBe("Brazil");
    expect(tie(p, 1).away.team?.name).toBe("France");
  });

  it("cascades a hypothetical group result into the bracket seeds", () => {
    // Japan beats Brazil 3–0, so Japan wins group A and takes the A1 seed.
    const p = demoProjectScenario([{ fixtureId: BRAZIL_JAPAN, homeScore: 0, awayScore: 3 }]);
    const a = groupA(p);

    expect(a.standings[0].team.name).toBe("Japan");
    expect(a.standings[1].team.name).toBe("Brazil");
    expect(tie(p, 1).home.team?.name).toBe("Japan"); // QF1 home = A1
    expect(tie(p, 3).away.team?.name).toBe("Brazil"); // QF3 away = A2
  });

  it("advances the winner of a pinned knockout result up the bracket", () => {
    // QF3 (Argentina vs Japan) is live 1–1 in the demo; decide it for Argentina.
    const p = demoProjectScenario([{ fixtureId: 3, homeScore: 2, awayScore: 0 }]);

    expect(tie(p, 3).winnerId).toBe(5); // Argentina
    expect(tie(p, 6).home.team?.name).toBe("Argentina"); // SF2 home = winner QF3
  });

  it("leaves the recorded demo results in place when unrelated", () => {
    const p = demoProjectScenario([]);
    // QF1 was decided 2–1 for Brazil; the winner sits in the SF1 home slot.
    expect(tie(p, 1).winnerId).toBe(1);
    expect(tie(p, 5).home.team?.name).toBe("Brazil");
  });
});

describe("demoWhatIfSetup", () => {
  it("lists every group match plus the knockout ties with both sides known", () => {
    const setup = demoWhatIfSetup();
    const groups = setup.fixtures.filter((f) => f.phase === "group");
    const knockout = setup.fixtures.filter((f) => f.phase === "knockout");

    expect(groups).toHaveLength(24); // 4 groups × 6 matches
    expect(knockout).toHaveLength(5); // QF1–QF4 + SF1 (both teams set)
    expect(setup.baseline.groups).toHaveLength(4);
    expect(setup.baseline.bracket).not.toBeNull();
  });
});
