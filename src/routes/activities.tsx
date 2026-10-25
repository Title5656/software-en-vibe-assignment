import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { getClub } from "@/lib/clubs";
import { useClubs } from "@/lib/club-store";
import { getBangkokToday, getDemoActivities, getWeekStart, shiftDate } from "@/lib/activities";

export const Route = createFileRoute("/activities")({
  head: () => ({ meta: [{ title: "Weekly Activities — MUICT Clubs" }, { name: "description", content: "Explore seven demo club activities across the week, with dates, times, venues and organizers." }] }),
  component: ActivitiesPage,
});

function formatDate(date: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function ActivitiesPage() {
  const { clubs } = useClubs();
  const [today] = useState(() => getBangkokToday());
  const [weekStart, setWeekStart] = useState(() => getWeekStart(today));
  const [selectedDate, setSelectedDate] = useState("");
  const activities = getDemoActivities(weekStart);
  const shown = selectedDate ? activities.filter((activity) => activity.date === selectedDate) : activities;
  const moveWeek = (days: number) => { setWeekStart(shiftDate(weekStart, days)); setSelectedDate(""); };
  const buttonClass = "rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Campus life · Demo schedule</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Weekly activities</h1>
          <span className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">7 demo activities every week</span>
        </div>
        <p className="mt-4 max-w-2xl text-muted-foreground">Plan your week, try something new, and meet the clubs behind each activity.</p>
        <p className="mt-3 max-w-3xl rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">Class demo: these seven sample activities repeat in each displayed week. Dates are illustrative; all times use Bangkok time (UTC+7).</p>

        <section aria-label="Schedule controls" className="mt-8 rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Monday – Sunday</p>
              <h2 className="mt-1 font-display text-xl font-bold">{formatDate(weekStart, { day: "numeric", month: "short", year: "numeric" })} – {formatDate(shiftDate(weekStart, 6), { day: "numeric", month: "short", year: "numeric" })}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className={buttonClass} onClick={() => moveWeek(-7)}>← Previous week</button>
              <button className={buttonClass} onClick={() => { setWeekStart(getWeekStart(getBangkokToday())); setSelectedDate(""); }}>This week</button>
              <button className={buttonClass} onClick={() => moveWeek(7)}>Next week →</button>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-border pt-5">
            <label className="block text-sm font-medium" htmlFor="activity-date">Choose a date
              <input id="activity-date" type="date" min="2000-01-01" max="2100-12-31" value={selectedDate} onChange={(event) => {
                const date = event.target.value;
                if (!date || !event.target.validity.valid) return;
                setSelectedDate(date); setWeekStart(getWeekStart(date));
              }} className="mt-2 block rounded-lg border border-input bg-background px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-ring" />
            </label>
            {selectedDate && <button className={buttonClass} onClick={() => setSelectedDate("")}>Show whole week</button>}
            <p role="status" className="py-2 text-sm text-muted-foreground">{selectedDate ? `${shown.length} activity on ${formatDate(selectedDate, { day: "numeric", month: "short", year: "numeric" })}` : "Showing 7 activities across 7 days"}</p>
          </div>
        </section>

        <section aria-label="Weekly activity schedule" className={`mt-6 grid gap-4 ${selectedDate ? "max-w-2xl" : "md:grid-cols-2 xl:grid-cols-4"}`}>
          {shown.map((activity) => {
            const club = clubs.find((item) => item.id === activity.clubId);
            const organizer = club ?? getClub(activity.clubId);
            return (
              <article key={`${activity.date}-${activity.id}`} aria-label={`${activity.title}, ${activity.date}`} className={`min-w-0 overflow-hidden rounded-2xl border bg-card shadow-card ${activity.date === today ? "border-accent" : "border-border"}`}>
                <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary/50 px-5 py-4">
                  <div>
                    <h3 className="font-display text-lg font-bold">{formatDate(activity.date, { weekday: "long" })}</h3>
                    <time dateTime={activity.date} className="text-sm text-muted-foreground">{formatDate(activity.date, { day: "numeric", month: "short", year: "numeric" })}</time>
                  </div>
                  {activity.date === today && <span className="rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">Today</span>}
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-primary"><time dateTime={`${activity.date}T${activity.startTime}:00+07:00`}>{activity.startTime}</time> – <time dateTime={`${activity.date}T${activity.endTime}:00+07:00`}>{activity.endTime}</time></p>
                  <h4 className="mt-3 font-display text-xl font-bold leading-snug">{activity.title}</h4>
                  <p className="mt-3 text-sm font-medium">{organizer?.emoji} Hosted by {organizer?.name ?? "MUICT Clubs"}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Location: {activity.location}</p>
                  <details className="mt-5 border-t border-border pt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Activity details</summary>
                    <p className="mt-3 text-sm leading-relaxed">{activity.description}</p>
                    <p className="mt-3 text-sm leading-relaxed"><strong>What to bring:</strong> {activity.preparation}</p>
                    <p className="mt-3 text-xs text-muted-foreground">Demo activity · Bangkok time (UTC+7)</p>
                    {club ? <Link to="/clubs/$clubId" params={{ clubId: club.id }} className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">View organizing club →</Link> : <p className="mt-3 text-xs text-muted-foreground">The organizing club is no longer in the directory.</p>}
                  </details>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
