import { describe, expect, it } from "vitest";
import { COUNTRIES, flagForCountry, searchCountries } from "@/lib/tournament/flags";

describe("flagForCountry", () => {
  it("resolves a known country to its emoji flag", () => {
    expect(flagForCountry("Brazil")).toBe("🇧🇷");
    expect(flagForCountry("France")).toBe("🇫🇷");
  });

  it("is case- and accent-insensitive and ignores punctuation", () => {
    expect(flagForCountry("  brazil ")).toBe("🇧🇷");
    expect(flagForCountry("Côte d'Ivoire")).toBe(flagForCountry("Ivory Coast"));
  });

  it("resolves aliases to the canonical flag", () => {
    expect(flagForCountry("Brasil")).toBe("🇧🇷");
    expect(flagForCountry("USA")).toBe(flagForCountry("United States"));
    expect(flagForCountry("Holland")).toBe(flagForCountry("Netherlands"));
  });

  it("returns the special tag flag for home nations", () => {
    expect(flagForCountry("England")).toBe("🏴󠁧󠁢󠁥󠁮󠁧󠁿");
  });

  it("returns null for empty or unknown input", () => {
    expect(flagForCountry("")).toBeNull();
    expect(flagForCountry("Atlantis")).toBeNull();
  });
});

describe("searchCountries", () => {
  it("returns an empty list for a blank query", () => {
    expect(searchCountries("")).toEqual([]);
  });

  it("prioritises prefix matches over substring matches", () => {
    const results = searchCountries("uni");
    expect(results[0].name.toLowerCase().startsWith("uni")).toBe(true);
  });

  it("respects the result limit", () => {
    expect(searchCountries("a", 3)).toHaveLength(3);
  });

  it("finds a country by a substring in the middle of its name", () => {
    const names = searchCountries("land").map((c) => c.name);
    expect(names).toContain("Ireland");
  });
});

describe("COUNTRIES", () => {
  it("is sorted alphabetically by name", () => {
    const names = COUNTRIES.map((c) => c.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it("includes the special home nations", () => {
    const names = COUNTRIES.map((c) => c.name);
    expect(names).toContain("England");
    expect(names).toContain("Scotland");
    expect(names).toContain("Wales");
  });
});
