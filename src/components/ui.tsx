/** Small shared building blocks: buttons, badges, progress bars, cards. */
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "success";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-strong font-semibold",
  secondary: "bg-surface-2 text-fg border border-border hover:bg-surface-3",
  ghost: "text-muted hover:text-fg hover:bg-surface-2",
  success: "bg-success text-on-accent font-semibold hover:brightness-110",
};

export function Button({
  variant = "secondary",
  icon,
  size = "md",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; icon?: IconName; size?: "sm" | "md" }) {
  return (
    <button
      type="button"
      className={cx(
        "inline-flex items-center justify-center gap-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" ? "px-2.5 py-1 text-sm" : "px-3.5 py-1.5 text-[0.95rem]",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 15 : 17} />}
      {children}
    </button>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.72rem] text-muted">
      {children}
    </kbd>
  );
}

/** Ctrl or ⌘ depending on the platform. */
export const modKey =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl";

export function ProgressBar({ value, max, label, className }: { value: number; max: number; label: string; className?: string }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className={className}>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} of ${max} (${pct}%)`}
      >
        <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "accent" | "success" | "warning" | "error"; children: ReactNode }) {
  const tones = {
    neutral: "bg-surface-2 text-muted border-border",
    accent: "bg-accent-soft text-accent border-transparent",
    success: "bg-success-soft text-success border-transparent",
    warning: "bg-warning-soft text-warning border-transparent",
    error: "bg-error-soft text-error border-transparent",
  };
  return <span className={cx("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium", tones[tone])}>{children}</span>;
}

export function Card({ className, children, ...rest }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("rounded-xl border border-border bg-surface", className)} {...rest}>
      {children}
    </div>
  );
}

/** The animated check used for completed items. Status is also given as text. */
export function DoneCheck({ animate = false, size = 18 }: { animate?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={cx("shrink-0 text-success", animate && "cp-check-anim")} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.18" />
      <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SectionHeading({ icon, children, id }: { icon: IconName; children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mb-3 flex items-center gap-2 text-lg font-semibold tracking-tight scroll-mt-20">
      <span className="grid size-7 place-items-center rounded-lg bg-accent-soft text-accent">
        <Icon name={icon} size={16} />
      </span>
      {children}
    </h2>
  );
}
