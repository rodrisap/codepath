/**
 * Markdown → HTML for lesson text. Lesson content is written by us (trusted),
 * so the HTML can be inserted directly. Code blocks get syntax highlighting.
 */
import { Marked } from "marked";
import { highlightToHtml, type CodeLang } from "./highlight";

const marked = new Marked({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      const language = (["python", "sql", "java"].includes(lang ?? "") ? lang : "text") as CodeLang;
      return `<pre><code class="language-${language}">${highlightToHtml(text, language)}</code></pre>`;
    },
  },
});

export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false });
}

/** For one-line text such as hints: no surrounding <p>. */
export function renderInline(source: string): string {
  return marked.parseInline(source, { async: false });
}
