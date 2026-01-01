import { useEffect, useMemo, useRef, useState } from "react";
import { v1 as uuidV1, v4 as uuidV4, v7 as uuidV7 } from "uuid";
import "./App.css";

const defaultOptions = {
  uppercase: false,
  trimHyphens: false,
  wrapBraces: false,
};

const createUuid = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  // RFC 4122 compliant fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === "x" ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
};

const uuidGenerators = {
  v1: () => (typeof uuidV1 === "function" ? uuidV1() : createUuid()),
  v4: () => (typeof uuidV4 === "function" ? uuidV4() : createUuid()),
  v7: () => {
    if (typeof uuidV7 === "function") {
      return uuidV7();
    }

    return typeof uuidV4 === "function" ? uuidV4() : createUuid();
  },
};

const buildBatch = (count, generator = uuidGenerators.v4) =>
  Array.from({ length: count }, () => generator());

const versionChoices = [
  {
    id: "v4",
    title: "Version 4",
    badge: "Random",
    detail: "Pure randomness via Web Crypto for most workflows.",
  },
  {
    id: "v1",
    title: "Version 1",
    badge: "Time-ordered",
    detail: "Timestamp-first IDs that stay sortable for logs and tracing.",
  },
  {
    id: "v7",
    title: "Version 7",
    badge: "Unix time",
    detail:
      "Modern hybrid using time bits plus randomness for distributed systems.",
  },
];

const formatUuid = (value, options) => {
  let next = value;

  if (options.trimHyphens) {
    next = next.replace(/-/g, "");
  }

  if (options.uppercase) {
    next = next.toUpperCase();
  }

  if (options.wrapBraces) {
    next = `{${next}}`;
  }

  return next;
};

