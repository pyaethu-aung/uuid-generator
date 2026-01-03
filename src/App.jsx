import { useMemo } from "react";
import ControlPanel from "./components/ControlPanel";
import Hero from "./components/Hero";
import InsightCards from "./components/InsightCards";
import ThemeToggle from "./components/ThemeToggle";
import UuidList from "./components/UuidList";
import useTheme from "./hooks/useTheme";
import useUuidGenerator from "./hooks/useUuidGenerator";
import "./App.css";

function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    batchSize,
    setBatchSize,
    visibleBatchSize,
    selectedVersion,
    options,
    formattedUuids,
    copiedUuid,
    feedback,
    clipboardSupported,
    regenerate,
    handleCopy,
    handleVersionChange,
    toggleOption,
    downloadList,
    commitBatchSize,
  } = useUuidGenerator();

  const insights = useMemo(
    () => [
      { label: "Version", value: selectedVersion.toUpperCase() },
      { label: "Batch size", value: formattedUuids.length },
      { label: "Characters", value: formattedUuids[0]?.length ?? 0 },
    ],
    [selectedVersion, formattedUuids]
  );

  return (
    <div className="app-shell relative isolate overflow-hidden">
      <div className="gradient-blob gradient-blob-one" aria-hidden="true" />
      <div className="gradient-blob gradient-blob-two" aria-hidden="true" />
      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 lg:py-24">
        <div className="flex justify-end">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <Hero feedback={feedback} />

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[32px] border theme-border-subtle theme-card theme-shadow-card p-6 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] theme-text-accent">
                  Latest batch
                </p>
                <h2 className="text-2xl font-semibold theme-text-primary">
                  {formattedUuids.length} UUID
                  {formattedUuids.length === 1 ? "" : "s"}
                </h2>
              </div>
              <button
                type="button"
                onClick={downloadList}
                className="theme-ghost-button inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v12m0 0 4-4m-4 4-4-4M4 18h16"
                  />
                </svg>
                Download .txt
              </button>
            </div>

            <InsightCards insights={insights} />

            <UuidList
              uuids={formattedUuids}
              copiedUuid={copiedUuid}
              onCopy={handleCopy}
            />
          </article>

          <ControlPanel
            batchSize={batchSize}
            visibleBatchSize={visibleBatchSize}
            selectedVersion={selectedVersion}
            options={options}
            onBatchChange={setBatchSize}
            onBatchCommit={commitBatchSize}
            onVersionChange={handleVersionChange}
            onToggleOption={toggleOption}
            onGenerate={regenerate}
            clipboardSupported={clipboardSupported}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
