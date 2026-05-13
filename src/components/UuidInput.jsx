function UuidInput({ value, onChange, placeholder = "Paste or type a UUID…" }) {
  return (
    <div className="uuid-input-wrap">
      <input
        type="text"
        className="uuid-input-field mono"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        aria-label="UUID input"
      />
      {value && (
        <button
          type="button"
          className="uuid-input-clear"
          onClick={() => onChange("")}
          aria-label="Clear input"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default UuidInput;
