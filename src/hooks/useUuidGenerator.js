import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildBatch,
  defaultOptions,
  formatUuid,
  uuidGenerators,
} from "../utils/uuid";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const initialBatchSize = 1;

function useUuidGenerator() {
  const [batchSize, setBatchSize] = useState(initialBatchSize);
  const [selectedVersion, setSelectedVersion] = useState("v4");
  const [options, setOptions] = useState(defaultOptions);
  const [rawUuids, setRawUuids] = useState(() => buildBatch(initialBatchSize));
  const [copiedUuid, setCopiedUuid] = useState("");
  const [feedback, setFeedback] = useState("");
  const feedbackTimer = useRef(null);

  const clipboardSupported =
    typeof navigator !== "undefined" && Boolean(navigator.clipboard?.writeText);

  const formattedUuids = useMemo(
    () => rawUuids.map((value) => formatUuid(value, options)),
    [rawUuids, options]
  );

  const generatorForVersion = useMemo(
    () => uuidGenerators[selectedVersion] ?? uuidGenerators.v4,
    [selectedVersion]
  );

  const visibleBatchSize = Math.min(batchSize, 20);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  const stageFeedback = useCallback((message) => {
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
    }

    setFeedback(message);
    feedbackTimer.current = setTimeout(() => setFeedback(""), 2400);
  }, []);

  const syncVisibleBatch = useCallback(
    (count = batchSize, generator = generatorForVersion) => {
      const limited = clamp(count, 1, 20);
      setRawUuids(buildBatch(limited, generator));
    },
    [batchSize, generatorForVersion]
  );

  const regenerate = useCallback(() => {
    syncVisibleBatch();
    stageFeedback("Generated fresh UUIDs");
  }, [syncVisibleBatch, stageFeedback]);

  const handleVersionChange = useCallback(
    (versionId) => {
      setSelectedVersion(versionId);
      const nextGenerator = uuidGenerators[versionId] ?? uuidGenerators.v4;
      syncVisibleBatch(batchSize, nextGenerator);
      stageFeedback(`Switched to UUID ${versionId.toUpperCase()}`);
    },
    [batchSize, syncVisibleBatch, stageFeedback]
  );

  const handleCopy = useCallback(
    async (value) => {
      if (!clipboardSupported) {
        stageFeedback("Clipboard not available in this browser");
        return;
      }

      try {
        await navigator.clipboard.writeText(value);
        setCopiedUuid(value);
        stageFeedback("Copied to clipboard");
        setTimeout(() => setCopiedUuid(""), 1200);
      } catch (error) {
        console.error("Unable to copy UUID", error);
        stageFeedback("Copy failed — please try again");
      }
    },
    [clipboardSupported, stageFeedback]
  );

  const downloadList = useCallback(() => {
    const effectiveCount = clamp(batchSize, 1, 200);
    const extendedBatch = buildBatch(effectiveCount, generatorForVersion);
    const formattedDownload = extendedBatch.map((value) =>
      formatUuid(value, options)
    );

    const timestamp = new Date()
      .toISOString()
      .replaceAll(":", "-")
      .replaceAll(".", "-");
    const blob = new Blob([formattedDownload.join("\n")], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `uuids-${formattedDownload.length}-${timestamp}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    stageFeedback(`Saved ${formattedDownload.length} UUIDs as a .txt file`);
  }, [batchSize, generatorForVersion, options, stageFeedback]);

  const toggleOption = useCallback((key) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const commitBatchSize = useCallback(() => {
    syncVisibleBatch();
  }, [syncVisibleBatch]);

  return {
    batchSize,
    setBatchSize,
    visibleBatchSize,
    selectedVersion,
    options,
    formattedUuids,
    copiedUuid,
    feedback,
    clipboardSupported,
    regenerate,
    handleCopy,
    handleVersionChange,
    toggleOption,
    downloadList,
    commitBatchSize,
  };
}

export default useUuidGenerator;
