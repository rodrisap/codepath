/** Shows an error: the raw Python message first, then what it means and where to look. */
import type { RunError } from "../../runners/types";
import { translatePythonError } from "../../errors/pythonErrors";
import { Icon } from "../../components/Icon";
import { Markdown } from "../../components/Markdown";

export function ErrorCard({ error, translate = translatePythonError }: { error: RunError; translate?: typeof translatePythonError }) {
  const t = translate(error);
  const isLimit = error.type === "Timeout" || error.type === "Stopped";
  return (
    <div className="rounded-xl border border-error/40 bg-error-soft p-3.5 text-sm" role="alert">
      <div className="flex items-center gap-2 font-semibold text-error">
        <Icon name="alert" size={17} />
        <span>
          {isLimit ? t.title : <>Error{error.line ? ` on line ${error.line}` : ""}: <Markdown inline source={t.title} /></>}
        </span>
      </div>
      {!isLimit && (
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-bg/70 p-2.5 font-mono text-[0.8rem] text-fg">
          {error.traceback || `${error.type}: ${error.message}`}
        </pre>
      )}
      <div className="mt-2.5 space-y-1.5">
        <p>
          <span className="font-semibold">What it means: </span>
          <Markdown inline source={t.explanation} />
        </p>
        {t.lookAt && (
          <p>
            <span className="font-semibold">Where to look: </span>
            <Markdown inline source={t.lookAt} />
          </p>
        )}
      </div>
    </div>
  );
}
