import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Bomb, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import oyuLogo from "@/assets/oyu-nfac.png";

export function NavBar() {
  const loc = useLocation();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const isHome = loc.pathname === "/";
  const links = [
    { to: "/", label: t("nav.play") },
    { to: "/stats", label: t("nav.stats") },
    { to: "/about", label: t("nav.about") },
  ] as const;

  return (
    <header className={cn(
      "w-full sticky top-0 z-50 py-6 transition-all duration-300",
      isHome
        ? "bg-transparent border-b border-transparent"
        : "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm py-4"
    )}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 font-display font-bold tracking-tight text-xl group"
        >
          <span className={cn(
            "grid place-items-center size-11 rounded-xl ring-1 backdrop-blur-md transition-all overflow-hidden",
            isHome
              ? "bg-white/15 text-white ring-white/25 group-hover:bg-white/25"
              : "bg-primary/10 text-primary ring-primary/20 group-hover:bg-primary/20"
          )}>
            <img
              src={oyuLogo}
              alt="Logo"
              className={cn(
                "size-7 object-contain transition-transform",
                isHome ? "invert" : "dark:invert"
              )}
            />
          </span>
          <span className={cn(
            "drop-shadow-sm transition-colors",
            isHome ? "text-white" : "text-foreground"
          )}>
            DalaSweeper
          </span>
        </Link>

        <nav className="hidden md:flex items-center justify-center gap-2">
          {links.map((l) => {
            const active = loc.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative px-5 py-2.5 rounded-full text-base font-semibold transition-all duration-200",
                  active
                    ? isHome ? "bg-white text-black shadow-lg" : "bg-primary text-primary-foreground shadow-md"
                    : isHome
                      ? "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3 justify-end">
          <div className={cn(
            "flex items-center gap-2 p-1.5 rounded-full backdrop-blur-md ring-1 transition-all",
            isHome ? "bg-white/10 ring-white/20" : "bg-transparent ring-transparent"
          )}>
            <LanguageSwitcher forceWhite={isHome} />
            <ThemeToggle forceWhite={isHome} />
          </div>
        </div>

        <div className="flex md:hidden items-center gap-2 justify-end col-start-3">
          <div className={cn(
            "flex items-center gap-1.5 p-1 rounded-full backdrop-blur-sm transition-all",
            isHome ? "bg-white/10" : "bg-transparent"
          )}>
            <LanguageSwitcher forceWhite={isHome} />
            <ThemeToggle forceWhite={isHome} />
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className={cn(
              "size-11 grid place-items-center rounded-xl backdrop-blur-sm transition-colors",
              isHome
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-accent/50 text-foreground hover:bg-accent"
            )}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className={cn(
          "md:hidden absolute top-full left-0 w-full border-b backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-300",
          isHome ? "border-white/10 bg-black/80" : "border-border/50 bg-background/95"
        )}>
          <nav className="px-4 py-6 flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-5 py-4 rounded-2xl text-lg font-semibold transition-colors",
                  loc.pathname === l.to
                    ? isHome ? "bg-white text-black" : "bg-primary text-primary-foreground"
                    : isHome ? "text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-accent",
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
