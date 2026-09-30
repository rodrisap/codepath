import { useRef, useState } from "react";
import { replaceProgress, updateProgress, useProgress } from "../../progress/store";
import { exportProgress, importProgress } from "../../progress/exportImport";
import { emptyProgress, type Settings } from "../../progress/schema";
import { canShareMemory } from "../../runners/python/PythonRunner";
import { Button, Card } from "../../components/ui";
import { cx } from "../../lib/cx";

function Choice<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string; hint?: string }[]; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="font-medium">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={String(o.value)} className={cx("cursor-pointer rounded-lg border px-3 py-2 text-sm", o.value === value ? "border-accent bg-accent-soft" : "border-border hover:bg-surface-2")}>
            <input type="radio" className="sr-only" checked={o.value === value} onChange={() => onChange(o.value)} />
            <span className="font-medium">{o.label}</span>
            {o.hint && <span className="block text-xs text-muted">{o.hint}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function SettingsPage() {
  const settings = useProgress((p) => p.settings);
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => updateProgress((d) => void (d.settings[key] = value));

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <Card className="space-y-6 p-5">
        <Choice
          label="Theme"
          value={settings.theme}
          onChange={(v) => set("theme", v)}
          options={[
            { value: "dark", label: "Dark", hint: "Calm blue accent" },
            { value: "warm", label: "Night warm", hint: "Dimmer, warmer, less blue light" },
          ]}
        />
        <Choice
          label="Text size"
          value={settings.fontSize}
          onChange={(v) => set("fontSize", v)}
          options={[
            { value: 16, label: "16 px" },
            { value: 17, label: "17 px" },
            { value: 18, label: "18 px" },
          ]}
        />
        <Choice
          label="Time limit per run"
          value={settings.timeoutSec}
          onChange={(v) => set("timeoutSec", v)}
          options={[
            { value: 3, label: "3 s" },
            { value: 5, label: "5 s", hint: "default" },
            { value: 10, label: "10 s" },
            { value: 30, label: "30 s", hint: "for pandas" },
          ]}
        />
      </Card>

      <Card className="space-y-3 p-5">
        <h2 className="font-medium">Your progress</h2>
        <p className="text-sm text-muted">
          Progress is stored in this browser only. Export it now and then as a backup, or to move to another computer.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button icon="download" onClick={exportProgress}>
            Export progress (.json)
          </Button>
          <Button icon="upload" onClick={() => fileInput.current?.click()}>
            Import progress
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label="Choose a progress file to import"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              if (!confirm("Importing replaces your current progress with the file's contents. Continue?")) return;
              try {
                await importProgress(file);
                setMessage("Progress imported.");
              } catch (err) {
                setMessage(`Import failed: ${(err as Error).message}`);
              }
            }}
          />
          <Button
            variant="ghost"
            onClick={() => {
              if (confirm("Delete ALL progress, notes and settings? Export first if you want a backup.")) {
                replaceProgress(emptyProgress());
                setMessage("Progress reset.");
              }
            }}
          >
            Reset everything
          </Button>
        </div>
        {message && (
          <p className="text-sm" role="status">
            {message}
          </p>
        )}
      </Card>

      <Card className="p-5 text-sm text-muted">
        <h2 className="font-medium text-fg">About this browser</h2>
        <p className="mt-1">
          {canShareMemory
            ? "Interactive input() and the Stop button are fully supported."
            : "This page isn't cross-origin isolated, so input() reads from the Input box and Stop restarts Python. Reloading the page once usually fixes this on GitHub Pages."}
        </p>
      </Card>
    </div>
  );
}
