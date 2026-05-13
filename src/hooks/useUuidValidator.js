import { useState, useMemo } from "react";
import { normalizeInput, parseUuid } from "../utils/uuidDecoder";

function useUuidValidator() {
  const [rawInput, setRawInput] = useState("");
  const result = useMemo(
    () => (rawInput ? parseUuid(normalizeInput(rawInput)) : null),
    [rawInput]
  );
  return { rawInput, setRawInput, result };
}

export default useUuidValidator;
