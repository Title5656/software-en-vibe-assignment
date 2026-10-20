import { createFileRoute, Link } from "@tanstack/react-router";
import { getClub } from "@/lib/clubs";
import { removeRegistration, useRegistrations } from "@/lib/registrations";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/my-clubs")({
  head: () => ({
    meta: [
      { title: "My Clubs — MUICT Club Registration" },
      { name: "description", content: "See the MUICT clubs you've registered for." },
      { property: "og:title", content: "My Clubs — MUICT" },
      { property: "og:description", content: "Your registered MUICT clubs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyClubs,
});

function MyClubs() {
  const regs = useRegistrations();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-14">
        <h1 className="font-display text-4xl font-bold tracking-tight">My clubs</h1>
        <p className="mt-2 text-muted-foreground">
          {regs.length ? `You're a member of ${regs.length} club${regs.length > 1 ? "s" : ""}.` : "You haven't joined any clubs yet."}
        </p>
        {regs.length === 0 ? (
          <Link to="/" className="mt-8 inline-block rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90">
            Browse clubs
          </Link>
        ) : (
          <ul className="mt-8 space-y-3">
            {regs.map((r) => {
              const c = getClub(r.clubId);
              if (!c) return null;
              return (
                <li key={r.clubId} className="flex items-center gap-5 rounded-2xl border border-border bg-card p-5 shadow-card">
                  <span className="text-4xl">{c.emoji}</span>
                  <div className="flex-1">
                    <Link to="/clubs/$clubId" params={{ clubId: c.id }} className="font-display text-lg font-bold hover:text-primary">
                      {c.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{c.meets} · {c.location}</p>
                    <p className="text-xs text-muted-foreground">Registered {new Date(r.registeredAt).toLocaleDateString()} as {r.name}</p>
                  </div>
                  <button onClick={() => removeRegistration(c.id)} className="text-sm text-destructive hover:underline">
                    Leave
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
