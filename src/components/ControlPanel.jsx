import { optionDescriptors, versionChoices } from "../utils/uuid";

function BatchSlider({ value, onChange, onCommit, visibleBatchSize }) {
  const commitKeys = [
    "Enter",
    " ",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
  ];

  return (
    <div className="mt-8 space-y-3">
      <label
        htmlFor="batch-size"
        className="flex items-center justify-between text-sm font-medium theme-text-secondary"
      >
        <span>Batch size</span>
        <span className="text-base font-semibold theme-text-primary">
          {value}
        </span>
      </label>
      <input
        id="batch-size"
        type="range"
        min={1}
        max={200}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onPointerUp={onCommit}
        onTouchEnd={onCommit}
        onMouseUp={onCommit}
        onKeyUp={(event) => {
          if (commitKeys.includes(event.key)) {
            onCommit();
          }
        }}
        className="w-full"
        style={{ accentColor: "var(--accent-primary)" }}
      />
      <p className="text-xs uppercase tracking-[0.3em] theme-text-muted">
        Showing {visibleBatchSize} · downloading up to {Math.min(value, 200)}
      </p>
    </div>
  );
}

function VersionSelector({ selectedVersion, onVersionChange }) {
  return (
    <div className="mt-8 space-y-3">
      <p className="text-xs uppercase tracking-[0.3em] theme-text-accent">
        UUID version
      </p>
      <div className="flex flex-col gap-3">
        {versionChoices.map((choice) => {
          const isActive = choice.id === selectedVersion;
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => onVersionChange(choice.id)}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition theme-option ${isActive ? "theme-option--active" : ""
                }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold theme-text-primary">
                  {choice.title}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] theme-badge ${isActive ? "theme-badge--active" : ""
                    }`}
                >
                  {choice.badge}
                </span>
              </div>
              <p className="mt-2 text-sm theme-text-secondary">
                {choice.detail}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OptionToggles({ options, onToggleOption }) {
  return (
    <div className="mt-8 space-y-3">
      {optionDescriptors.map((option) => (
        <label
          key={option.key}
          className="flex items-center justify-between gap-4 rounded-2xl border theme-border-subtle theme-glass px-4 py-3"
        >
          <div>
            <p className="text-base font-semibold theme-text-primary">
              {option.title}
            </p>
            <p className="text-sm theme-text-secondary">{option.detail}</p>
          </div>
          <input
            type="checkbox"
            checked={options[option.key]}
            onChange={() => onToggleOption(option.key)}
            className="h-5 w-5"
            style={{ accentColor: "var(--accent-primary)" }}
          />
        </label>
      ))}
    </div>
  );
}

function ControlPanel({
  batchSize,
  visibleBatchSize,
  selectedVersion,
  options,
  onBatchChange,
  onBatchCommit,
  onVersionChange,
  onToggleOption,
  onGenerate,
  clipboardSupported,
}) {
  return (
    <aside className="rounded-[32px] border theme-border-subtle theme-panel theme-shadow-panel p-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] theme-text-accent">
          Batch controls
        </p>
        <h2 className="text-2xl font-semibold theme-text-primary">
          Fine-tune your output
        </h2>
        <p className="text-sm theme-text-secondary">
          Choose how many UUIDs to mint and the format you want before pressing
          generate.
        </p>
      </div>

      <BatchSlider
        value={batchSize}
        onChange={onBatchChange}
        onCommit={onBatchCommit}
        visibleBatchSize={visibleBatchSize}
      />

      <VersionSelector
        selectedVersion={selectedVersion}
        onVersionChange={onVersionChange}
      />

      <OptionToggles options={options} onToggleOption={onToggleOption} />

      <button
        type="button"
        onClick={onGenerate}
        className="theme-cta mt-10 w-full rounded-2xl px-6 py-4 text-base font-semibold shadow-lg transition hover:scale-105 hover:bg-[var(--btn-hover)]"
      >
        Generate {visibleBatchSize > 1 ? `${visibleBatchSize} UUIDs` : "a UUID"}
      </button>

      {!clipboardSupported && (
        <p className="mt-4 text-xs text-amber-200">
          Clipboard API is disabled, so copying will fall back to manual
          selection.
        </p>
      )}
    </aside>
  );
}

export default ControlPanel;
