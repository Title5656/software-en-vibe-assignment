import { beforeEach, describe, expect, it } from "vitest";
import type { Club } from "@/lib/clubs";
import { addRegistration, getRegistrationError, removeRegistration, type Registration } from "@/lib/registrations";

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
  registeredAt: "2026-10-25T10:00:00.000Z",
  ...overrides,
});

describe("club registration rules", () => {
  beforeEach(() => localStorage.clear());

  it("allows another student to join the same club", () => {
    expect(getRegistrationError(registration({ studentId: "7654321" }), [registration()], club)).toBeNull();
  });

  it("allows the same student to join a different club", () => {
    expect(getRegistrationError(registration(), [registration({ clubId: "ai" })], club)).toBeNull();
  });

  it("persists only unique registrations up to capacity", () => {
    expect(addRegistration(registration(), club)).toEqual({ ok: true });
    expect(addRegistration(registration(), club)).toEqual({ ok: false, error: "already-registered" });
    expect(addRegistration(registration({ studentId: "7654321" }), club)).toEqual({ ok: true });
    expect(addRegistration(registration({ studentId: "2468135" }), club)).toEqual({ ok: false, error: "club-full" });
    expect(JSON.parse(localStorage.getItem("muict-registrations")!)).toHaveLength(2);
  });

  it("cancels only the selected student's membership and frees a place", () => {
    localStorage.setItem("muict-registrations", JSON.stringify([registration(), registration({ studentId: "7654321" })]));
    removeRegistration(club.id, "1234567");
    expect(JSON.parse(localStorage.getItem("muict-registrations")!)).toEqual([registration({ studentId: "7654321" })]);
    expect(addRegistration(registration({ studentId: "2468135" }), club)).toEqual({ ok: true });
  });
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
