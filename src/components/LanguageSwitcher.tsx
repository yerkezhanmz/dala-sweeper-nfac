import { Globe } from "lucide-react";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher({ forceWhite }: { forceWhite?: boolean }) {
  const { lang, setLang } = useI18n();
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-10 px-3 gap-2 font-semibold transition-colors",
            forceWhite 
              ? "text-white hover:bg-white/10 hover:text-white" 
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
          aria-label="Change language"
        >
          <Globe className="size-5" />
          <span className="text-sm tabular-nums">{current.short}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code as Lang)}
            className={cn(
              "cursor-pointer flex items-center justify-between",
              l.code === lang && "font-semibold text-primary",
            )}
          >
            <span>{l.label}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{l.short}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
