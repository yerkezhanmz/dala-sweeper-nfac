import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Bomb, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Play" },
  { to: "/stats", label: "Stats" },
  { to: "/about", label: "About" },
] as const;

export function NavBar() {
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-border/50 bg-background/70 backdrop-blur-xl sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-display font-bold tracking-tight text-base"
        >
          <span className="grid place-items-center size-8 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <Bomb className="size-4" />
          </span>
          <span>Minesweep</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = loc.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-[14px] h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="size-9 grid place-items-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur">
          <nav className="px-4 py-2 flex flex-col">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-2.5 rounded-md text-sm font-medium",
                  loc.pathname === l.to
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
