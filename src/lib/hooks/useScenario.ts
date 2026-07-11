"use client";

import { useEffect, useRef, useState } from "react";
import { projectScenario } from "@/lib/data/scenario";
import { notifyApiError } from "@/lib/toast";
import type { ScenarioProjection, ScenarioResult } from "@/lib/types";

export function useScenario(
  tournamentId: number,
  baseline: ScenarioProjection,
  initialPins: ScenarioResult[] = [],
) {
  const [pins, setPins] = useState<Map<number, ScenarioResult>>(
    () => new Map(initialPins.map((pin) => [pin.fixtureId, pin])),
  );
  const [projected, setProjected] = useState<ScenarioProjection | null>(null);
  const [fetching, setFetching] = useState(initialPins.length > 0);
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
