/**
 * The code editor, built on CodeMirror 6: syntax highlighting, line numbers,
 * auto-indent, bracket matching and undo history.
 *
 * Keyboard: Ctrl/Cmd+Enter runs, Ctrl/Cmd+S saves. Tab indents; press Esc
 * first if you want Tab to move focus out of the editor.
 */
import { useEffect, useRef } from "react";
import { EditorState, StateEffect, StateField, type Extension } from "@codemirror/state";
import {
  Decoration,
  EditorView,
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  placeholder as placeholderExt,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { classHighlighter } from "@lezer/highlight";
import { python } from "@codemirror/lang-python";
import { sql, SQLite } from "@codemirror/lang-sql";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";

/** Colors come from the CSS variables, so the editor follows the theme. */
const theme = EditorView.theme(
  {
    "&": {
      color: "var(--cp-fg)",
      backgroundColor: "var(--cp-surface)",
      fontSize: "0.9rem",
      height: "100%",
    },
    ".cm-scroller": { fontFamily: "var(--font-mono)", lineHeight: "1.65" },
    ".cm-content": { caretColor: "var(--cp-accent)", padding: "12px 0" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--cp-accent)", borderLeftWidth: "2px" },
    "&.cm-focused": { outline: "none" },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {
      backgroundColor: "var(--cp-selection) !important",
    },
    ".cm-gutters": {
      backgroundColor: "var(--cp-surface)",
      color: "var(--cp-faint)",
      border: "none",
      paddingLeft: "6px",
    },
    ".cm-activeLine": { backgroundColor: "var(--cp-line-highlight)" },
    ".cm-activeLineGutter": { backgroundColor: "transparent", color: "var(--cp-muted)" },
    ".cm-matchingBracket": { backgroundColor: "var(--cp-surface-3)", outline: "1px solid var(--cp-border)" },
    ".cm-placeholder": { color: "var(--cp-faint)" },
    ".cm-errorLine": { backgroundColor: "var(--cp-error-soft)", boxShadow: "inset 3px 0 0 var(--cp-error)" },
  },
  { dark: true },
);

// --- Highlighting the line an error points to ---------------------------------
const setErrorLine = StateEffect.define<number | null>();
const errorLineField = StateField.define({
  create: () => Decoration.none,
  update(deco, tr) {
    deco = deco.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(setErrorLine)) {
        const n = e.value;
        if (n && n >= 1 && n <= tr.state.doc.lines) {
          const line = tr.state.doc.line(n);
          deco = Decoration.set([Decoration.line({ class: "cm-errorLine" }).range(line.from)]);
        } else {
          deco = Decoration.none;
        }
      }
    }
    // Typing clears the marker: the error is about the old code.
    if (tr.docChanged) deco = Decoration.none;
    return deco;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "python" | "sql";
  onRun?: () => void;
  onSave?: () => void;
  errorLine?: number | null;
  ariaLabel: string;
  placeholder?: string;
  minHeight?: string;
}

export function CodeEditor({ value, onChange, language, onRun, onSave, errorLine, ariaLabel, placeholder, minHeight = "14rem" }: CodeEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  // Keep the latest callbacks in refs so the editor doesn't need rebuilding when they change.
  const callbacks = useRef({ onChange, onRun, onSave });
  callbacks.current = { onChange, onRun, onSave };

  useEffect(() => {
    const extensions: Extension[] = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      indentOnInput(),
      indentUnit.of("    "),
      EditorState.tabSize.of(4),
      bracketMatching(),
      closeBrackets(),
      highlightActiveLine(),
      syntaxHighlighting(classHighlighter),
      language === "python" ? python() : sql({ dialect: SQLite, upperCaseKeywords: true }),
      keymap.of([
        { key: "Mod-Enter", run: () => (callbacks.current.onRun?.(), true), preventDefault: true },
        { key: "Mod-s", run: () => (callbacks.current.onSave?.(), true), preventDefault: true },
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        indentWithTab,
      ]),
      theme,
      errorLineField,
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
      EditorView.updateListener.of((u) => {
        if (u.docChanged) callbacks.current.onChange(u.state.doc.toString());
      }),
    ];
    if (placeholder) extensions.push(placeholderExt(placeholder));
    const v = new EditorView({ state: EditorState.create({ doc: value, extensions }), parent: host.current! });
    view.current = v;
    return () => v.destroy();
    // The editor is created once per language; value changes are synced below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, ariaLabel]);

  // Replace the content when `value` changes from outside (reset, switching exercise).
  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
    }
  }, [value]);

  useEffect(() => {
    view.current?.dispatch({ effects: setErrorLine.of(errorLine ?? null) });
  }, [errorLine]);

  return <div ref={host} className="h-full overflow-auto" style={{ minHeight }} />;
}
