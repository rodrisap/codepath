/**
 * Static syntax highlighting for code shown in lessons. It uses the same
 * parsers and the same `tok-*` CSS classes as the editor, so colors match.
 */
import { classHighlighter, highlightCode } from "@lezer/highlight";
import { pythonLanguage } from "@codemirror/lang-python";
import { SQLite } from "@codemirror/lang-sql";

export type CodeLang = "python" | "sql" | "java" | "text";

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Returns one HTML string per line (so callers can number or highlight lines). */
export function highlightLines(code: string, lang: CodeLang): string[] {
  const parser =
    lang === "python" ? pythonLanguage.parser : lang === "sql" ? SQLite.language.parser : null;
  if (!parser) return code.split("\n").map(escapeHtml);
  const lines: string[] = [""];
  highlightCode(
    code,
    parser.parse(code),
    classHighlighter,
    (text, classes) => {
      const html = escapeHtml(text);
      lines[lines.length - 1] += classes ? `<span class="${classes}">${html}</span>` : html;
    },
    () => lines.push(""),
  );
  return lines;
}

export function highlightToHtml(code: string, lang: CodeLang): string {
  return highlightLines(code, lang).join("\n");
}
