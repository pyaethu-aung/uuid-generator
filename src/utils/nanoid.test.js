import { describe, expect, it } from "vitest";
import {
  NANOID_ALPHABETS,
  NANOID_DEFAULT_SIZE,
  alphabetById,
  collisionExponent,
  generateNanoId,
  idEntropyBits,
} from "./nanoid";

const URL_SAFE = NANOID_ALPHABETS[0].chars;

describe("generateNanoId", () => {
  it("defaults to a 21-char URL-safe id", () => {
    const id = generateNanoId();
    expect(id).toHaveLength(NANOID_DEFAULT_SIZE);
    expect([...id].every((c) => URL_SAFE.includes(c))).toBe(true);
  });

  it("honors the requested size", () => {
    for (const size of [2, 10, 21, 36]) {
      expect(generateNanoId(size)).toHaveLength(size);
    }
  });

  it("draws only from the supplied alphabet", () => {
    const id = generateNanoId(64, "0123456789abcdef");
    expect(id).toMatch(/^[0-9a-f]{64}$/);
  });

  it("produces only one symbol for a single-character alphabet", () => {
    expect(generateNanoId(8, "x")).toBe("xxxxxxxx");
  });

  it("is uniform over a small alphabet (no rejected index leaks through)", () => {
    // A 10-symbol alphabet forces rejection sampling (mask covers 0-15).
    // Every emitted character must be a valid digit, never a folded value.
    const id = generateNanoId(2000, "0123456789");
    expect(id).toMatch(/^[0-9]+$/);
    expect(id).toHaveLength(2000);
  });

  it("yields distinct ids across calls", () => {
    const a = generateNanoId();
    const b = generateNanoId();
    expect(a).not.toBe(b);
  });

  it("rejects non-positive or non-integer sizes", () => {
    expect(() => generateNanoId(0)).toThrow(RangeError);
    expect(() => generateNanoId(-5)).toThrow(RangeError);
    expect(() => generateNanoId(3.5)).toThrow(RangeError);
  });

  it("rejects an empty or oversized alphabet", () => {
    expect(() => generateNanoId(10, "")).toThrow(RangeError);
    expect(() => generateNanoId(10, "a".repeat(257))).toThrow(RangeError);
  });
});

describe("NANOID_ALPHABETS", () => {
  it("declares the documented preset sizes", () => {
    const sizes = Object.fromEntries(
      NANOID_ALPHABETS.map((a) => [a.id, a.chars.length])
    );
    expect(sizes).toMatchObject({
      "url-safe": 64,
      alphanumeric: 62,
      lowercase: 36,
      hex: 16,
      numbers: 10,
    });
  });

  it("has no duplicate symbols within any preset", () => {
    for (const { chars } of NANOID_ALPHABETS) {
      expect(new Set(chars).size).toBe(chars.length);
    }
  });
});

describe("alphabetById", () => {
  it("returns the matching preset", () => {
    expect(alphabetById("hex").chars).toBe("0123456789abcdef");
  });

  it("falls back to the URL-safe default for an unknown id", () => {
    expect(alphabetById("nope").id).toBe("url-safe");
  });
});

describe("idEntropyBits", () => {
  it("computes length × log2(alphabet size)", () => {
    expect(idEntropyBits(64, 21)).toBeCloseTo(126, 5); // 21 × 6
    expect(idEntropyBits(16, 4)).toBeCloseTo(16, 5); // 4 × 4
  });

  it("returns 0 for degenerate inputs", () => {
    expect(idEntropyBits(0, 10)).toBe(0);
    expect(idEntropyBits(64, -1)).toBe(0);
  });
});

describe("collisionExponent", () => {
  it("grows by ~0.1505 per bit (half a base-10 digit per ~3.3 bits)", () => {
    const lo = collisionExponent(64);
    const hi = collisionExponent(128);
    expect(hi - lo).toBeCloseTo(0.150515 * 64, 3);
  });

  it("matches the birthday bound for the default config (~10^18)", () => {
    // 21 url-safe chars ≈ 126 bits → ~1% collision near 10^18 ids.
    expect(collisionExponent(126)).toBeCloseTo(18.12, 1);
  });

  it("reports -Infinity for a zero-bit id", () => {
    expect(collisionExponent(0)).toBe(-Infinity);
  });
});
