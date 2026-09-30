/** Free coding, outside of lessons. Your code is saved automatically. */
import { updateProgress, useProgress } from "../../progress/store";
import { Workbench } from "../workbench/Workbench";

const STARTER = '# Free coding space: anything goes.\nprint("Hello from the playground!")\n';

export function PlaygroundPage() {
  const code = useProgress((p) => p.playground.python);
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Playground</h1>
        <p className="mt-1 text-muted">Experiment freely. Use Trace to watch any code run step by step. (SQL joins the playground in the SQL phase.)</p>
      </div>
      <Workbench
        tabs={[{ key: "python", label: "Python" }]}
        activeKey="python"
        onSelectTab={() => {}}
        target={{
          key: "python",
          title: "Python playground",
          code,
          starter: STARTER,
          onCodeChange: (c) => updateProgress((d) => void (d.playground.python = c)),
        }}
      />
    </div>
  );
}
