import { Link, useLocation } from "@tanstack/react-router";
import { Bomb } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

export function NavBar() {
  const loc = useLocation();
  const links = [
    { to: "/", label: "Play" },
    { to: "/stats", label: "Stats" },
    { to: "/about", label: "About" },
  ] as const;
  return (
    <header className="w-full border-b border-border/50 bg-background/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <Bomb className="size-5 text-primary" />
          <span>Minesweep</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                loc.pathname === l.to
                  ? "text-foreground font-medium bg-accent"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
