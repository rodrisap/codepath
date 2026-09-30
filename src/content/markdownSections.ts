/**
 * Splits a lesson.md file into its "## Heading" sections, e.g.
 * { concept: "...", "common mistakes": "..." }. Keys are lower-case headings.
 */
export function splitSections(markdown: string): Record<string, string> {
  const sections: Record<string, string> = {};
  let current: string | null = null;
  let buffer: string[] = [];
  const flush = () => {
    if (current) sections[current] = buffer.join("\n").trim();
    buffer = [];
  };
  for (const line of markdown.split("\n")) {
    const heading = /^## (.+?)\s*$/.exec(line);
    if (heading) {
      flush();
      current = heading[1].toLowerCase();
    } else {
      buffer.push(line);
    }
  }
  flush();
  return sections;
}

/** Sections every lesson.md must have, by lesson kind (checked by `npm run verify`). */
export const REQUIRED_SECTIONS = {
  lesson: ["concept", "common mistakes"],
  project: ["brief"],
  capstone: ["brief"],
} as const;
