import { clubs, type Club } from "@/lib/clubs";
import { useEffect, useState } from "react";
import { z } from "zod";
import { readRegistrations } from "@/lib/registrations";

type Result = { ok: true } | { ok: false; error: string };
const KEY = "muict-clubs";
const EVENT = "muict-clubs-change";
const requiredText = z.string().trim().min(1, "All club fields are required.").max(2000);
const clubSchema = z.object({
  id: requiredText,
  name: requiredText.max(100),
  category: z.enum(["Tech", "Sport", "Culture", "Creative"]),
  emoji: requiredText.max(20),
  tagline: requiredText.max(200),
  description: requiredText,
  meets: requiredText.max(200),
  location: requiredText.max(200),
  advisor: requiredText.max(100),
  capacity: z.number().int("Capacity must be a whole number.").positive("Capacity must be at least 1.").max(10000),
});

export function readClubs(): Club[] {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === null) return clubs;
    const parsed = z.array(clubSchema).safeParse(JSON.parse(stored));
    return parsed.success ? parsed.data : clubs;
  } catch {
    return clubs;
  }
}

function persist(list: Club[]): Result {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT));
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not save changes. Please check browser storage and try again." };
  }
}

export function saveClub(value: unknown): Result {
  const parsed = clubSchema.safeParse(value);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check club details." };
  const club = parsed.data;
  const members = readRegistrations().filter((registration) => registration.clubId === club.id).length;
  if (club.capacity < members) return { ok: false, error: `Capacity cannot be lower than the current member count (${members}).` };
  const catalog = readClubs();
  return persist(catalog.some((item) => item.id === club.id)
    ? catalog.map((item) => item.id === club.id ? club : item)
    : [...catalog, club]);
}

export function deleteClub(id: string): Result {
  if (readRegistrations().some((registration) => registration.clubId === id)) {
    return { ok: false, error: "Clubs with registered students cannot be deleted." };
  }
  return persist(readClubs().filter((club) => club.id !== id));
}

export function useClubs() {
  const [catalog, setCatalog] = useState(clubs);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => { setCatalog(readClubs()); setReady(true); };
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { clubs: catalog, ready };
}
