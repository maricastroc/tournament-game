import { describe, expect, it } from "vitest";
import { hashString, mulberry32, poisson } from "@/lib/forecast/rng";

describe("mulberry32", () => {
  it("is deterministic for a given seed", () => {
    const a = mulberry32(123);
    const b = mulberry32(123);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it("produces different streams for different seeds", () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });

  it("returns values in the [0, 1) range", () => {
    const rng = mulberry32(999);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("hashString", () => {
  it("is stable for the same input", () => {
    expect(hashString("42:3:26")).toBe(hashString("42:3:26"));
  });

  it("differs for different inputs", () => {
    expect(hashString("a")).not.toBe(hashString("b"));
  });

  it("returns an unsigned 32-bit integer", () => {
    const h = hashString("tournament");
    expect(Number.isInteger(h)).toBe(true);
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(0xffffffff);
  });
});

describe("poisson", () => {
  it("returns non-negative integers", () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 500; i++) {
      const k = poisson(rng, 1.5);
      expect(Number.isInteger(k)).toBe(true);
      expect(k).toBeGreaterThanOrEqual(0);
    }
  });

  it("has a sample mean close to lambda over many draws", () => {
    const rng = mulberry32(2024);
    const lambda = 2;
    const draws = 20000;
    let total = 0;
    for (let i = 0; i < draws; i++) total += poisson(rng, lambda);
    const mean = total / draws;
    expect(mean).toBeGreaterThan(lambda - 0.2);
    expect(mean).toBeLessThan(lambda + 0.2);
  });
});
