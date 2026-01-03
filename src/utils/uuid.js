import { v1 as uuidV1, v4 as uuidV4, v7 as uuidV7 } from "uuid";

export const defaultOptions = {
  uppercase: false,
  trimHyphens: false,
  wrapBraces: false,
};

export const versionChoices = [
  {
    id: "v4",
    title: "Version 4",
    badge: "Random",
    detail: "Pure randomness via Web Crypto for most workflows.",
  },
  {
    id: "v1",
    title: "Version 1",
    badge: "Time-ordered",
    detail: "Timestamp-first IDs that stay sortable for logs and tracing.",
  },
  {
    id: "v7",
    title: "Version 7",
    badge: "Unix time",
    detail:
      "Modern hybrid using time bits plus randomness for distributed systems.",
  },
];

export const optionDescriptors = [
  {
    key: "uppercase",
    title: "Uppercase letters",
    detail: "Switch hexadecimal characters to uppercase for strict systems.",
  },
  {
    key: "trimHyphens",
    title: "Remove hyphens",
    detail: "Produce a compact 32-character string without separators.",
  },
  {
    key: "wrapBraces",
    title: "Wrap with braces",
    detail: "Format as {uuid} to paste into config files quickly.",
  },
];

export const uuidGenerators = {
  v1: () => (typeof uuidV1 === "function" ? uuidV1() : createUuid()),
  v4: () => (typeof uuidV4 === "function" ? uuidV4() : createUuid()),
  v7: () => {
    if (typeof uuidV7 === "function") {
      return uuidV7();
    }

    return typeof uuidV4 === "function" ? uuidV4() : createUuid();
  },
};

export const buildBatch = (count, generator = uuidGenerators.v4) =>
  Array.from({ length: count }, () => generator());

export const createUuid = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  // RFC 4122 compliant fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === "x" ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
};

export const formatUuid = (value, options) => {
  let next = value;

  if (options.trimHyphens) {
    next = next.replace(/-/g, "");
  }

  if (options.uppercase) {
    next = next.toUpperCase();
  }

  if (options.wrapBraces) {
    next = `{${next}}`;
  }

  return next;
};
