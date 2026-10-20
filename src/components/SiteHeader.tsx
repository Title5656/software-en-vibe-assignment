import { Link } from "@tanstack/react-router";
import { useRegistrations } from "@/lib/registrations";

export function SiteHeader() {
  const regs = useRegistrations();
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          MUICT<span className="text-accent">.</span>clubs
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>
            All clubs
          </Link>
          <Link to="/my-clubs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            My clubs
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{regs.length}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
