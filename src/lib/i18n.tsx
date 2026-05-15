import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ru" | "kk";

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "ru", label: "Русский", short: "RU" },
  { code: "kk", label: "Қазақша", short: "KZ" },
];

const LANG_KEY = "ms:lang:v1";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.play": "Play",
  "nav.stats": "Stats",
  "nav.about": "About",
  "home.badge": "nFactorial Incubator · 2026",
  "home.title.a": "Sweep with ",
  "home.title.b": "courage",
  "home.subtitle": "Click to reveal · Right-click to flag · Click a number to chord",
  "home.howto": "How to play",
  "home.howto.sub": "Four simple rules. Endless replayability.",
  "rule.reveal.t": "Reveal cells",
  "rule.reveal.b": "Left-click any hidden cell to reveal it. Your first click is always safe.",
  "rule.numbers.t": "Read the numbers",
  "rule.numbers.b": "A number shows how many mines touch that cell. Use them to deduce safe spots.",
  "rule.flag.t": "Flag the mines",
  "rule.flag.b": "Right-click (or long-press on touch) a cell you suspect to mark it with a flag.",
  "rule.win.t": "Win the round",
  "rule.win.b": "Reveal every non-mine cell to win. Hit a mine and it's game over.",
  "result.won": "🎉 You won!",
  "result.lost": "💥 Boom!",
  "result.cleared": "Cleared in {s}s",
  "result.bad": "Better luck next time.",
  "result.again": "Play again",
  "footer.autosave": "Your game auto-saves locally — refresh anytime.",
  "diff.beginner": "Beginner",
  "diff.intermediate": "Intermediate",
  "diff.expert": "Expert",
  "stats.title": "Your stats",
  "stats.sub": "Stored locally on this device.",
  "stats.played": "Played",
  "stats.won": "Won",
  "stats.winrate": "Win rate",
  "stats.bestStreak": "Best streak",
  "stats.bestTimes": "Best times",
  "stats.recent": "Recent games",
  "stats.empty": "No games yet.",
  "stats.cell.won": "Won",
  "stats.cell.lost": "Lost",
  "date.today": "Today",
  "about.title": "About DalaSweeper",
  "about.intro":
    "DalaSweeper is a modern take on the classic Minesweeper with Kazakh spirit. Most online versions look like Windows 95 — we wanted one that feels at home on a 2026 browser: clean typography, smooth interactions, dark mode by default, and a fully responsive board that scales to your screen, and with Kazakh color.",
  "about.diff.h": "What's different",
  "about.diff.1": "First click is always safe — no more instant-loss openings.",
  "about.diff.2": "Auto-save: refresh anytime, your in-progress game is restored.",
  "about.diff.3": "Per-difficulty best times, win rate, and streak tracking.",
  "about.diff.4": "Chord reveal: click a satisfied number to open its neighbors.",
  "about.diff.5": "Light & dark themes that actually look good in both modes.",
  "about.howto.h": "How to play",
  "about.howto.1": "Left-click a hidden cell to reveal it.",
  "about.howto.2": "Right-click to flag a suspected mine.",
  "about.howto.3": "Numbers show how many mines touch that cell.",
  "about.howto.4": "Reveal every non-mine cell to win.",
  "about.privacy": "All progress lives in your browser's local storage. Nothing is sent to a server.",
};

const ru: Dict = {
  "nav.play": "Играть",
  "nav.stats": "Статистика",
  "nav.about": "О проекте",
  "home.badge": "nFactorial Incubator · 2026",
  "home.title.a": "Играй с ",
  "home.title.b": "отвагой",
  "home.subtitle": "Клик — открыть · ПКМ — флаг · Клик по цифре — аккорд",
  "home.howto": "Как играть",
  "home.howto.sub": "Четыре простых правила. Бесконечная переигрываемость.",
  "rule.reveal.t": "Открывайте клетки",
  "rule.reveal.b": "Левый клик по скрытой клетке открывает её. Первый клик всегда безопасен.",
  "rule.numbers.t": "Читайте числа",
  "rule.numbers.b": "Число показывает, сколько мин касается клетки. Так вы найдёте безопасные.",
  "rule.flag.t": "Ставьте флаги",
  "rule.flag.b": "Правый клик (или долгое нажатие) ставит флаг на подозрительную клетку.",
  "rule.win.t": "Победите",
  "rule.win.b": "Откройте все клетки без мин, чтобы выиграть. Попали на мину — проиграли.",
  "result.won": "🎉 Победа!",
  "result.lost": "💥 Бум!",
  "result.cleared": "Пройдено за {s} с",
  "result.bad": "В следующий раз получится.",
  "result.again": "Сыграть ещё",
  "footer.autosave": "Игра сохраняется локально — можно обновить страницу.",
  "diff.beginner": "Новичок",
  "diff.intermediate": "Средний",
  "diff.expert": "Эксперт",
  "stats.title": "Ваша статистика",
  "stats.sub": "Хранится локально на этом устройстве.",
  "stats.played": "Сыграно",
  "stats.won": "Победы",
  "stats.winrate": "Процент побед",
  "stats.bestStreak": "Лучшая серия",
  "stats.bestTimes": "Лучшие результаты",
  "stats.recent": "Недавние игры",
  "stats.empty": "Игр пока нет.",
  "stats.cell.won": "Победа",
  "stats.cell.lost": "Поражение",
  "date.today": "Сегодня",
  "about.title": "О DalaSweeper",
  "about.intro":
    "DalaSweeper — современная казахская версия классического Сапёра. Большинство онлайн-версий выглядят как Windows 95, а мы хотели вариант, который смотрится на своём месте в браузере 2026 года: аккуратная типографика, плавные взаимодействия, тёмная тема по умолчанию и адаптивное поле под любой экран, и с казахским колоритом.",
  "about.diff.h": "Что нового",
  "about.diff.1": "Первый клик всегда безопасен — больше никаких мгновенных проигрышей.",
  "about.diff.2": "Автосохранение: обновите страницу, и игра восстановится.",
  "about.diff.3": "Лучшее время по сложностям, процент побед и серии.",
  "about.diff.4": "Аккорд: клик по заполненной цифре открывает соседей.",
  "about.diff.5": "Светлая и тёмная темы, обе выглядят отлично.",
  "about.howto.h": "Как играть",
  "about.howto.1": "Левый клик — открыть клетку.",
  "about.howto.2": "Правый клик — поставить флаг.",
  "about.howto.3": "Числа показывают, сколько мин рядом.",
  "about.howto.4": "Откройте все клетки без мин, чтобы победить.",
  "about.privacy": "Весь прогресс хранится локально в браузере. Ничего не отправляется на сервер.",
};

