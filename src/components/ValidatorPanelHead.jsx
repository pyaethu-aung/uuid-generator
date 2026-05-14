function ValidatorPanelHead({ result }) {
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
    </div>
  );
}

function versionLabel(version) {
  const labels = { 1: "gregorian-time", 3: "md5-name", 4: "random", 5: "sha1-name", 7: "time-ordered" };
  return labels[version] ?? `v${version}`;
}

export default ValidatorPanelHead;
