import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Minesweep" },
      {
        name: "description",
        content:
          "About Minesweep — a modern, minimal Minesweeper for the web with smart QoL features.",
      },
      { property: "og:title", content: "About — Minesweep" },
      {
        property: "og:description",
        content: "Why we built a modern Minesweeper and what makes it different.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <NavBar />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("about.title")}</h1>
        <p className="text-muted-foreground leading-relaxed">{t("about.intro")}</p>

        <div>
          <h2 className="text-lg font-semibold mb-2">{t("about.diff.h")}</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>{t("about.diff.1")}</li>
            <li>{t("about.diff.2")}</li>
            <li>{t("about.diff.3")}</li>
            <li>{t("about.diff.4")}</li>
            <li>{t("about.diff.5")}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">{t("about.howto.h")}</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>{t("about.howto.1")}</li>
            <li>{t("about.howto.2")}</li>
            <li>{t("about.howto.3")}</li>
            <li>{t("about.howto.4")}</li>
          </ul>
        </div>

        <p className="text-sm text-muted-foreground">{t("about.privacy")}</p>
      </main>
    </div>
  );
}
