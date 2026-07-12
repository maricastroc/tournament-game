import { describe, expect, it } from "vitest";
import { parseStreamEvent, reduceStreamEvent } from "./streamEvent";

const frame = (over: Partial<StreamEventShape> = {}) =>
  JSON.stringify({ tournament_id: 7, revision: 5, type: "sync", ts: 1, ...over });

type StreamEventShape = { tournament_id: number; revision: number; type: string; ts: number };

describe("parseStreamEvent", () => {
  it("parses a JSON string payload", () => {
    expect(parseStreamEvent(frame())).toEqual({
      tournament_id: 7,
      revision: 5,
      type: "sync",
      ts: 1,
    });
  });

  it("accepts an already-parsed object and defaults optional fields", () => {
    expect(parseStreamEvent({ tournament_id: 1, revision: 2 })).toEqual({
      tournament_id: 1,
      revision: 2,
      type: "sync",
      ts: 0,
    });
  });

  it("returns null for malformed input", () => {
    expect(parseStreamEvent("not json")).toBeNull();
    expect(parseStreamEvent({ revision: 2 })).toBeNull();
    expect(parseStreamEvent(null)).toBeNull();
  });
});

describe("reduceStreamEvent", () => {
  const SUB = 7;

  it("refreshes on a strictly newer revision", () => {
    expect(reduceStreamEvent(4, frame({ revision: 5 }), SUB)).toMatchObject({
      action: "refresh",
      nextRevision: 5,
    });
  });

  it("always refreshes the first frame (from lastRevision -1)", () => {
    expect(reduceStreamEvent(-1, frame({ revision: 0 }), SUB)).toMatchObject({
      action: "refresh",
      nextRevision: 0,
    });
  });

  it("ignores a duplicate revision without regressing", () => {
    expect(reduceStreamEvent(5, frame({ revision: 5 }), SUB)).toMatchObject({
      action: "ignore",
      reason: "duplicate",
      nextRevision: 5,
    });
  });

  it("ignores an out-of-order (older) revision", () => {
    expect(reduceStreamEvent(9, frame({ revision: 5 }), SUB)).toMatchObject({
      action: "ignore",
      reason: "stale",
      nextRevision: 9,
    });
  });

  it("ignores an event for a different tournament", () => {
    expect(reduceStreamEvent(0, frame({ tournament_id: 99, revision: 3 }), SUB)).toMatchObject({
      action: "ignore",
      reason: "foreign",
    });
  });

  it("ignores malformed payloads without advancing", () => {
    expect(reduceStreamEvent(3, "garbage", SUB)).toMatchObject({
      action: "ignore",
      reason: "malformed",
      nextRevision: 3,
    });
  });
});
