import { beforeEach, describe, expect, it } from "vitest";
import { clubs } from "@/lib/clubs";
import { deleteClub, readClubs, saveClub } from "@/lib/club-store";

const draft = { ...clubs[0]!, id: "demo-club", name: "Demo Club", capacity: 2 };

describe("demo club catalog", () => {
  beforeEach(() => localStorage.clear());

  it("starts with the original clubs and preserves an intentionally empty catalog", () => {
    expect(readClubs()).toHaveLength(10);
    localStorage.setItem("muict-clubs", "[]");
    expect(readClubs()).toEqual([]);
  });

  it("creates a club and persists edits without duplicating it", () => {
    expect(saveClub(draft)).toEqual({ ok: true });
    expect(readClubs().find((club) => club.id === draft.id)?.name).toBe("Demo Club");
    expect(saveClub({ ...draft, name: "Updated Demo", capacity: 4 })).toEqual({ ok: true });
    expect(readClubs()).toHaveLength(11);
    expect(readClubs().find((club) => club.id === draft.id)?.capacity).toBe(4);
  });

  it.each([{ name: " " }, { capacity: 0 }, { capacity: 1.5 }, { category: "Unknown" }])("rejects invalid club fields: %j", (invalid) => {
    expect(saveClub({ ...draft, ...invalid }).ok).toBe(false);
    expect(readClubs()).toHaveLength(10);
  });

  it("prevents capacity reductions below current membership", () => {
    localStorage.setItem("muict-registrations", JSON.stringify([{ clubId: "demo-club" }, { clubId: "demo-club" }]));
    expect(saveClub({ ...draft, capacity: 1 })).toEqual({ ok: false, error: "Capacity cannot be lower than the current member count (2)." });
    expect(saveClub(draft)).toEqual({ ok: true });
  });

  it("blocks deleting occupied clubs and preserves their registrations", () => {
    localStorage.setItem("muict-registrations", JSON.stringify([{ clubId: "ai" }]));
    expect(deleteClub("ai").ok).toBe(false);
    expect(readClubs().some((club) => club.id === "ai")).toBe(true);
    expect(JSON.parse(localStorage.getItem("muict-registrations")!)).toHaveLength(1);
  });

  it("deletes an empty club while preserving other clubs", () => {
    expect(deleteClub("ai")).toEqual({ ok: true });
    expect(readClubs()).toHaveLength(9);
    expect(readClubs().some((club) => club.id === "ai")).toBe(false);
    expect(readClubs().some((club) => club.id === "dev")).toBe(true);
  });

  it("falls back to defaults for malformed stored data", () => {
    localStorage.setItem("muict-clubs", '{"invalid":true}');
    expect(readClubs()).toHaveLength(10);
  });
});
