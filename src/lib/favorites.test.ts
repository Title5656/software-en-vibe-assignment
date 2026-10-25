import { beforeEach, describe, expect, it } from "vitest";
import { readFavorites, toggleFavorite } from "@/lib/favorites";

describe("saved clubs", () => {
  beforeEach(() => localStorage.clear());

  it("starts with an empty list", () => {
    expect(readFavorites()).toEqual([]);
  });

  it("saves favorites persistently without registering a student", () => {
    expect(toggleFavorite("ai")).toEqual({ ok: true });
    expect(readFavorites()).toEqual(["ai"]);
    expect(JSON.parse(localStorage.getItem("muict-favorites")!)).toEqual(["ai"]);
    expect(localStorage.getItem("muict-registrations")).toBeNull();
  });

  it("removes a saved club without removing other favorites", () => {
    localStorage.setItem("muict-favorites", JSON.stringify(["ai", "dev"]));
    expect(toggleFavorite("ai")).toEqual({ ok: true });
    expect(readFavorites()).toEqual(["dev"]);
  });

  it("uses the latest saved list when toggling different clubs", () => {
    toggleFavorite("ai");
    toggleFavorite("dev");
    expect(readFavorites()).toEqual(["ai", "dev"]);
    toggleFavorite("dev");
    expect(readFavorites()).toEqual(["ai"]);
  });

  it("handles malformed storage and removes duplicate or invalid IDs", () => {
    localStorage.setItem("muict-favorites", "invalid JSON");
    expect(readFavorites()).toEqual([]);
    localStorage.setItem("muict-favorites", JSON.stringify(["ai", "ai", 5, null, "", "dev"]));
    expect(readFavorites()).toEqual(["ai", "dev"]);
  });
});
