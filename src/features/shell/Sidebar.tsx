/** Sidebar: tracks → modules → lessons, with progress and completion checkmarks. */
import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import { flattenTrack, isLessonAvailable, lessonPath, tracks } from "../../content/registry";
import { useProgress } from "../../progress/store";
import type { ProgressData } from "../../progress/schema";
import { DoneCheck, ProgressBar } from "../../components/ui";
import { Icon } from "../../components/Icon";
import { cx } from "../../lib/cx";
import type { TrackOutline } from "../../content/types";

export function trackStats(track: TrackOutline, lessons: ProgressData["lessons"]) {
  const all = flattenTrack(track);
  const available = all.filter((l) => isLessonAvailable(l.path));
  const done = all.filter((l) => lessons[l.path]?.completedAt).length;
  return { total: all.length, available: available.length, done };
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const lessons = useProgress((p) => p.lessons);
  const { pathname } = useLocation();
  const current = pathname.startsWith("/learn/") ? pathname.slice(7) : "";

  return (
    <nav aria-label="Course contents" className="space-y-6 px-3 py-4">
      {tracks.map((track) => {
        const stats = trackStats(track, lessons);
        return (
          <div key={track.id}>
            <div className="px-2">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-fg">{track.title}</h2>
                {track.status === "ready" ? (
                  <span className="text-xs tabular-nums text-muted">
                    {stats.done}/{stats.total}
                  </span>
                ) : (
                  <span className="text-xs text-faint">coming soon</span>
                )}
              </div>
              {track.status === "ready" && <ProgressBar className="mt-1.5" value={stats.done} max={stats.total} label={`${track.title} progress`} />}
            </div>
            <ul className="mt-2 space-y-0.5">
              {track.modules.map((m) => (
                <ModuleItem key={m.id} trackId={track.id} module={m} lessons={lessons} current={current} onNavigate={onNavigate} comingSoon={track.status !== "ready"} />
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function ModuleItem({
  trackId,
  module,
  lessons,
  current,
  onNavigate,
  comingSoon,
}: {
  trackId: string;
  module: TrackOutline["modules"][number];
  lessons: ProgressData["lessons"];
  current: string;
  onNavigate?: () => void;
  comingSoon: boolean;
}) {
  const containsCurrent = current.startsWith(`${trackId}/${module.id}/`);
  const [open, setOpen] = useState(containsCurrent);
  const paths = module.lessons.map((l) => lessonPath(trackId, module.id, l.id));
  const done = paths.filter((p) => lessons[p]?.completedAt).length;
  const moduleDone = paths.length > 0 && done === paths.length;
  const available = paths.some(isLessonAvailable);
  const expanded = open || containsCurrent;

  if (comingSoon || !module.lessons.length) {
    return (
      <li className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-faint">
        <Icon name="lock" size={13} />
        <span className="truncate">{module.title}</span>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen(!expanded)}
        aria-expanded={expanded}
        className={cx("flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-surface-2", available ? "text-fg" : "text-faint")}
      >
        <Icon name={expanded ? "chevronDown" : "chevronRight"} size={14} className="shrink-0 text-faint" />
        <span className="flex-1 truncate">{module.title}</span>
        {moduleDone ? (
          <>
            <DoneCheck size={15} />
            <span className="sr-only">module complete</span>
          </>
        ) : available ? (
          <span className="text-xs tabular-nums text-faint">
            {done}/{paths.length}
          </span>
        ) : (
          <span className="text-[0.7rem] text-faint">soon</span>
        )}
      </button>
      {expanded && (
        <ul className="mb-1 ml-4 border-l border-border pl-2">
          {module.lessons.map((l, i) => {
            const path = paths[i];
            const isDone = !!lessons[path]?.completedAt;
            const started = !isDone && !!lessons[path]?.lastVisited;
            if (!isLessonAvailable(path)) {
              return (
                <li key={l.id} className="flex items-center gap-2 px-2 py-1 text-sm text-faint">
                  <Icon name="lock" size={13} />
                  <span className="truncate">{l.title}</span>
                  <span className="sr-only">(coming soon)</span>
                </li>
              );
            }
            return (
              <li key={l.id}>
                <NavLink
                  to={`/learn/${path}`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cx(
                      "flex items-center gap-2 rounded-md px-2 py-1 text-sm",
                      isActive ? "bg-accent-soft font-medium text-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
                    )
                  }
                >
                  {isDone ? (
                    <DoneCheck size={15} />
                  ) : (
                    <Icon name={started ? "dot" : "circle"} size={15} className={started ? "text-accent" : "text-faint"} />
                  )}
                  <span className="truncate">{l.title}</span>
                  <span className="sr-only">{isDone ? "(completed)" : started ? "(started)" : ""}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
