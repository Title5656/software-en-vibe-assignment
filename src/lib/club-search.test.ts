import { describe, expect, it } from "vitest";
import { clubs } from "@/lib/clubs";
import { filterClubs } from "@/lib/club-search";

describe("club search", () => {
  it("shows all clubs for an empty or whitespace-only search", () => {
    expect(filterClubs(clubs, "  ", "All")).toHaveLength(10);
  });

  it("matches names regardless of case and surrounding spaces", () => {
    expect(filterClubs(clubs, "  tAbLe TeNnIs  ", "All").map((club) => club.id)).toEqual(["table-tennis"]);
  });

  it("finds clubs through their descriptions", () => {
    expect(filterClubs(clubs, "Arduino", "All").map((club) => club.id)).toEqual(["iot"]);
  });

  it("filters by category", () => {
    expect(filterClubs(clubs, "", "Sport").map((club) => club.id)).toEqual(["badminton", "table-tennis"]);
  });

  it("combines the search query with the selected category", () => {
    expect(filterClubs(clubs, "club", "Tech").map((club) => club.id)).toEqual(["ai", "dev", "iot", "cyber"]);
    expect(filterClubs(clubs, "Arduino", "Sport")).toEqual([]);
  });

  it("returns no results for an unknown term", () => {
    expect(filterClubs(clubs, "no-such-club", "All")).toEqual([]);
  });
});
