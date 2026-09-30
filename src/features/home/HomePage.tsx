/** Dashboard: continue where you left off, streak, reviews due, track progress. */
import { Link } from "react-router";
import { findLesson, flattenTrack, isLessonAvailable, tracks } from "../../content/registry";
import { useProgress } from "../../progress/store";
import { currentStreak } from "../../progress/streak";
import { isDue } from "../../progress/review";
import { toDay } from "../../progress/dates";
import { Badge, Card, Kbd, ProgressBar, modKey } from "../../components/ui";
import { Icon } from "../../components/Icon";
import { trackStats } from "../shell/Sidebar";

export function HomePage() {
  const progress = useProgress((p) => p);
  const today = toDay();
  const streak = currentStreak(progress.activity, today);
  const due = Object.values(progress.review).filter((c) => isDue(c, today)).length;
  const exercisesPassed = Object.values(progress.lessons).reduce(
    (n, l) => n + Object.values(l.exercises).filter((e) => e.passed).length,
    0,
  );

  // Continue: the last visited lesson if unfinished, else the first unfinished lesson.
  const last = progress.lastLesson ? findLesson(progress.lastLesson) : undefined;
  const firstOpen = flattenTrack(tracks[0]).find((l) => isLessonAvailable(l.path) && !progress.lessons[l.path]?.completedAt);
  const resume = last && !progress.lessons[last.path]?.completedAt ? last : firstOpen;
  const isFresh = Object.keys(progress.lessons).length === 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{isFresh ? "Welcome to CodePath" : "Welcome back"}</h1>
        <p className="mt-2 max-w-2xl text-muted">
          {isFresh
            ? "Short explanation → worked example → you write code. Every lesson traces the code line by line, so you see exactly how each value is produced."
            : "Pick up where you left off, or clear your reviews first."}
        </p>
        {resume && (
          <Link
            to={`/learn/${resume.path}`}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-semibold text-on-accent hover:bg-accent-strong"
          >
            <Icon name="play" size={16} />
            {isFresh ? "Start lesson 1" : "Continue"}: {resume.lesson.title}
          </Link>
        )}
      </section>

      <section aria-label="Your numbers" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon="flame" label="Day streak" value={streak} />
        <Stat icon="review" label="Reviews due" value={due} link={due ? "/review" : undefined} />
        <Stat icon="check" label="Exercises passed" value={exercisesPassed} />
        <Stat icon="book" label="Lessons done" value={Object.values(progress.lessons).filter((l) => l.completedAt).length} />
      </section>

      <section aria-labelledby="tracks-heading">
        <h2 id="tracks-heading" className="mb-3 text-lg font-semibold">
          Tracks
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tracks.map((t) => {
            const s = trackStats(t, progress.lessons);
            const first = flattenTrack(t).find((l) => isLessonAvailable(l.path));
            return (
              <Card key={t.id} className="flex flex-col p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{t.title}</h3>
                  {t.status === "ready" ? <Badge tone="accent">{s.available} lessons ready</Badge> : <Badge>Coming soon</Badge>}
                </div>
                <p className="mt-1.5 flex-1 text-sm text-muted">{t.tagline}</p>
                {t.status === "ready" ? (
                  <>
                    <ProgressBar className="mt-4" value={s.done} max={s.total} label={`${t.title} progress`} />
                    <p className="mt-1.5 text-xs text-muted">
                      {s.done} of {s.total} lessons completed
                    </p>
                    {first && (
                      <Link to={`/cheatsheet/${t.id}`} className="mt-3 text-sm text-accent hover:underline">
                        Cheat sheet →
                      </Link>
                    )}
                  </>
                ) : (
                  <p className="mt-4 text-xs text-faint">{t.modules.length} modules planned</p>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-border p-4 text-sm text-muted">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1.5 font-medium text-fg">
            <Icon name="keyboard" size={16} /> Shortcuts
          </span>
          <span>
            <Kbd>{modKey}</Kbd> <Kbd>Enter</Kbd> run
          </span>
          <span>
            <Kbd>{modKey}</Kbd> <Kbd>Shift</Kbd> <Kbd>Enter</Kbd> check
          </span>
          <span>
            <Kbd>{modKey}</Kbd> <Kbd>S</Kbd> save
          </span>
          <span className="flex items-center gap-1">
            <Icon name="moon" size={15} /> in the top bar switches to a warmer night theme
          </span>
        </p>
      </section>
    </div>
  );
}

function Stat({ icon, label, value, link }: { icon: "flame" | "review" | "check" | "book"; label: string; value: number; link?: string }) {
  const body = (
    <Card className="p-4">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted">
        <Icon name={icon} size={14} /> {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </Card>
  );
  return link ? (
    <Link to={link} className="rounded-xl">
      {body}
    </Link>
  ) : (
    body
  );
}
