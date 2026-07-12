export interface StreamEvent {
  tournament_id: number;
  revision: number;
  type: string;
  ts: number;
}

export type StreamAction = "refresh" | "ignore";

export type IgnoreReason = "malformed" | "foreign" | "duplicate" | "stale";

export interface StreamDecision {
  action: StreamAction;
  nextRevision: number;
  reason: IgnoreReason | "newer";
}

/** Parse a raw SSE `data` payload (JSON string or already-parsed object) into a StreamEvent, or null. */
export function parseStreamEvent(raw: unknown): StreamEvent | null {
  let data: unknown = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (typeof data !== "object" || data === null) return null;

  const obj = data as Record<string, unknown>;
  if (typeof obj.tournament_id !== "number" || typeof obj.revision !== "number") return null;

  return {
    tournament_id: obj.tournament_id,
    revision: obj.revision,
    type: typeof obj.type === "string" ? obj.type : "sync",
    ts: typeof obj.ts === "number" ? obj.ts : 0,
  };
}

/**
 * Pure decision for an incoming stream frame — the guard that keeps live updates correct:
 * cross-tournament, malformed, duplicate, and out-of-order frames are ignored; only a strictly
 * newer revision triggers a refetch. Side-effect free (the hook turns "refresh" into
 * router.refresh()). Correctness never depends on this guard — a missed frame is recovered by the
 * authoritative snapshot on the next newer revision or on reconnect — it only avoids redundant work.
 */
export function reduceStreamEvent(
  lastRevision: number,
  raw: unknown,
  subscribedTournamentId: number,
): StreamDecision {
  const event = parseStreamEvent(raw);

  if (!event) {
    return { action: "ignore", nextRevision: lastRevision, reason: "malformed" };
  }
  if (event.tournament_id !== subscribedTournamentId) {
    return { action: "ignore", nextRevision: lastRevision, reason: "foreign" };
  }
  if (event.revision === lastRevision) {
    return { action: "ignore", nextRevision: lastRevision, reason: "duplicate" };
  }
  if (event.revision < lastRevision) {
    return { action: "ignore", nextRevision: lastRevision, reason: "stale" };
  }
  return { action: "refresh", nextRevision: event.revision, reason: "newer" };
}
