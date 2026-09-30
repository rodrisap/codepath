/**
 * A lesson page. Every lesson follows the same structure:
 *   Goal → Concept → Worked example (with trace) → Try it → Exercises
 *   → Common mistakes → Quick check → Notes
 * Projects use a Brief instead of Concept/Example.
 * The lesson text is on the left; the workbench (editor + output) is on the right.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { loadLesson, lessonPath, neighbours, type LoadedLesson } from "../../content/registry";
import { useProgress } from "../../progress/store";
import { answerQuiz, markVisited, recordCheck, saveExerciseCode, saveTryItCode } from "../../progress/actions";
import { Markdown } from "../../components/Markdown";
import { CodeBlock } from "../../components/CodeBlock";
import { Badge, Button, Card, DoneCheck, SectionHeading } from "../../components/ui";
import { Icon } from "../../components/Icon";
import { TraceView } from "../trace/TraceView";
import { Workbench, type WorkTab, type WorkTarget } from "../workbench/Workbench";
import { ErrorCard } from "../workbench/ErrorCard";
import { ExerciseCard } from "./ExerciseCard";
import { QuizQuestion } from "./QuickCheck";
import { LessonNotes } from "./LessonNotes";
import { emptyLesson } from "../../progress/schema";

export function LessonPage() {
  const { track = "", module = "", lesson = "" } = useParams();
  const path = lessonPath(track, module, lesson);
  const [loaded, setLoaded] = useState<LoadedLesson | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoaded(null);
    setFailed(null);
    loadLesson(path)
      .then((l) => !cancelled && setLoaded(l))
      .catch((e) => !cancelled && setFailed(String(e)));
    markVisited(path);
    window.scrollTo(0, 0);
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (failed) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center">
        <p className="text-lg font-semibold">This lesson isn't available yet.</p>
        <p className="mt-2 text-muted">It's part of a later build phase.</p>
        <Link to="/" className="mt-4 inline-block text-accent underline">
          Back to the dashboard
        </Link>
      </div>
    );
  }
  if (!loaded) return <p className="p-8 text-muted">Loading lesson…</p>;
  return <LessonView key={path} loaded={loaded} path={path} />;
}

function LessonView({ loaded, path }: { loaded: LoadedLesson; path: string }) {
  const { data, sections, generated, location } = loaded;
  const progress = useProgress((p) => p.lessons[path]) ?? emptyLesson();
  const kind = location.lesson.kind ?? "lesson";
  const isProject = kind !== "lesson";
  const hasTryIt = !!(data.tryIt || data.example);
  const [activeKey, setActiveKey] = useState<string>(hasTryIt ? "try" : `ex:${data.exercises[0]?.id}`);
  const [justCompleted, setJustCompleted] = useState(false);
  const workbenchRef = useRef<HTMLDivElement>(null);
  const exerciseIds = useMemo(() => data.exercises.map((e) => e.id), [data]);
  const { prev, next } = neighbours(path);

  const tryItDefault = data.tryIt?.code ?? data.example?.code ?? "";

  const openTab = (key: string) => {
    setActiveKey(key);
    // On narrow screens the workbench is below the text: bring it into view.
    if (window.matchMedia("(max-width: 1099px)").matches) workbenchRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const tabs: WorkTab[] = [
    ...(hasTryIt ? [{ key: "try", label: "Try it" }] : []),
    ...data.exercises.map((e, i) => ({ key: `ex:${e.id}`, label: `Exercise ${i + 1}`, passed: progress.exercises[e.id]?.passed })),
  ];

  const target: WorkTarget = useMemo(() => {
    if (activeKey === "try" || !activeKey.startsWith("ex:")) {
      return {
        key: "try",
        title: "Try it: change the example and run it",
        code: progress.tryItCode ?? tryItDefault,
        starter: tryItDefault,
        onCodeChange: (c) => saveTryItCode(path, c),
        stdin: data.tryIt?.stdin ?? data.example?.stdin,
        files: data.example?.files,
      };
    }
    const id = activeKey.slice(3);
    const ex = data.exercises.find((e) => e.id === id)!;
    const n = data.exercises.indexOf(ex) + 1;
    return {
      key: activeKey,
      title: `Exercise ${n}: ${ex.title}`,
      code: progress.exercises[id]?.code ?? ex.starter,
      starter: ex.starter,
      onCodeChange: (c) => saveExerciseCode(path, id, c),
      stdin: ex.stdin,
      files: ex.files,
      tests: ex.tests,
      onChecked: (_results, allPassed) => {
        if (recordCheck(path, id, allPassed, exerciseIds)) setJustCompleted(true);
      },
    };
  }, [activeKey, progress, data, path, tryItDefault, exerciseIds]);

  return (
    <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 min-[1100px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <article className="min-w-0 space-y-9" aria-labelledby="lesson-title">
        {/* Header + Goal */}
        <header>
          <p className="text-sm text-muted">
            {location.track.title} · {location.module.title}
          </p>
          <h1 id="lesson-title" className="mt-1 flex flex-wrap items-center gap-3 text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
            {location.lesson.title}
            {isProject && <Badge tone="accent">{kind === "capstone" ? "Capstone" : "Project"}</Badge>}
            {progress.completedAt && (
              <Badge tone="success">
                <Icon name="check" size={13} /> Completed
              </Badge>
            )}
          </h1>
          <div className="mt-4 flex gap-3 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3">
            <Icon name="target" className="mt-0.5 shrink-0 text-accent" />
            <p>
              <span className="font-semibold">Goal: </span>
              <Markdown inline source={data.goal} />
            </p>
          </div>
        </header>

        {sections.brief && (
          <section aria-labelledby="brief">
            <SectionHeading icon="book" id="brief">
              The brief
            </SectionHeading>
            <Markdown source={sections.brief} />
          </section>
        )}

        {sections.concept && (
          <section aria-labelledby="concept">
            <SectionHeading icon="book" id="concept">
              Concept
            </SectionHeading>
            <Markdown source={sections.concept} />
          </section>
        )}

        {data.example && (
          <section aria-labelledby="example">
            <SectionHeading icon="trace" id="example">
              Worked example
            </SectionHeading>
            {data.example.intro && <Markdown source={data.example.intro} className="mb-3" />}
            <div className="grid gap-3">
              <CodeBlock code={data.example.code} label="The code" />
              {data.example.stdin && (
                <p className="text-sm text-muted">
                  Input typed while it runs: {data.example.stdin.map((s) => <code key={s} className="mx-0.5 rounded bg-surface-2 px-1 font-mono">{s}</code>)}
                </p>
              )}
              {generated.example && (
                <>
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted">Output</p>
                    <pre className="whitespace-pre-wrap rounded-xl border border-border bg-bg p-3 font-mono text-[0.84rem]">
                      {generated.example.output || "(nothing printed)"}
                    </pre>
                  </div>
                  {generated.example.error && <ErrorCard error={generated.example.error} />}
                  {sections["how it runs"] && <Markdown source={sections["how it runs"]} />}
                  <div>
                    <p className="mb-2 text-sm font-medium">Step by step: how every value is produced</p>
                    <TraceView code={data.example.code} steps={generated.example.trace} truncated={generated.example.truncated} />
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {hasTryIt && !isProject && (
          <section aria-labelledby="tryit">
            <SectionHeading icon="code" id="tryit">
              Try it
            </SectionHeading>
            <Markdown source={data.tryIt?.prompt ?? "Change the example and run it again. Predict the output first."} />
            <Button className="mt-3" size="sm" icon="code" onClick={() => openTab("try")}>
              Open "Try it" in the editor
            </Button>
          </section>
        )}

        {data.exercises.length > 0 && (
          <section aria-labelledby="exercises" className="space-y-4">
            <SectionHeading icon="check" id="exercises">
              {isProject ? "Build it, step by step" : "Exercises"}
            </SectionHeading>
            {data.exercises.map((ex, i) => (
              <ExerciseCard
                key={ex.id}
                lessonPath={path}
                number={i + 1}
                exercise={ex}
                progress={progress.exercises[ex.id]}
                active={activeKey === `ex:${ex.id}`}
                onOpen={() => openTab(`ex:${ex.id}`)}
                onLoadSolution={() => {
                  saveExerciseCode(path, ex.id, ex.solution.code);
                  openTab(`ex:${ex.id}`);
                }}
              />
            ))}
          </section>
        )}

        {sections["common mistakes"] && (
          <section aria-labelledby="mistakes">
            <SectionHeading icon="alert" id="mistakes">
              Common mistakes
            </SectionHeading>
            <Markdown source={sections["common mistakes"]} />
          </section>
        )}

        {data.quiz.length > 0 && (
          <section aria-labelledby="quiz" className="space-y-4">
            <SectionHeading icon="review" id="quiz">
              Quick check
            </SectionHeading>
            <p className="-mt-1 text-sm text-muted">These come back later on the Review page (after 1, 3, 7 and 21 days).</p>
            {data.quiz.map((q, i) => (
              <QuizQuestion
                key={q.id}
                item={q}
                number={i + 1}
                initialAnswer={progress.quiz[q.id] ? (progress.quiz[q.id].correct ? q.answer : -1) : null}
                onAnswer={(correct) => answerQuiz(path, q.id, correct)}
              />
            ))}
          </section>
        )}

        <LessonNotes path={path} initial={progress.notes ?? ""} />

        {(justCompleted || progress.completedAt) && (
          <Card className="flex items-center gap-3 border-success/40 p-4">
            <DoneCheck animate={justCompleted} size={32} />
            <div>
              <p className="font-semibold">Lesson complete.</p>
              <p className="text-sm text-muted">{next ? `Next up: ${next.lesson.title}.` : "That's the last lesson available for now."}</p>
            </div>
          </Card>
        )}

        <nav className="flex justify-between gap-3 border-t border-border pt-5" aria-label="Lesson navigation">
          {prev ? (
            <Link to={`/learn/${prev.path}`} className="flex items-center gap-1 text-sm text-muted hover:text-fg">
              <Icon name="chevronLeft" size={16} /> {prev.lesson.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/learn/${next.path}`} className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-strong">
              {next.lesson.title} <Icon name="chevronRight" size={16} />
            </Link>
          )}
        </nav>
      </article>

      <div ref={workbenchRef} className="min-w-0 min-[1100px]:sticky min-[1100px]:top-[4.5rem] min-[1100px]:max-h-[calc(100vh-5.5rem)] min-[1100px]:self-start min-[1100px]:overflow-y-auto">
        <Workbench tabs={tabs} activeKey={target.key} onSelectTab={setActiveKey} target={target} />
      </div>
    </div>
  );
}
