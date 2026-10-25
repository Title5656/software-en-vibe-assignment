import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Club } from "@/lib/clubs";
import { deleteClub, useClubs } from "@/lib/club-store";
import { useRegistrations } from "@/lib/registrations";
import { SiteHeader } from "@/components/SiteHeader";
import { ClubEditor } from "@/components/ClubEditor";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administrator — MUICT Clubs" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { clubs } = useClubs();
  const registrations = useRegistrations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ club: Club; isNew: boolean } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const selected = clubs.find((club) => club.id === selectedId) ?? clubs[0];
  const students = registrations.filter((registration) => registration.clubId === selected?.id);
  const deletion = clubs.find((club) => club.id === deleteId);
  const selectClub = (id: string) => { setSelectedId(id); setEditor(null); setDeleteId(null); setNotice(""); setError(""); };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Administration · Demo</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Manage clubs</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Manage club details and view registered students. This class demo saves changes in this browser; no sign-in is required.</p>
          </div>
          <button onClick={() => {
            setEditor({ isNew: true, club: { id: crypto.randomUUID(), name: "", emoji: "🎓", category: "Tech", tagline: "", description: "", meets: "", location: "", advisor: "", capacity: 30 } });
            setDeleteId(null); setNotice(""); setError("");
          }} className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90">+ Add club</button>
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-3">
          {[["Clubs", clubs.length], ["Registrations", registrations.length], ["Students", new Set(registrations.map((registration) => registration.studentId)).size]].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="mt-1 font-display text-3xl font-bold">{value}</dd>
            </div>
          ))}
        </dl>
        {notice && <p role="status" className="mt-5 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">{notice}</p>}
        {error && <p role="alert" className="mt-5 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

        {clubs.length > 0 && <label className="mt-6 block text-sm font-medium lg:hidden">Select club
          <select value={selected?.id ?? ""} onChange={(event) => selectClub(event.target.value)} className="mt-2 w-full rounded-lg border border-input bg-card px-3 py-3">
            {clubs.map((club) => <option key={club.id} value={club.id}>{club.emoji} {club.name}</option>)}
          </select>
        </label>}

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[280px_1fr]">
          <section aria-label="Manage club list" className="hidden rounded-2xl border border-border bg-card p-4 lg:block">
            <h2 className="px-2 pb-3 font-display text-lg font-bold">All clubs</h2>
            {clubs.length === 0 && <p className="px-2 text-sm text-muted-foreground">No clubs yet. Add your first club to get started.</p>}
            <ul className="space-y-2">
              {clubs.map((club) => {
                const count = registrations.filter((registration) => registration.clubId === club.id).length;
                return <li key={club.id}>
                  <button aria-pressed={selected?.id === club.id && !editor} onClick={() => selectClub(club.id)} className={`w-full rounded-xl border p-3 text-left transition ${selected?.id === club.id && !editor ? "border-primary bg-secondary" : "border-transparent hover:bg-muted"}`}>
                    <span className="block font-medium">{club.emoji} {club.name}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{club.category} · {count} / {club.capacity} members</span>
                  </button>
                </li>;
              })}
            </ul>
          </section>

          <section aria-label={editor ? "Club editor" : "Club management details"} className="min-w-0 rounded-2xl border border-border bg-card p-6 shadow-card">
            {editor ? <ClubEditor key={editor.club.id} club={editor.club} isNew={editor.isNew} onCancel={() => setEditor(null)} onSaved={(club) => {
              setSelectedId(club.id); setEditor(null); setNotice(`${club.name.trim()} saved successfully.`);
            }} /> : selected ? <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{selected.category}</p>
                  <h2 className="mt-1 font-display text-2xl font-bold">{selected.emoji} {selected.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{students.length} / {selected.capacity} members · {Math.max(selected.capacity - students.length, 0)} places available</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setEditor({ club: selected, isNew: false }); setDeleteId(null); setNotice(""); setError(""); }} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Edit club</button>
                  <button disabled={students.length > 0} onClick={() => { setDeleteId(selected.id); setNotice(""); setError(""); }} className="rounded-lg border border-border px-4 py-2 text-sm text-destructive hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50">Delete club</button>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed">{selected.description}</p>
              <Link to="/clubs/$clubId" params={{ clubId: selected.id }} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">View club page →</Link>
              {students.length > 0 && <p className="mt-3 text-xs text-muted-foreground">Clubs with registered students cannot be deleted.</p>}
              {deletion && <div role="alert" className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm">Delete {deletion.name}? This removes the club from this browser.</p>
                <div className="mt-3 flex gap-3">
                  <button onClick={() => {
                    const result = deleteClub(deletion.id);
                    if (!result.ok) { setError(result.error); setDeleteId(null); return; }
                    setNotice(`${deletion.name} deleted.`); setDeleteId(null);
                  }} className="rounded-lg bg-destructive px-4 py-2 text-sm text-white">Confirm delete</button>
                  <button onClick={() => setDeleteId(null)} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel deletion</button>
                </div>
              </div>}
              <h3 className="mt-8 font-display text-xl font-bold">Registered students</h3>
              {students.length === 0 ? <p className="mt-3 rounded-xl bg-muted px-4 py-8 text-center text-sm text-muted-foreground">No students have registered for this club yet.</p> : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">Registered students for {selected.name}</caption>
                    <thead className="border-b border-border text-muted-foreground"><tr>{["Name", "Student ID", "Email", "Registered"].map((label) => <th scope="col" key={label} className="whitespace-nowrap px-3 py-3 font-medium">{label}</th>)}</tr></thead>
                    <tbody>{students.map((student) => <tr key={student.studentId} className="border-b border-border last:border-0">
                      <td className="px-3 py-4">{student.name}</td><td className="px-3 py-4">{student.studentId}</td><td className="break-all px-3 py-4">{student.email}</td><td className="whitespace-nowrap px-3 py-4">{new Date(student.registeredAt).toLocaleDateString()}</td>
                    </tr>)}</tbody>
                  </table>
                </div>
              )}
            </> : <div><h2 className="font-display text-2xl font-bold">Your club directory is empty</h2><p className="mt-3 text-sm text-muted-foreground">Use Add club to create a club and start accepting registrations.</p></div>}
          </section>
        </div>
      </main>
    </div>
  );
}
