/**
 * The progress store: one in-memory object, saved to IndexedDB shortly after
 * every change. React components read it with `useProgress(selector)` and
 * change it with `updateProgress(draft => { ... })`.
 */
import { useSyncExternalStore } from "react";
import { get, set } from "idb-keyval";
import { emptyProgress, migrate, type DayActivity, type ProgressData } from "./schema";
import { toDay } from "./dates";

const KEY = "codepath-progress";
const BACKUP_KEY = "codepath-progress-backup"; // localStorage copy, just in case

let state: ProgressData = emptyProgress();
let loaded = false;
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | undefined;
const savedListeners = new Set<(at: Date) => void>();

export async function loadProgress(): Promise<void> {
  try {
    const stored = (await get(KEY)) ?? readBackup();
    if (stored) state = migrate(stored);
  } catch (err) {
    console.error("Could not load progress", err);
  }
  loaded = true;
  emit();
}

function readBackup(): unknown {
  try {
    const text = localStorage.getItem(BACKUP_KEY);
    return text ? JSON.parse(text) : undefined;
  } catch {
    return undefined;
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function scheduleSave(delay = 400) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, delay);
}

/** Save immediately (Ctrl/Cmd+S calls this). */
export async function saveNow(): Promise<void> {
  clearTimeout(saveTimer);
  try {
    await set(KEY, state);
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked: IndexedDB copy is enough */
    }
    const at = new Date();
    savedListeners.forEach((l) => l(at));
  } catch (err) {
    console.error("Could not save progress", err);
  }
}

export function onSaved(listener: (at: Date) => void): () => void {
  savedListeners.add(listener);
  return () => savedListeners.delete(listener);
}

export function getProgress(): ProgressData {
  return state;
}

/**
 * Change progress. The recipe receives a copy it may modify freely;
 * components then re-render with the new state.
 */
export function updateProgress(recipe: (draft: ProgressData) => void): void {
  const draft = structuredClone(state);
  recipe(draft);
  state = draft;
  emit();
  scheduleSave();
}

export function replaceProgress(next: ProgressData): void {
  state = next;
  emit();
  void saveNow();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProgress<T>(selector: (p: ProgressData) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state));
}

export function isLoaded() {
  return loaded;
}

/** Count something towards today's activity (used by the streak and stats). */
export function bumpActivity(draft: ProgressData, field: keyof DayActivity, by = 1) {
  const today = toDay();
  const day = (draft.activity[today] ??= { exercises: 0, reviews: 0, lessons: 0 });
  day[field] += by;
}

// Save before the tab closes.
if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => void saveNow());
}
