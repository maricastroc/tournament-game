"use client";

import { useState } from "react";
import type { ScenarioResult, WhatIfFixture } from "@/lib/types";

export function useScenarioEditor(fixtures: WhatIfFixture[], pins: Map<number, ScenarioResult>) {
  const [selectedId, setSelectedId] = useState<number>(fixtures[0]?.id ?? 0);
  const selected = fixtures.find((fixture) => fixture.id === selectedId) ?? fixtures[0];

  const pinned = pins.get(selectedId);
  const [home, setHome] = useState(pinned?.homeScore ?? selected?.homeScore ?? 0);
  const [away, setAway] = useState(pinned?.awayScore ?? selected?.awayScore ?? 0);
  const [homePens, setHomePens] = useState(pinned?.homePenalties ?? 4);
  const [awayPens, setAwayPens] = useState(pinned?.awayPenalties ?? 2);

  const shootout = Boolean(selected?.isKnockout) && home === away;

  const reselect = (id: number) => {
    const next = fixtures.find((fixture) => fixture.id === id);
    const existing = pins.get(id);
    setSelectedId(id);
    setHome(existing?.homeScore ?? next?.homeScore ?? 0);
    setAway(existing?.awayScore ?? next?.awayScore ?? 0);
    setHomePens(existing?.homePenalties ?? 4);
    setAwayPens(existing?.awayPenalties ?? 2);
  };

  const toResult = (): ScenarioResult => ({
    fixtureId: selected.id,
    homeScore: home,
    awayScore: away,
    homePenalties: shootout ? homePens : null,
    awayPenalties: shootout ? awayPens : null,
  });

  return {
    selected,
    home,
    away,
    homePens,
    awayPens,
    shootout,
    setHome,
    setAway,
    setHomePens,
    setAwayPens,
    reselect,
    toResult,
  };
}
