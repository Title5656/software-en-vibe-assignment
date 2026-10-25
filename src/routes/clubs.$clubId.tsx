import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { getClub } from "@/lib/clubs";
import { useClubs } from "@/lib/club-store";
import { addRegistration, removeRegistration, useRegistrations } from "@/lib/registrations";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/clubs/$clubId")({
  loader: ({ params }) => {
    const club = getClub(params.clubId);
    return { club };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.club?.name ?? "Club"} — MUICT Clubs` },
      { name: "description", content: loaderData?.club?.description ?? "MUICT club" },
      { property: "og:title", content: `${loaderData?.club?.name ?? "Club"} — MUICT Clubs` },
      { property: "og:description", content: loaderData?.club?.tagline ?? "" },
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
  const { clubId } = Route.useParams();
  const { clubs, ready } = useClubs();
  const club = clubs.find((item) => item.id === clubId);
  const regs = useRegistrations();
  const [submittedStudentId, setSubmittedStudentId] = useState<string | null>(null);
  const existing = regs.find((r) => r.clubId === clubId && r.studentId === submittedStudentId);
  const memberCount = regs.filter((r) => r.clubId === clubId).length;
  const spotsLeft = Math.max((club?.capacity ?? 0) - memberCount, 0);
  const [form, setForm] = useState({ name: "", studentId: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!club) return;
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
    setSubmittedStudentId(res.data.studentId);
  };

  if (!ready || !club) return (
    <div className="min-h-screen"><SiteHeader /><main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold">{!ready ? "Loading club…" : "Club not found"}</h1>
      {ready && <Link to="/" className="mt-4 inline-block text-primary hover:underline">Browse all clubs</Link>}
    </main></div>
  );

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
          <div role="status" className={`mb-4 rounded-lg px-3 py-2 text-sm ${spotsLeft === 0 ? "bg-destructive/10 text-destructive" : "bg-secondary text-secondary-foreground"}`}>
            {memberCount} / {club.capacity} members · {spotsLeft === 0 ? "This club is full." : `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`}
          </div>
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
                <button onClick={() => { setSubmittedStudentId(null); setForm({ name: "", studentId: "", email: "" }); }} className="rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-muted">
                  Register another student
                </button>
                <button onClick={() => removeRegistration(club.id, existing.studentId)} className="rounded-lg border border-border px-4 py-2.5 text-sm text-destructive hover:bg-muted">
                  Cancel registration
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h2 className="font-display text-2xl font-bold">Register</h2>
              <p className="text-sm text-muted-foreground">One registration per student per club. Places are limited to {club.capacity} members.</p>
              {errors["form"] && <p role="alert" className="text-sm text-destructive">{errors["form"]}</p>}
              {([
                ["name", "Full name", "text"],
                ["studentId", "Student ID", "text"],
                ["email", "Email", "email"],
              ] as const).map(([key, label, type]) => (
                <label key={key} className="block">
                  <span className="text-sm font-medium">{label}</span>
                  <input
                    type={type}
                    disabled={spotsLeft === 0}
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
