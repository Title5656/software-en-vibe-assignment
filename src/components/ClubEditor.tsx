import { useState } from "react";
import type { Club } from "@/lib/clubs";
import { saveClub } from "@/lib/club-store";

export function ClubEditor({ club, isNew, onSaved, onCancel }: {
  club: Club;
  isNew: boolean;
  onSaved: (club: Club) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(club);
  const [error, setError] = useState("");
  const fieldClass = "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-ring";
  return (
    <form className="space-y-4" onSubmit={(event) => {
      event.preventDefault();
      const result = saveClub(draft);
      if (!result.ok) { setError(result.error); return; }
      onSaved(draft);
    }}>
      <h2 className="font-display text-2xl font-bold">{isNew ? "Add club" : "Edit club"}</h2>
      {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {([
          ["name", "Club name", 100], ["emoji", "Club emoji", 20],
          ["tagline", "Tagline", 200], ["meets", "Meeting schedule", 200],
          ["location", "Location", 200], ["advisor", "Advisor", 100],
        ] as const).map(([key, label, maxLength]) => (
          <label className="block text-sm font-medium" key={key}>
            {label}
            <input className={fieldClass} required maxLength={maxLength} value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} />
          </label>
        ))}
        <label className="block text-sm font-medium">Category
          <select className={fieldClass} value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as Club["category"] })}>
            {["Tech", "Sport", "Culture", "Creative"].map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium">Maximum members
          <input className={fieldClass} required type="number" min={1} max={10000} step={1} value={Number.isNaN(draft.capacity) ? "" : draft.capacity} onChange={(event) => setDraft({ ...draft, capacity: event.target.valueAsNumber })} />
        </label>
      </div>
      <label className="block text-sm font-medium">Description
        <textarea className={fieldClass} rows={3} required maxLength={2000} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
      </label>
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90">Save club</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-border px-5 py-2.5 hover:bg-muted">Cancel</button>
      </div>
    </form>
  );
}
