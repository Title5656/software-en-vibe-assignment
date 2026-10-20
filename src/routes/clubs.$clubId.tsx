import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { getClub } from "@/lib/clubs";
import { addRegistration, removeRegistration, useRegistrations } from "@/lib/registrations";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/clubs/$clubId")({
  loader: ({ params }) => {
    const club = getClub(params.clubId);
    if (!club) throw notFound();
    return { club };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.club.name ?? "Club"} — MUICT Clubs` },
      { name: "description", content: loaderData?.club.description ?? "MUICT club" },
      { property: "og:title", content: `${loaderData?.club.name ?? "Club"} — MUICT Clubs` },
      { property: "og:description", content: loaderData?.club.tagline ?? "" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ClubPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  studentId: z.string().trim().regex(/^\d{7}$/, "Student ID must be 7 digits"),
  email: z.string().trim().email("Invalid email").max(255),
});

function ClubPage() {
  const { club } = Route.useLoaderData();
  const regs = useRegistrations();
  const existing = regs.find((r) => r.clubId === club.id);
  const memberCount = regs.filter((r) => r.clubId === club.id).length;
  const spotsLeft = Math.max(club.capacity - memberCount, 0);
  const [form, setForm] = useState({ name: "", studentId: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = schema.safeParse(form);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    const result = addRegistration({ ...res.data, clubId: club.id, registeredAt: new Date().toISOString() }, club);
    if (!result.ok) {
      setErrors({ form: result.error === "already-registered" ? "You are already registered for this club." : "This club is full." });
      return;
    }
    setErrors({});
  };

  const info = [
    ["Meets", club.meets],
    ["Location", club.location],
    ["Advisor", club.advisor],
    ["Capacity", `${club.capacity} members`],
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← All clubs</Link>
          <div className="mt-6 text-6xl">{club.emoji}</div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">{club.category}</p>
          <h1 className="mt-2 font-display text-5xl font-bold tracking-tight">{club.name}</h1>
          <p className="mt-3 text-xl text-muted-foreground">{club.tagline}</p>
          <p className="mt-6 max-w-xl leading-relaxed">{club.description}</p>
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {info.map(([k, v]) => (
              <div key={k} className="bg-card p-5">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
                <dd className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-7 shadow-card lg:sticky lg:top-24">
          {existing ? (
            <div>
              <div className="text-3xl">🎉</div>
              <h2 className="mt-3 font-display text-2xl font-bold">You're registered!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {existing.name} ({existing.studentId}) joined on {new Date(existing.registeredAt).toLocaleDateString()}.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Link to="/my-clubs" className="rounded-lg bg-primary px-4 py-2.5 text-center font-medium text-primary-foreground hover:opacity-90">
                  View my clubs
                </Link>
                <button onClick={() => removeRegistration(club.id)} className="rounded-lg border border-border px-4 py-2.5 text-sm text-destructive hover:bg-muted">
                  Cancel registration
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h2 className="font-display text-2xl font-bold">Register</h2>
              <div className={`rounded-lg px-3 py-2 text-sm ${spotsLeft === 0 ? "bg-destructive/10 text-destructive" : "bg-secondary text-secondary-foreground"}`}>
                {spotsLeft === 0 ? "This club is full." : `${memberCount} / ${club.capacity} members · ${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`}
              </div>
              {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
              {([
                ["name", "Full name", "text"],
                ["studentId", "Student ID", "text"],
                ["email", "Email", "email"],
              ] as const).map(([key, label, type]) => (
                <label key={key} className="block">
                  <span className="text-sm font-medium">{label}</span>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-ring"
                  />
                  {errors[key] && <span className="mt-1 block text-xs text-destructive">{errors[key]}</span>}
                </label>
              ))}
              <button type="submit" disabled={spotsLeft === 0} className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                {spotsLeft === 0 ? "Club full" : `Join ${club.name}`}
              </button>
            </form>
          )}
        </aside>
      </main>
    </div>
  );
}
