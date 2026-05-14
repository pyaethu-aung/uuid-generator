function ValidatorPanelHead({ result, onCopy, copied, onRecheck }) {
  const hasResult = result?.valid;
  const title = hasResult
    ? `/ valid · v${result.version} UUID`
    : result
    ? "/ invalid UUID"
    : "/ —";
  const flag = hasResult
    ? `${result.variantBits} · ${versionLabel(result.version)}`
    : "";

  return (
    <div className="v-panel-head">
      <div className="v-panel-meta">
        <span className="v-panel-bar" aria-hidden="true" />
        <span className="v-panel-title mono">{title}</span>
        {flag && (
          <>
            <span className="v-panel-sep mono" aria-hidden="true">|</span>
            <span className="v-panel-flag mono">{flag}</span>
          </>
        )}
      </div>
      <div className="v-panel-actions">
        <button
          type="button"
          className="ghost-btn mono v-action-btn"
          onClick={onCopy}
          disabled={!result?.valid}
          aria-label="Copy UUID"
        >
          <span className="v-btn-icon">⎘</span>
          <span>{copied ? "copied!" : "copy"}</span>
        </button>
        <button
          type="button"
          className="ghost-btn mono v-action-btn"
          disabled={!result?.valid}
          aria-label="Inspect raw UUID bytes"
          title="Inspect raw"
        >
          <span className="v-btn-icon">{"{}"}</span>
          <span>inspect raw</span>
        </button>
        <button
          type="button"
          className="accent-btn mono v-action-btn"
          onClick={onRecheck}
          aria-label="Recheck validation"
        >
          <span className="v-btn-icon">↺</span>
          <span>recheck</span>
        </button>
      </div>
    </div>
  );
}

function versionLabel(version) {
  const labels = { 1: "gregorian-time", 3: "md5-name", 4: "random", 5: "sha1-name", 7: "time-ordered" };
  return labels[version] ?? `v${version}`;
}

export default ValidatorPanelHead;
