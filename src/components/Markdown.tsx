import { useMemo } from "react";
import { renderInline, renderMarkdown } from "../lib/markdown";
import { cx } from "../lib/cx";

/** Renders trusted lesson Markdown. */
export function Markdown({ source, inline = false, className }: { source: string; inline?: boolean; className?: string }) {
  const html = useMemo(() => (inline ? renderInline(source) : renderMarkdown(source)), [source, inline]);
  if (inline) return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  return <div className={cx("prose-cp", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
