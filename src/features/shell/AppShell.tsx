/** The frame around every page: top bar, sidebar, and the page itself. */
import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { onSaved, saveNow, updateProgress, useProgress } from "../../progress/store";
import { currentStreak } from "../../progress/streak";
import { isDue } from "../../progress/review";
import { toDay } from "../../progress/dates";
import { Icon, type IconName } from "../../components/Icon";
import { cx } from "../../lib/cx";
import { Sidebar } from "./Sidebar";

const links: { to: string; label: string; icon: IconName }[] = [
  { to: "/", label: "Dashboard", icon: "home" },
  { to: "/review", label: "Review", icon: "review" },
  { to: "/playground", label: "Playground", icon: "terminal" },
  { to: "/cheatsheet/python", label: "Cheat sheets", icon: "sheet" },
  { to: "/stats", label: "Stats", icon: "chart" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const activity = useProgress((p) => p.activity);
  const review = useProgress((p) => p.review);
  const theme = useProgress((p) => p.settings.theme);
  const location = useLocation();
  const today = toDay();
  const streak = currentStreak(activity, today);
  const due = Object.values(review).filter((c) => isDue(c, today)).length;

  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Ctrl/Cmd+S saves everything (and shows a small "Saved" note).
  useEffect(() => {
    const offSaved = onSaved((at) => setSavedAt(at));
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void saveNow();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      offSaved();
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  const recentlySaved = savedAt && Date.now() - savedAt.getTime() < 2500;
  useEffect(() => {
    if (!savedAt) return;
    const t = setTimeout(() => setSavedAt((s) => (s === savedAt ? null : s)), 2600);
    return () => clearTimeout(t);
  }, [savedAt]);

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-on-accent">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-bg/90 px-3 backdrop-blur sm:px-4">
        <button
          type="button"
          className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-fg lg:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="sidebar"
          aria-label="Course contents"
        >
          <Icon name="menu" />
        </button>
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <img src="./favicon.svg" alt="" className="size-7" />
          CodePath
        </Link>
        <nav aria-label="Main" className="ml-2 hidden items-center gap-0.5 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cx("flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm", isActive ? "bg-surface-2 text-fg" : "text-muted hover:text-fg")
              }
            >
              <Icon name={l.icon} size={16} />
              {l.label}
              {l.to === "/review" && due > 0 && (
                <span className="rounded-full bg-accent px-1.5 text-[0.7rem] font-semibold text-on-accent" aria-label={`${due} due`}>
                  {due}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
          <span className={cx("text-xs text-success transition-opacity", recentlySaved ? "opacity-100" : "opacity-0")} aria-live="polite">
            {recentlySaved ? "✓ Saved" : ""}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted" title="Days in a row with practice">
            <Icon name="flame" size={17} className={streak > 0 ? "text-warning" : "text-faint"} />
            <span className="tabular-nums">{streak}</span>
            <span className="sr-only sm:not-sr-only">day streak</span>
          </span>
          <button
            type="button"
            onClick={() => updateProgress((d) => void (d.settings.theme = d.settings.theme === "dark" ? "warm" : "dark"))}
            className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-fg"
            aria-label={theme === "dark" ? "Switch to the warm night theme" : "Switch to the standard dark theme"}
            title={theme === "dark" ? "Night warm theme" : "Standard dark theme"}
          >
            <Icon name={theme === "dark" ? "moon" : "sun"} />
          </button>
          <NavLink to="/settings" className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-fg" aria-label="Settings" title="Settings">
            <Icon name="settings" />
          </NavLink>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar: always visible on large screens, a drawer on small ones */}
        <aside
          id="sidebar"
          className={cx(
            "fixed inset-y-0 left-0 top-14 z-20 w-72 shrink-0 overflow-y-auto border-r border-border bg-bg lg:sticky lg:block lg:h-[calc(100vh-3.5rem)]",
            menuOpen ? "block" : "hidden",
          )}
        >
          <nav aria-label="Pages" className="border-b border-border p-3 md:hidden">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted hover:text-fg">
                <Icon name={l.icon} size={16} /> {l.label}
                {l.to === "/review" && due > 0 && <span className="text-accent">({due} due)</span>}
              </NavLink>
            ))}
          </nav>
          <Sidebar onNavigate={() => setMenuOpen(false)} />
        </aside>
        {menuOpen && <div className="fixed inset-0 top-14 z-10 bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
        <main id="main" className="min-w-0 flex-1" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
