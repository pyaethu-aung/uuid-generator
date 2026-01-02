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
        className="flex items-center justify-between text-sm font-medium text-slate-200"
      >
        <span>Batch size</span>
        <span className="text-base font-semibold text-white">{value}</span>
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
        className="w-full accent-teal-400"
      />
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
        Showing {visibleBatchSize} · downloading up to {Math.min(value, 200)}
      </p>
    </div>
  );
}

function VersionSelector({ selectedVersion, onVersionChange }) {
  return (
    <div className="mt-8 space-y-3">
      <p className="text-xs uppercase tracking-[0.3em] text-teal-200">
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
              className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                isActive
                  ? "border-teal-300 bg-white/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-inherit">
                  {choice.title}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                    isActive
                      ? "bg-teal-300/20 text-teal-100"
                      : "bg-white/10 text-slate-200"
                  }`}
                >
                  {choice.badge}
                </span>
              </div>
              <p className="mt-2 text-sm text-inherit opacity-80">
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
          className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <div>
            <p className="text-base font-semibold text-white">{option.title}</p>
            <p className="text-sm text-slate-300">{option.detail}</p>
          </div>
          <input
            type="checkbox"
            checked={options[option.key]}
            onChange={() => onToggleOption(option.key)}
            className="h-5 w-5 accent-teal-400"
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
    <aside className="rounded-4xl border border-white/10 bg-slate-950/60 p-6 shadow-[0_10px_60px_rgba(5,5,15,0.55)] backdrop-blur">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-teal-100">
          Batch controls
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Fine-tune your output
        </h2>
        <p className="text-sm text-slate-300">
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
        className="mt-10 w-full rounded-2xl bg-linear-to-r from-teal-400 via-emerald-400 to-cyan-400 px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-teal-500/30 transition hover:opacity-95"
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
