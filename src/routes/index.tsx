import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart } from "lucide-react";
import { type Club } from "@/lib/clubs";
import { useClubs } from "@/lib/club-store";
import { filterClubs } from "@/lib/club-search";
import { useRegistrations } from "@/lib/registrations";
import { useFavorites } from "@/lib/favorites";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MUICT Club Registration — Browse Clubs" },
      { name: "description", content: "Browse and join MUICT student clubs: AI, Dev, IoT, Cyber, sports, culture and more." },
      { property: "og:title", content: "MUICT Club Registration" },
      { property: "og:description", content: "Browse and join MUICT student clubs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const filters = ["All", "Tech", "Sport", "Culture", "Creative"] as const;

function Index() {
  const { clubs } = useClubs();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const { favorites, toggle, error } = useFavorites();
  const regs = useRegistrations();
  const savedClubs = clubs.filter((club) => favorites.includes(club.id));
  const shown = filterClubs(favoritesOnly ? savedClubs : clubs, query, filter);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Semester 1 · 2026</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          Find your people at <span className="text-primary">MUICT</span>.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          {clubs.length} clubs, one registration. Browse, learn more, and join in seconds.
        </p>
        <label className="mt-8 block max-w-xl">
          <span className="text-sm font-medium">Search clubs</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by club name or interests…"
            aria-controls="club-results"
            className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-ring"
          />
        </label>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            aria-pressed={favoritesOnly}
            aria-controls="club-results"
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${favoritesOnly ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"}`}
          >
            <Heart aria-hidden="true" className={`h-4 w-4 ${favoritesOnly ? "fill-current" : ""}`} />
            Favorites ({savedClubs.length})
          </button>
          <p className="text-sm text-muted-foreground">Tap a heart to save a club for later.</p>
        </div>
        <div role="group" aria-label="Filter by category" className="mt-5 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              aria-controls="club-results"
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
          <p role="status" className="text-muted-foreground">
            Showing {shown.length} of {favoritesOnly ? savedClubs.length : clubs.length} {favoritesOnly ? "saved clubs" : "clubs"}
          </p>
          {(query !== "" || filter !== "All" || favoritesOnly) && (
            <button onClick={() => { setQuery(""); setFilter("All"); setFavoritesOnly(false); }} className="font-medium text-primary hover:underline">
              Clear filters
            </button>
          )}
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </section>
      <section id="club-results" aria-label="Club results" className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {shown.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center sm:col-span-2 lg:col-span-3">
            <h2 className="font-display text-xl font-bold">{favoritesOnly && savedClubs.length === 0 ? "No favorite clubs yet" : "No clubs found"}</h2>
            <p className="mt-2 text-muted-foreground">{favoritesOnly && savedClubs.length === 0 ? "Save clubs with the heart button to build your shortlist. Saving a club does not register you." : "Try a different search or category, or clear the filters to see all clubs."}</p>
            {favoritesOnly && savedClubs.length === 0 && <button onClick={() => { setFavoritesOnly(false); setQuery(""); setFilter("All"); }} className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">Browse all clubs</button>}
          </div>
        )}
        {shown.map((c) => (
          <ClubCard key={c.id} club={c} joined={regs.some((r) => r.clubId === c.id)} memberCount={regs.filter((r) => r.clubId === c.id).length} favorite={favorites.includes(c.id)} onToggleFavorite={() => toggle(c.id)} />
        ))}
      </section>
    </div>
  );
}

function ClubCard({ club, joined, memberCount, favorite, onToggleFavorite }: { club: Club; joined: boolean; memberCount: number; favorite: boolean; onToggleFavorite: () => void }) {
  const spotsLeft = Math.max(club.capacity - memberCount, 0);

  return (
    <article className="relative">
    <Link
      to="/clubs/$clubId"
      params={{ clubId: club.id }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary"
    >
      <div className="flex items-start justify-between">
        <span className="text-4xl">{club.emoji}</span>
        <span className="mr-12 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{club.category}</span>
      </div>
      <h2 className="mt-5 font-display text-xl font-bold">{club.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{club.tagline}</p>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{club.meets.split(" ")[0]}</span>
        {joined ? (
          <span className="font-semibold text-accent">✓ Registered</span>
        ) : (
          <span className={`font-semibold ${spotsLeft === 0 ? "text-destructive" : "text-primary group-hover:underline"}`}>
            {spotsLeft === 0 ? "Full" : `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left →`}
          </span>
        )}
      </div>
    </Link>
    <button
      type="button"
      onClick={onToggleFavorite}
      aria-pressed={favorite}
      aria-label={`${favorite ? "Remove" : "Save"} ${club.name} ${favorite ? "from" : "to"} favorites`}
      title={favorite ? "Remove from favorites" : "Save to favorites"}
      className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${favorite ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-border bg-card text-muted-foreground hover:border-destructive hover:text-destructive"}`}
    >
      <Heart aria-hidden="true" className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} />
    </button>
    </article>
  );
}
