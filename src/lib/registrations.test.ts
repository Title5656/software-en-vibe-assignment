import { describe, expect, it } from "vitest";
import type { Club } from "@/lib/clubs";
import { getRegistrationError, type Registration } from "@/lib/registrations";

const club: Club = {
  id: "dev",
  name: "Dev Club",
  category: "Tech",
  tagline: "Ship real software, fast.",
  description: "A club for developers.",
  meets: "Tuesdays 17:00–19:00",
  location: "Lab 2",
  advisor: "Dr. Test",
  capacity: 2,
  emoji: "💻",
};

const registration = (overrides: Partial<Registration> = {}): Registration => ({
  clubId: club.id,
  name: "Test Student",
  studentId: "1234567",
  email: "student@example.com",
  registeredAt: new Date().toISOString(),
  ...overrides,
});

describe("club registration rules", () => {
  it("rejects a student registering for the same club twice", () => {
    expect(getRegistrationError(registration(), [registration()], club)).toBe("already-registered");
  });

  it("rejects a registration when the club has reached capacity", () => {
    const registrations = [registration(), registration({ studentId: "7654321" })];

    expect(getRegistrationError(registration({ studentId: "2468135" }), registrations, club)).toBe("club-full");
  });

  it("allows a registration when the club still has space", () => {
    expect(getRegistrationError(registration(), [], club)).toBeNull();
  });
});
