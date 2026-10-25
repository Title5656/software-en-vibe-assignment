import type { Club } from "@/lib/clubs";

export function filterClubs(clubs: Club[], query: string, category: Club["category"] | "All"): Club[] {
  const term = query.trim().toLowerCase();
  return clubs.filter((club) =>
    (category === "All" || club.category === category) &&
    `${club.name} ${club.tagline} ${club.description}`.toLowerCase().includes(term),
  );
}
