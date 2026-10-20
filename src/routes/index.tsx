import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { clubs, type Club } from "@/lib/clubs";
import { useRegistrations } from "@/lib/registrations";
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
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const regs = useRegistrations();
  const shown = clubs.filter((c) => filter === "All" || c.category === filter);
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
        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <ClubCard key={c.id} club={c} joined={regs.some((r) => r.clubId === c.id)} memberCount={regs.filter((r) => r.clubId === c.id).length} />
        ))}
      </section>
    </div>
  );
}

function ClubCard({ club, joined, memberCount }: { club: Club; joined: boolean; memberCount: number }) {
  const spotsLeft = Math.max(club.capacity - memberCount, 0);

  return (
    <Link
      to="/clubs/$clubId"
      params={{ clubId: club.id }}
      className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:border-primary"
    >
      <div className="flex items-start justify-between">
        <span className="text-4xl">{club.emoji}</span>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{club.category}</span>
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
  );
}
