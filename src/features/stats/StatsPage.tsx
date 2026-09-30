import { Card } from "../../components/ui";

/** Placeholder: the full stats page arrives in Phase 2. */
export function StatsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Stats</h1>
      <Card className="mt-4 p-5 text-muted">Detailed stats (activity per day, first-try rate, hints used) arrive in the next update. Your activity is already being recorded.</Card>
    </div>
  );
}
