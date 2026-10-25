import { useEffect, useState } from "react";

const KEY = "muict-favorites";
const EVENT = "muict-favorites-change";

export function readFavorites(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(stored)
      ? [...new Set(stored.filter((id): id is string => typeof id === "string" && id.trim().length > 0))]
      : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(clubId: string): { ok: true } | { ok: false; error: string } {
  const favorites = readFavorites();
  const next = favorites.includes(clubId) ? favorites.filter((id) => id !== clubId) : [...favorites, clubId];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update favorites. Please check browser storage and try again." };
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const sync = () => setFavorites(readFavorites());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const toggle = (id: string) => {
    const result = toggleFavorite(id);
    setError(result.ok ? "" : result.error);
  };
  return { favorites, toggle, error };
}
