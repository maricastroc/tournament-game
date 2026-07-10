"use client";

import { useEffect, useRef, useState } from "react";
import { projectScenario } from "@/lib/data/scenario";
import { notifyApiError } from "@/lib/toast";
import type { ScenarioProjection, ScenarioResult } from "@/lib/types";

/**
 * Holds the pinned hypothetical results and keeps the projection in sync with them.
 *
 * Every change re-asks the API to project the whole tournament from scratch — the pure
 * engines make that cheap, and it keeps the client dumb: it never derives standings or
 * reseeds a bracket itself, it just renders whatever the projection returns. With nothing
 * pinned the projection is simply the baseline (reality), derived without a round-trip.
 *
 * The "projecting…" flag is raised in the handlers that trigger a fetch and lowered in the
 * request's own callback — the effect only performs the I/O, never sets state synchronously.
 */
export function useScenario(tournamentId: number, baseline: ScenarioProjection) {
  const [pins, setPins] = useState<Map<number, ScenarioResult>>(new Map());
  const [projected, setProjected] = useState<ScenarioProjection | null>(null);
  const [fetching, setFetching] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    if (pins.size === 0) return;

    const id = ++requestId.current;
    projectScenario(tournamentId, [...pins.values()])
      .then((next) => {
        if (id === requestId.current) setProjected(next);
      })
      .catch((error) => {
        if (id === requestId.current) notifyApiError(error);
      })
      .finally(() => {
        if (id === requestId.current) setFetching(false);
      });
  }, [pins, tournamentId]);

  const empty = pins.size === 0;
  const projection = empty ? baseline : (projected ?? baseline);
  const loading = !empty && fetching;

  const pin = (result: ScenarioResult) => {
    setFetching(true);
    setPins(new Map(pins).set(result.fixtureId, result));
  };

  const unpin = (fixtureId: number) => {
    const next = new Map(pins);
    next.delete(fixtureId);
    setFetching(next.size > 0);
    setPins(next);
  };

  const reset = () => {
    setFetching(false);
    setPins(new Map());
  };

  return { pins, projection, loading, pin, unpin, reset };
}
