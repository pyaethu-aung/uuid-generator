const VERSION_LABELS = {
  1: "time-based",
  4: "random",
  7: "time-ordered",
};

function ValidationBadge({ result }) {
  if (!result) return null;

  if (!result.valid) {
    return (
      <span className="validation-badge validation-badge--invalid" role="status">
        Invalid UUID
      </span>
    );
  }

  const label = VERSION_LABELS[result.version];
  return (
    <span className="validation-badge validation-badge--valid" role="status">
      Valid — UUID v{result.version}
      {label ? ` (${label})` : ""}
    </span>
  );
}

export default ValidationBadge;
