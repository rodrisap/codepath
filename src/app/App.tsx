import { useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router";
import { useProgress } from "../progress/store";
import { getPythonRunner } from "../runners/python/PythonRunner";
import { AppShell } from "../features/shell/AppShell";
import { HomePage } from "../features/home/HomePage";
import { LessonPage } from "../features/lesson/LessonPage";
import { ReviewPage } from "../features/review/ReviewPage";
import { PlaygroundPage } from "../features/playground/PlaygroundPage";
import { StatsPage } from "../features/stats/StatsPage";
import { CheatSheetPage } from "../features/cheatsheet/CheatSheetPage";
import { SettingsPage } from "../features/settings/SettingsPage";

/** Applies settings that live outside React (theme, font size, time limit). */
function useApplySettings() {
  const { theme, fontSize, timeoutSec } = useProgress((p) => p.settings);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "warm" ? "#13100d" : "#0f1117");
  }, [theme]);
  useEffect(() => {
    document.documentElement.style.setProperty("--cp-font-size", `${fontSize}px`);
  }, [fontSize]);
  useEffect(() => {
    getPythonRunner().timeoutMs = timeoutSec * 1000;
  }, [timeoutSec]);
}

export function App() {
  useApplySettings();
  return (
    // HashRouter (#/learn/...) works on any static host without server rules.
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn/:track/:module/:lesson" element={<LessonPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/cheatsheet/:track" element={<CheatSheetPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<p className="p-8 text-muted">Page not found.</p>} />
        </Routes>
      </AppShell>
    </HashRouter>
  );
}
