function CopyButton({ isCopied, onCopy }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-950 transition duration-200 ${
        isCopied
          ? "scale-95 bg-emerald-300 text-slate-900 shadow-inner"
          : "bg-teal-400/90 hover:scale-105 hover:bg-teal-300"
      }`}
    >
      {isCopied ? (
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
  );
}

function UuidList({ uuids, copiedUuid, onCopy }) {
  if (!uuids?.length) return null;

  return (
    <ul className="mt-8 space-y-3">
      {uuids.map((uuid, index) => (
        <li
          key={`${uuid}-${index}`}
          className="group flex flex-col gap-4 rounded-2xl border theme-border-subtle theme-panel p-4 transition hover:border-[color:var(--accent-primary)] md:flex-row md:items-center"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.3em] theme-text-muted">
            #{String(index + 1).padStart(2, "0")}
          </div>
          <code className="flex-1 font-['Chivo_Mono','Space_Grotesk',monospace] text-base theme-text-primary sm:text-lg">
            {uuid}
          </code>
          <div className="flex items-center gap-2">
            <CopyButton
              isCopied={copiedUuid === uuid}
              onCopy={() => onCopy(uuid)}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default UuidList;
