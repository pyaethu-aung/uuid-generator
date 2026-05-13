const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// 100ns ticks from Oct 15, 1582 to Jan 1, 1970
const GREGORIAN_OFFSET = 122192928000000000n;

export function normalizeInput(raw) {
  if (typeof raw !== "string") return "";
  let s = raw.trim();
  if (s.startsWith("{") && s.endsWith("}")) s = s.slice(1, -1);
  return s;
}

export function extractFields(uuid) {
  const hex = uuid.replace(/-/g, "").toLowerCase();
  return {
    timeLow: hex.slice(0, 8),
    timeMid: hex.slice(8, 12),
    timeHighAndVersion: hex.slice(12, 16),
    clockSeqAndReserved: hex.slice(16, 20),
    node: hex.slice(20, 32),
  };
}

export function detectVariant(hex) {
  const v = parseInt(hex[16], 16);
  if (v <= 7) return "NCS";
  if (v <= 11) return "RFC 4122";
  if (v <= 13) return "Microsoft";
  return "Reserved";
}

export function parseUuid(raw) {
  const normalized = normalizeInput(raw);
  if (!normalized || !UUID_REGEX.test(normalized)) {
    return { valid: false, raw: normalized };
  }
  const lower = normalized.toLowerCase();
  const hex = lower.replace(/-/g, "");
  const version = parseInt(hex[12], 16);
  const variant = detectVariant(hex);
  const fields = extractFields(lower);
  let decoded = null;
  if (version === 1) decoded = decodeUuidV1(fields);
  else if (version === 7) decoded = decodeUuidV7(fields);
  return { valid: true, raw: normalized, version, variant, fields, decoded };
}

export function decodeUuidV7(fields) {
  const hex =
    fields.timeLow +
    fields.timeMid +
    fields.timeHighAndVersion +
    fields.clockSeqAndReserved +
    fields.node;
  const unixMs = parseInt(hex.slice(0, 12), 16);
  const sequence = parseInt(hex.slice(13, 16), 16);
  const timestamp = new Date(unixMs);
  return {
    timestamp,
    timestampIso: timestamp.toISOString(),
    timestampRelative: formatRelativeTime(timestamp),
    sequence,
    node: null,
    clockSeq: null,
  };
}

export function decodeUuidV1(fields) {
  const timeLow = BigInt("0x" + fields.timeLow);
  const timeMid = BigInt("0x" + fields.timeMid);
  const timeHigh = BigInt("0x" + fields.timeHighAndVersion) & 0x0fffn;
  const ticks = (timeHigh << 48n) | (timeMid << 32n) | timeLow;
  const unixMs = Number((ticks - GREGORIAN_OFFSET) / 10000n);
  const clockSeq = parseInt(fields.clockSeqAndReserved, 16) & 0x3fff;
  const timestamp = new Date(unixMs);
  return {
    timestamp,
    timestampIso: timestamp.toISOString(),
    timestampRelative: formatRelativeTime(timestamp),
    sequence: null,
    node: fields.node,
    clockSeq,
  };
}

export function formatRelativeTime(date) {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(Math.abs(diffMs) / 1000);
  const diffMin = Math.round(Math.abs(diffMs) / 60000);
  const diffHour = Math.round(Math.abs(diffMs) / 3600000);
  const diffDay = Math.round(Math.abs(diffMs) / 86400000);
  const sign = diffMs >= 0 ? -1 : 1;
  const fmt = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (diffSec < 60) return fmt.format(sign * diffSec, "second");
  if (diffMin < 60) return fmt.format(sign * diffMin, "minute");
  if (diffHour < 24) return fmt.format(sign * diffHour, "hour");
  if (diffDay < 30) return fmt.format(sign * diffDay, "day");
  return date.toLocaleString();
}
