import { useEffect, useState } from "react";
import type { Club } from "@/lib/clubs";

export type Registration = {
  clubId: string;
  name: string;
  studentId: string;
  email: string;
  registeredAt: string;
};

const KEY = "muict-registrations";
const EVT = "muict-registrations-change";

export type RegistrationError = "already-registered" | "club-full";

export function readRegistrations(): Registration[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function write(list: Registration[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVT));
}

export function getRegistrationError(r: Registration, registrations: Registration[], club: Club): RegistrationError | null {
  if (registrations.some((x) => x.clubId === r.clubId && x.studentId === r.studentId)) return "already-registered";
  if (registrations.filter((x) => x.clubId === club.id).length >= club.capacity) return "club-full";
  return null;
}

export function addRegistration(r: Registration, club: Club): { ok: true } | { ok: false; error: RegistrationError } {
  const registrations = readRegistrations();
  const error = getRegistrationError(r, registrations, club);
  if (error) return { ok: false, error };
  write([...registrations, r]);
  return { ok: true };
}

export function removeRegistration(clubId: string, studentId: string) {
  write(readRegistrations().filter((x) => x.clubId !== clubId || x.studentId !== studentId));
}

export function useRegistrations() {
  const [list, setList] = useState<Registration[]>([]);
  useEffect(() => {
    const sync = () => setList(readRegistrations());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return list;
}
