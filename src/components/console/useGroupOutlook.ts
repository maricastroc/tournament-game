"use client";

import { useEffect, useState } from "react";
import { forecastGroup, type GroupForecast, type GroupSim } from "@/lib/forecast/groups";

const DELAY = 250;

/**
 * Debounced group forecast for the live console preview. Running the 4,000-run Monte
 * Carlo on every keystroke would jank, so it settles for a beat after edits, then
 * projects whether each team has clinched or been eliminated given the results so far.
 * Keyed on `sim.key`, which must encode the current results.
 */
export function useGroupOutlook(sim: GroupSim): GroupForecast | null {
  const [forecast, setForecast] = useState<GroupForecast | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setForecast(forecastGroup(sim)), DELAY);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sim.key encodes the inputs
  }, [sim.key]);

  return forecast;
}