const kk: Dict = {
  "nav.play": "Ойнау",
  "nav.stats": "Статистика",
  "nav.about": "Жоба туралы",
  "home.badge": "nFactorial Incubator · 2026",
  "home.title.a": "Батылдықпен ",
  "home.title.b": "ойна",
  "home.subtitle": "Шерту — ашу · Оң шерту — жалауша · Санға шерту — аккорд",
  "home.howto": "Қалай ойнау",
  "home.howto.sub": "Төрт қарапайым ереже. Шексіз қызық.",
  "rule.reveal.t": "Торларды ашу",
  "rule.reveal.b": "Жасырын торды сол жақ шертумен ашыңыз. Алғашқы шерту әрқашан қауіпсіз.",
  "rule.numbers.t": "Сандарды оқу",
  "rule.numbers.b": "Сан тордың жанындағы мина санын көрсетеді. Қауіпсіз торларды табыңыз.",
  "rule.flag.t": "Жалауша қою",
  "rule.flag.b": "Күмәнді торды оң шертумен (немесе ұзақ басумен) белгілеңіз.",
  "rule.win.t": "Жеңіске жету",
  "rule.win.b": "Минасыз барлық торды ашсаңыз — жеңіс. Минаға тисеңіз — ұтылыс.",
  "result.won": "🎉 Жеңіс!",
  "result.lost": "💥 Жарылыс!",
  "result.cleared": "{s} с ішінде өтті",
  "result.bad": "Келесі жолы сәтті болсын.",
  "result.again": "Қайта ойнау",
  "footer.autosave": "Ойын жергілікті сақталады — кез келген уақытта жаңартыңыз.",
  "diff.beginner": "Бастаушы",
  "diff.intermediate": "Орташа",
  "diff.expert": "Сарапшы",
  "stats.title": "Сіздің статистика",
  "stats.sub": "Осы құрылғыда жергілікті сақталады.",
  "stats.played": "Ойналған",
  "stats.won": "Жеңіс",
  "stats.winrate": "Жеңіс пайызы",
  "stats.bestStreak": "Үздік серия",
  "stats.bestTimes": "Үздік уақыт",
  "stats.recent": "Соңғы ойындар",
  "stats.empty": "Әзірге ойын жоқ.",
  "stats.cell.won": "Жеңіс",
  "stats.cell.lost": "Ұтылыс",
  "date.today": "Бүгін",
  "about.title": "DalaSweeper туралы",
  "about.intro":
    "DalaSweeper — классикалық Сапёрдың заманауи қазақша нұсқасы. Көптеген онлайн нұсқалар Windows 95 сияқты көрінеді, ал біз 2026 жылғы браузерге лайық нұсқа жасадық: таза типографика, тегіс әрекеттестік, әдепкі қара тақырып және кез келген экранға бейімделетін тақта, сонымен қатар қазақша колоритпен.",
  "about.diff.h": "Айырмашылығы",
  "about.diff.1": "Алғашқы шерту әрқашан қауіпсіз.",
  "about.diff.2": "Автосақтау: бетті жаңартыңыз — ойын қалпына келеді.",
  "about.diff.3": "Қиындық бойынша үздік уақыт, жеңіс пайызы және серия.",
  "about.diff.4": "Аккорд: толтырылған санға шерту көршілерін ашады.",
  "about.diff.5": "Жарық пен қара тақырыптар екеуі де әдемі көрінеді.",
  "about.howto.h": "Қалай ойнау",
  "about.howto.1": "Сол жақ шерту — торды ашу.",
  "about.howto.2": "Оң жақ шерту — жалауша қою.",
  "about.howto.3": "Сандар жанындағы мина санын көрсетеді.",
  "about.howto.4": "Минасыз барлық торды ашыңыз.",
  "about.privacy": "Барлық прогресс браузердің жергілікті жадында сақталады. Серверге ештеңе жіберілмейді.",
};

const dicts: Record<Lang, Dict> = { en, ru, kk };

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LANG_KEY);
      if (raw === "en" || raw === "ru" || raw === "kk") {
        setLangState(raw);
        return;
      }
      const nav = navigator.language?.toLowerCase() ?? "";
      if (nav.startsWith("ru")) setLangState("ru");
      else if (nav.startsWith("kk") || nav.startsWith("kz")) setLangState("kk");
    } catch {
      /* ignore */
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }

  function t(key: string, vars?: Record<string, string | number>) {
    const dict = dicts[lang];
    let str = dict[key] ?? dicts.en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  }

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback so the app never crashes outside the provider.
    return {
      lang: "en",
      setLang: () => { },
      t: (k) => dicts.en[k] ?? k,
    };
  }
  return ctx;
}
