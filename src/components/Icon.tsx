/**
 * A small set of line icons (inline SVG, no icon library needed).
 * Icons are decorative by default (aria-hidden); pair them with visible text
 * or pass `label` so screen readers get a name.
 */
const paths: Record<string, string> = {
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
  play: "M8 5.5v13l10.5-6.5z",
  stop: "M7 7h10v10H7z",
  trace: "M4 6h10M4 12h7M4 18h10M17 9l3 3-3 3",
  reset: "M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5",
  hint: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  chevronRight: "M9 5l7 7-7 7",
  chevronDown: "M5 9l7 7 7-7",
  chevronLeft: "M15 5l-7 7 7 7",
  flame: "M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.3 2.3-5.4 3.6-7.6.4 1.7 1.3 2.8 2.4 3.4C11.8 7.3 13 4.9 15 3c.2 3 1.7 4.7 2.8 6.4.8 1.3 1.2 2.7 1.2 4.4C19 18.2 16 21 12 21z",
  book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15zM4 20.5A2.5 2.5 0 0 0 6.5 23H20",
  code: "M8 7l-5 5 5 5M16 7l5 5-5 5",
  review: "M20 11a8 8 0 0 0-14.3-4.9M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9M20 20v-4h-4",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7.6 7.6 0 0 1-2.1 1.2L14.7 21h-4l-.3-2.4a7.6 7.6 0 0 1-2.1-1.2l-1.9.7-2-3.4 1.6-1.2a7.7 7.7 0 0 1 0-2.9L4.4 9.4l2-3.4 1.9.7a7.6 7.6 0 0 1 2.1-1.2L10.7 3h4l.3 2.5a7.6 7.6 0 0 1 2.1 1.2l1.9-.7 2 3.4-1.6 1.2a7.7 7.7 0 0 1 0 2.9z",
  menu: "M4 7h16M4 12h16M4 17h16",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  upload: "M12 20V9M7 14l5-5 5 5M5 4h14",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  notes: "M5 4h14v16H5zM8 9h8M8 13h8M8 17h5",
  sheet: "M4 4h16v16H4zM4 10h16M10 10v10",
  terminal: "M4 5h16v14H4zM7 9l3 3-3 3M12 15h5",
  circle: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  dot: "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  sun: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  moon: "M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z",
  alert: "M12 3l9.5 17h-19zM12 10v4M12 17.5v.5",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5v.5",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01",
  home: "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
  keyboard: "M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 18, className, label }: { name: IconName; size?: number; className?: string; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
    >
      <path d={paths[name]} fill={name === "play" || name === "stop" ? "currentColor" : "none"} />
    </svg>
  );
}
