/**
 * Finds lessons on disk (with Vite's import.meta.glob) and loads them on demand,
 * so opening one lesson doesn't download the whole curriculum.
 */
import { pythonTrack } from "../../content/python/track";
import { sqlTrack } from "../../content/sql/track";
import { javaTrack } from "../../content/java/track";
import type { GeneratedLesson, LessonData, LessonRef, ModuleOutline, TrackOutline } from "./types";
import { splitSections } from "./markdownSections";

export const tracks: TrackOutline[] = [pythonTrack, sqlTrack, javaTrack];

const lessonFiles = import.meta.glob<{ default: LessonData }>("../../content/*/*/*/lesson.ts");
const markdownFiles = import.meta.glob<string>("../../content/*/*/*/lesson.md", { query: "?raw", import: "default" });
const generatedFiles = import.meta.glob<GeneratedLesson>("../../content/*/*/*/generated.json", { import: "default" });

const fileKey = (path: string, name: string) => `../../content/${path}/${name}`;

/** "python/loops/for-range" */
export type LessonPath = string;

export function lessonPath(track: string, module: string, lesson: string): LessonPath {
  return `${track}/${module}/${lesson}`;
}

export function isLessonAvailable(path: LessonPath): boolean {
  return fileKey(path, "lesson.ts") in lessonFiles;
}

export interface LessonLocation {
  track: TrackOutline;
  module: ModuleOutline;
  lesson: LessonRef;
  path: LessonPath;
  index: number; // position in the whole track
}

/** Every lesson of a track in order, with where it lives. */
export function flattenTrack(track: TrackOutline): LessonLocation[] {
  const out: LessonLocation[] = [];
  for (const module of track.modules) {
    for (const lesson of module.lessons) {
      out.push({ track, module, lesson, path: lessonPath(track.id, module.id, lesson.id), index: out.length });
    }
  }
  return out;
}

export const allLessons: LessonLocation[] = tracks.flatMap(flattenTrack);

export function findLesson(path: LessonPath): LessonLocation | undefined {
  return allLessons.find((l) => l.path === path);
}

export function neighbours(path: LessonPath): { prev?: LessonLocation; next?: LessonLocation } {
  const loc = findLesson(path);
  if (!loc) return {};
  const inTrack = allLessons.filter((l) => l.track.id === loc.track.id && isLessonAvailable(l.path));
  const i = inTrack.findIndex((l) => l.path === path);
  return { prev: inTrack[i - 1], next: inTrack[i + 1] };
}

export interface LoadedLesson {
  location: LessonLocation;
  data: LessonData;
  sections: Record<string, string>;
  generated: GeneratedLesson;
}

export async function loadLesson(path: LessonPath): Promise<LoadedLesson> {
  const location = findLesson(path);
  const loadData = lessonFiles[fileKey(path, "lesson.ts")];
  if (!location || !loadData) throw new Error(`Lesson not found: ${path}`);
  const loadMd = markdownFiles[fileKey(path, "lesson.md")];
  const loadGenerated = generatedFiles[fileKey(path, "generated.json")];
  const [data, markdown, generated] = await Promise.all([
    loadData().then((m) => m.default),
    loadMd ? loadMd() : Promise.resolve(""),
    loadGenerated ? loadGenerated() : Promise.resolve({} as GeneratedLesson),
  ]);
  return { location, data, sections: splitSections(markdown), generated };
}

/** Load only the quiz questions of a lesson (used by the Review page). */
export async function loadLessonData(path: LessonPath): Promise<LessonData | null> {
  const load = lessonFiles[fileKey(path, "lesson.ts")];
  return load ? (await load()).default : null;
}
