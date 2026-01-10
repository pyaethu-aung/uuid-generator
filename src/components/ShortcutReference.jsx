import PropTypes from "prop-types";

function ShortcutReference({ isOpen, shortcuts, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        className="relative z-10 w-full max-w-2xl rounded-[28px] border theme-border-subtle theme-panel theme-shadow-panel p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold theme-text-primary">
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="theme-ghost-button inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
          >
            Close
          </button>
        </div>
        <p className="mt-2 text-sm theme-text-secondary">
          Use these combos to stay in the flow. Press Esc to dismiss this panel.
        </p>
        <ul className="mt-6 space-y-3">
          {shortcuts.map((entry) => (
            <li
              key={entry.combo}
              className="flex flex-col gap-1 rounded-2xl border theme-border-subtle theme-glass px-4 py-3 md:flex-row md:items-center md:justify-between"
            >
              <div className="text-sm font-semibold uppercase tracking-[0.2em] theme-text-accent">
                {entry.combo}
              </div>
              <p className="text-sm theme-text-primary">{entry.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ShortcutReference.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  shortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      combo: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ShortcutReference;