function App() {
  const [batchSize, setBatchSize] = useState(1);
  const [selectedVersion, setSelectedVersion] = useState("v4");
  const [options, setOptions] = useState(defaultOptions);
  const [rawUuids, setRawUuids] = useState(() => buildBatch(1));
  const [copiedUuid, setCopiedUuid] = useState("");
  const [feedback, setFeedback] = useState("");
  const feedbackTimer = useRef(null);

  const clipboardSupported =
    typeof navigator !== "undefined" && Boolean(navigator.clipboard?.writeText);

  const formattedUuids = useMemo(
    () => rawUuids.map((value) => formatUuid(value, options)),
    [rawUuids, options]
  );

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  const stageFeedback = (message) => {
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
    }

    setFeedback(message);
    feedbackTimer.current = setTimeout(() => setFeedback(""), 2400);
  };

  const generatorForVersion = useMemo(
    () => uuidGenerators[selectedVersion] ?? uuidGenerators.v4,
    [selectedVersion]
  );

  const regenerate = () => {
    setRawUuids(buildBatch(batchSize, generatorForVersion));
    stageFeedback("Generated fresh UUIDs");
  };

  const handleVersionChange = (versionId) => {
    setSelectedVersion(versionId);
    const nextGenerator = uuidGenerators[versionId] ?? uuidGenerators.v4;
    setRawUuids(buildBatch(batchSize, nextGenerator));
    stageFeedback(`Switched to UUID ${versionId.toUpperCase()}`);
  };

  const handleCopy = async (value) => {
    if (!clipboardSupported) {
      stageFeedback("Clipboard not available in this browser");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedUuid(value);
      stageFeedback("Copied to clipboard");
      setTimeout(() => setCopiedUuid(""), 1200);
    } catch (error) {
      console.error("Unable to copy UUID", error);
      stageFeedback("Copy failed — please try again");
    }
  };

  const downloadList = () => {
    const timestamp = new Date()
      .toISOString()
      .replaceAll(":", "-")
      .replaceAll(".", "-");
    const blob = new Blob([formattedUuids.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `uuids-${formattedUuids.length}-${timestamp}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    stageFeedback("Saved the batch as a .txt file");
  };

  const optionDescriptors = [
    {
      key: "uppercase",
      title: "Uppercase letters",
      detail: "Switch hexadecimal characters to uppercase for strict systems.",
    },
    {
      key: "trimHyphens",
      title: "Remove hyphens",
      detail: "Produce a compact 32-character string without separators.",
    },
    {
      key: "wrapBraces",
      title: "Wrap with braces",
      detail: "Format as {uuid} to paste into config files quickly.",
    },
  ];

  const insightCards = [
    {
      label: "Version",
      value: selectedVersion.toUpperCase(),
    },
    {
      label: "Batch size",
      value: formattedUuids.length,
    },
    {
      label: "Characters each",
      value: formattedUuids[0]?.length ?? 0,
    },
  ];

  return (
    <div className="app-shell relative isolate overflow-hidden">
      <div className="gradient-blob gradient-blob-one" aria-hidden="true" />
      <div className="gradient-blob gradient-blob-two" aria-hidden="true" />
      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 lg:py-24">
        <header className="space-y-6 text-center">
          <span className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-teal-100">
            Fresh IDs
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-white drop-shadow-sm sm:text-5xl">
              Instant UUID generator built for flow
            </h1>
            <p className="mx-auto max-w-2xl text-balance text-base text-slate-200 sm:text-lg">
              Generate high-entropy RFC 4122 identifiers, format them for your
              stack, and copy or download entire batches without touching a
              terminal.
            </p>
          </div>
          {feedback && (
            <p className="mx-auto max-w-md text-sm font-medium text-teal-200">
              {feedback}
            </p>
          )}
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_10px_80px_rgba(10,10,15,0.45)] backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-teal-200">
                  Latest batch
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  {formattedUuids.length} UUID
                  {formattedUuids.length === 1 ? "" : "s"}
                </h2>
              </div>
              <button
                type="button"
                onClick={downloadList}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
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

            <ul className="mt-8 space-y-3">
              {formattedUuids.map((uuid, index) => (
                <li
                  key={`${uuid}-${index}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-4 transition hover:border-teal-400/60 hover:bg-slate-950/70 md:flex-row md:items-center"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    #{String(index + 1).padStart(2, "0")}
                  </div>
                  <code className="flex-1 font-['Chivo_Mono','Space_Grotesk',monospace] text-base text-teal-50 sm:text-lg">
                    {uuid}
                  </code>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(uuid)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-950 transition duration-200 ${
                        copiedUuid === uuid
                          ? "scale-95 bg-emerald-300 text-slate-900 shadow-inner"
                          : "bg-teal-400/90 hover:scale-105 hover:bg-teal-300"
                      }`}
                    >
                      {copiedUuid === uuid ? (
                        <>
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
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
                              d="M8 8h10M8 12h6M8 16h4M5 4h11a2 2 0 0 1 2 2v14l-4-3-4 3-4-3-4 3V6a2 2 0 0 1 2-2z"
                            />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {insightCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/5 bg-white/5 p-4 text-center"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {card.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <aside className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6 shadow-[0_10px_60px_rgba(5,5,15,0.55)] backdrop-blur">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-teal-100">
                Batch controls
              </p>
              <h2 className="text-2xl font-semibold text-white">
                Fine-tune your output
              </h2>
              <p className="text-sm text-slate-300">
                Choose how many UUIDs to mint and the format you want before
                pressing generate.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <label
                htmlFor="batch-size"
                className="flex items-center justify-between text-sm font-medium text-slate-200"
              >
                <span>Batch size</span>
                <span className="text-base font-semibold text-white">
                  {batchSize}
                </span>
              </label>
              <input
                id="batch-size"
                type="range"
                min={1}
                max={20}
                value={batchSize}
                onChange={(event) => setBatchSize(Number(event.target.value))}
                className="w-full accent-teal-400"
              />
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Up to 20 UUIDs per batch
              </p>
            </div>

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
                      onClick={() => handleVersionChange(choice.id)}
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

            <div className="mt-8 space-y-3">
              {optionDescriptors.map((option) => (
                <label
                  key={option.key}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="text-base font-semibold text-white">
                      {option.title}
                    </p>
                    <p className="text-sm text-slate-300">{option.detail}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={options[option.key]}
                    onChange={() =>
                      setOptions((prev) => ({
                        ...prev,
                        [option.key]: !prev[option.key],
                      }))
                    }
                    className="h-5 w-5 accent-teal-400"
                  />
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={regenerate}
              className="mt-10 w-full rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-teal-500/30 transition hover:opacity-95"
            >
              Generate {batchSize > 1 ? `${batchSize} UUIDs` : "a UUID"}
            </button>

            {!clipboardSupported && (
              <p className="mt-4 text-xs text-amber-200">
                Clipboard API is disabled, so copying will fall back to manual
                selection.
              </p>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}

export default App;
