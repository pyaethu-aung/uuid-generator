function CopyButton({ isCopied, onCopy }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${isCopied
          ? "scale-95 shadow-inner bg-[var(--btn-active)] text-[var(--btn-text)]"
          : "bg-[var(--btn-bg)] text-[var(--btn-text)] hover:scale-105 hover:bg-[var(--btn-hover)]"
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
          className="group flex min-w-0 flex-col gap-4 rounded-2xl border theme-border-subtle theme-panel p-4 transition hover:border-[color:var(--accent-primary)] md:flex-row md:items-center"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.3em] theme-text-muted">
            #{String(index + 1).padStart(2, "0")}
          </div>
          <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-['Chivo_Mono','Space_Grotesk',monospace] text-base theme-text-primary sm:text-lg">
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
