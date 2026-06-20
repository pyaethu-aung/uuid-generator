// NanoID: a compact, URL-safe random identifier. Unlike a UUID it carries no
// version/variant structure and no timestamp; it is pure randomness over a
// configurable alphabet and length (spec: github.com/ai/nanoid). The default is
// 21 characters of a 64-symbol URL-safe alphabet, which matches a UUID's
// ~122 bits of entropy in 15 fewer characters.

export const NANOID_MIN_SIZE = 2;
export const NANOID_MAX_SIZE = 36;
export const NANOID_DEFAULT_SIZE = 21;

export const NANOID_MIN_COUNT = 1;
export const NANOID_MAX_COUNT = 50;
export const NANOID_DEFAULT_COUNT = 8;

// Alphabet presets. `chars` is the actual symbol set; `size` is precomputed for
// the entropy readout. URL-safe (64 symbols) is the NanoID default.
export const NANOID_ALPHABETS = [
  {
    id: "url-safe",
    label: "url-safe",
    chars:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-",
  },
  {
    id: "alphanumeric",
    label: "alphanum",
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  },
  {
    id: "lowercase",
    label: "lowercase",
    chars: "0123456789abcdefghijklmnopqrstuvwxyz",
  },
  { id: "hex", label: "hex", chars: "0123456789abcdef" },
  { id: "numbers", label: "numbers", chars: "0123456789" },
];

export const NANOID_DEFAULT_ALPHABET = NANOID_ALPHABETS[0].id;

// Look up a preset by id, falling back to the URL-safe default.
export function alphabetById(id) {
  return NANOID_ALPHABETS.find((a) => a.id === id) ?? NANOID_ALPHABETS[0];
}

// Mint one NanoID of `size` characters drawn uniformly from `alphabet`.
//
// This is NanoID's own rejection-sampling algorithm, not a modulo reduction.
// `mask` is the smallest (2^k - 1) that covers the alphabet's largest index, so
// every random byte is masked to just enough bits; any masked value that lands
// past the alphabet end is discarded rather than folded back, which would bias
// the low indices. `step` over-allocates random bytes (the 1.6 factor) so a
// single getRandomValues call usually fills the id even after some rejections.
export function generateNanoId(
  size = NANOID_DEFAULT_SIZE,
  alphabet = NANOID_ALPHABETS[0].chars
) {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError("NanoID size must be a positive integer");
  }
  if (typeof alphabet !== "string" || alphabet.length < 1 || alphabet.length > 256) {
    throw new RangeError("NanoID alphabet must be 1 to 256 characters");
  }

  // floor(log2(len - 1)) via clz32, then the next power of two, minus one.
  const mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;
  const step = Math.ceil((1.6 * mask * size) / alphabet.length);

  let id = "";
  // Bounded by entropy, not by iteration count: each pass appends at least one
  // character with overwhelming probability, so this terminates quickly.
  for (;;) {
    const bytes = new Uint8Array(step);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < step; i += 1) {
      const index = bytes[i] & mask;
      if (index < alphabet.length) {
        id += alphabet[index];
        if (id.length === size) return id;
      }
    }
  }
}

// Shannon entropy of one id: length × log2(alphabet size), in bits. This is the
// honest "how guessable is it" number, independent of the chosen symbols.
export function idEntropyBits(alphabetSize, length) {
  if (alphabetSize < 1 || length < 0) return 0;
  return length * Math.log2(alphabetSize);
}

// Order of magnitude (base-10 exponent) of how many ids you can mint before a
// 1% chance of a single collision, from the birthday bound n ≈ k·√N where
// N = 2^bits and k = √(2·ln(1/(1−0.01))). Returned as log10(n) so it stays a
// finite number even when the keyspace overflows a float; the panel renders it
// as "~10^x". 0-bit (empty) ids collide immediately, so report -Infinity.
const COLLISION_K_LOG10 = Math.log10(Math.sqrt(2 * Math.log(1 / 0.99)));
const LOG10_2 = Math.log10(2);
export function collisionExponent(bits) {
  if (!(bits > 0)) return -Infinity;
  return COLLISION_K_LOG10 + (bits / 2) * LOG10_2;
}
