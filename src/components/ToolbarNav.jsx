import { KEY_OPT } from "../utils/platform";
import { FAMILIES, LEAF_ORDER, familyOfLeaf } from "../data/tabs";

// The top bar lists ID families (UUID / ULID / NanoID). Clicking a family lands
// on its last-used mode (default: its first mode). Within UUID the operation is
// chosen by ModeSwitcher; ULID and NanoID are single-mode, so the family tab is
// itself a leaf and advertises that leaf's ⌥⇧ jump key.
function ToolbarNav({ activeTab, onTabChange, lastLeafByFamily = {} }) {
  const activeFamilyId = familyOfLeaf(activeTab).id;
  return (
    <>
      {FAMILIES.map((family) => {
        const isActive = family.id === activeFamilyId;
        const target = lastLeafByFamily[family.id] ?? family.modes[0].leaf;
        const single = family.modes.length === 1;
        const jump = single ? LEAF_ORDER.indexOf(family.modes[0].leaf) + 1 : null;
        return (
          <button
            key={family.id}
            type="button"
            className={`tab-btn${isActive ? " tab-btn--active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            aria-keyshortcuts={jump ? `Alt+Shift+${jump}` : undefined}
            title={jump ? `${family.label} · ${KEY_OPT}⇧${jump}` : family.label}
            onClick={() => !isActive && onTabChange(target)}
          >
            {family.label}
          </button>
        );
      })}
    </>
  );
}

export default ToolbarNav;
