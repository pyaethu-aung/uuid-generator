import { KEY_OPT } from "../utils/platform";
import { LEAF_ORDER, familyOfLeaf } from "../data/tabs";

// The family-scoped operation switcher (UUID: Generate / Validate / Convert).
// Rendered only for families with more than one mode — single-mode families
// (ULID, NanoID) return nothing, which is what keeps the structure honest. The
// modes map 1:1 to the ⌥⇧1…5 jump keys, so each segment advertises its own
// shortcut; the active segment also carries aria-current so its filled state is
// not the sole (colour-only) signal.
function ModeSwitcher({ activeLeaf, onSelect }) {
  const family = familyOfLeaf(activeLeaf);
  if (family.modes.length < 2) return null;
  return (
    <div className="mode-switcher mono" role="group" aria-label={`${family.label} operation`}>
      {family.modes.map((mode) => {
        const isActive = mode.leaf === activeLeaf;
        const jump = LEAF_ORDER.indexOf(mode.leaf) + 1;
        return (
          <button
            key={mode.leaf}
            type="button"
            className={`mode-btn${isActive ? " mode-btn--active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            aria-keyshortcuts={`Alt+Shift+${jump}`}
            title={`${mode.label} · ${KEY_OPT}⇧${jump}`}
            onClick={() => !isActive && onSelect(mode.leaf)}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}

export default ModeSwitcher;
