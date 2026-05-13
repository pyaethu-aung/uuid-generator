const FIELD_LABELS = {
  timeLow: "time-low",
  timeMid: "time-mid",
  timeHighAndVersion: "time-high-and-version",
  clockSeqAndReserved: "clock-seq-and-reserved",
  node: "node",
};

const SEG_CLASSES = ["seg-a", "seg-b", "seg-c", "seg-d", "seg-e"];
const FIELD_ORDER = ["timeLow", "timeMid", "timeHighAndVersion", "clockSeqAndReserved", "node"];

function UuidBreakdown({ fields }) {
  if (!fields) return null;

  return (
    <div className="uuid-breakdown" aria-label="UUID field breakdown">
      {FIELD_ORDER.map((key, i) => (
        <div key={key} className={`uuid-breakdown__seg ${SEG_CLASSES[i]}`}>
          <span className="uuid-breakdown__hex mono">{fields[key]}</span>
          <span className="uuid-breakdown__label">{FIELD_LABELS[key]}</span>
        </div>
      ))}
    </div>
  );
}

export default UuidBreakdown;
