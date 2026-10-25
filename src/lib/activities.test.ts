import { describe, expect, it } from "vitest";
import { getWeekStart, shiftDate, getDemoActivities, getBangkokToday } from "@/lib/activities";

describe("weekly activities", () => {
  it("uses the Bangkok date when UTC is still on the previous day", () => {
    expect(getBangkokToday(new Date("2026-10-25T18:00:00Z"))).toBe("2026-10-26");
  });
  it("starts the week on Monday even when the chosen date is Sunday", () => {
    expect(getWeekStart("2026-10-25")).toBe("2026-10-19");
    expect(getWeekStart("2026-10-19")).toBe("2026-10-19");
  });

  it("moves weeks across month and year boundaries", () => {
    expect(shiftDate("2026-12-28", 7)).toBe("2027-01-04");
    expect(shiftDate("2026-11-02", -7)).toBe("2026-10-26");
  });

  it("provides seven activities across seven days of the chosen week", () => {
    const activities = getDemoActivities("2026-10-25");
    expect(activities.map((activity) => activity.date)).toEqual([
      "2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23", "2026-10-24", "2026-10-25",
    ]);
    expect(new Set(activities.map((activity) => activity.id)).size).toBe(7);
    expect(activities.every((activity) => activity.title && activity.clubId && activity.description && activity.location && activity.preparation && activity.startTime < activity.endTime)).toBe(true);
  });

  it("keeps the demo populated when navigating to another week", () => {
    const activities = getDemoActivities("2027-01-06");
    expect(activities).toHaveLength(7);
    expect(activities[0]?.date).toBe("2027-01-04");
    expect(activities[6]?.date).toBe("2027-01-10");
  });

});
