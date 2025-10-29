/**
 * Minimal browser-friendly encoder/decoder for FreshTomato NVRAM .cfg exports.
 *
 * The FreshTomato firmware currently emits two closely related container formats:
 *  - HDR1: legacy profile that simply stores the raw key/value buffer.
 *  - HDR2: modern profile that obfuscates bytes and pads to a 1024-byte boundary.
 *
 * The implementation below models the behaviour of Broadcom's reference utility
 * (see cfg-parser/main.c and cfg-parser/nvram_linux.c) without relying on Node
 * standard library modules so it can run in the browser and Bun/Node runtimes.
 */

export type NvramDictionary = Record<string, string>;

export interface DecodeResult {
  /** Map of key/value pairs recovered from the cfg payload. */
  entries: NvramDictionary;
  /** Header identifier present in the cfg file. */
  header: "HDR1" | "HDR2";
  /** De-obfuscated payload (starts with key=value\0 entries and ends with \0\0). */
  payload: Uint8Array;
  /** File length value encoded in the header (24-bit for HDR2, 32-bit for HDR1). */
  fileLength: number;
  /** Random byte stored in HDR2 headers (undefined for HDR1). */
  salt?: number;
}

export interface EncodeOptions {
  /**
   * Format selector. HDR2 mirrors the behaviour of nvram_save_new in cfg-parser/main.c.
   * HDR1 is a minimal legacy implementation that stores the plain payload.
   */
  format?: "HDR1" | "HDR2";
  /**
   * Optional block size used for HDR2 padding. Defaults to 1024 bytes to match stock firmware.
   */
  blockSize?: number;
  /**
   * Override for the obfuscation salt byte (0-255). When omitted a random salt matching the
   * firmware constraints is generated.
   */
  salt?: number;
  /**
   * Custom random source. Must return an integer in the [0, 255] range.
   * Used both for salt generation (when `salt` is not provided) and replacement bytes.
   */
  randomSource?: () => number;
}

export interface EncodeInput {
  /**
   * Entries to encode. Iteration order controls emission order. Values are treated as UTF-8.
   */
  entries: Iterable<[string, string]> | NvramDictionary;
}

const ASCII_EQ = 0x3d; // '='
const HDR1 = "HDR1";
const HDR2 = "HDR2";
const DEFAULT_BLOCK_SIZE = 1024;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder("utf-8", { fatal: false });

function toUint8Array(source: ArrayBuffer | Uint8Array): Uint8Array {
  return source instanceof Uint8Array ? source : new Uint8Array(source);
}

function readAsciiString(bytes: Uint8Array): string {
  return textDecoder.decode(bytes);
}

function stringToBytes(value: string): Uint8Array {
  return textEncoder.encode(value);
}

function defaultRandomByte(): number {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buf = new Uint8Array(1);
    crypto.getRandomValues(buf);
    return buf[0]!;
  }
  return Math.floor(Math.random() * 256) & 0xff;
}

function selectRandomSource(randomSource?: () => number): () => number {
  if (randomSource) {
    return () => randomSource() & 0xff;
  }
  return defaultRandomByte;
}

function generateSalt(randomByte: () => number): number {
  let salt: number;
  do {
    salt = randomByte() % 30;
  } while (salt > 7 && salt < 14);
  return salt & 0xff;
}

function normaliseEntries(input: EncodeInput["entries"]): Array<[string, string]> {
  if (Symbol.iterator in Object(input)) {
    if (Array.isArray(input)) {
      return input.map(([k, v]) => [k, v ?? ""]);
    }
    const result: Array<[string, string]> = [];
    for (const pair of input as Iterable<[string, string]>) {
      const [k, v] = pair;
      result.push([k, v ?? ""]);
    }
    return result;
  }
  return Object.entries(input as NvramDictionary);
}

function buildPlainPayload(entries: Array<[string, string]>): Uint8Array {
  // Reserve an extra trailing zero terminator as seen in nvram_getall buffers.
  let totalLength = 1;
  const encodedPairs = entries.map(([key, value]) => {
    if (key.includes("\0") || value.includes("\0")) {
      throw new Error("Keys and values must not contain NUL characters.");
    }
    const keyBytes = stringToBytes(key);
    const valueBytes = stringToBytes(value);
    totalLength += keyBytes.length + 1 + valueBytes.length + 1;
    return { keyBytes, valueBytes };
  });

  const buffer = new Uint8Array(totalLength);
  let offset = 0;
  for (const { keyBytes, valueBytes } of encodedPairs) {
    buffer.set(keyBytes, offset);
    offset += keyBytes.length;

    buffer[offset++] = ASCII_EQ;

    buffer.set(valueBytes, offset);
    offset += valueBytes.length;

    buffer[offset++] = 0x00;
  }

  buffer[offset++] = 0x00; // ensures double-NUL terminator at the end of the payload
  return buffer;
}

function decodeHdr2(body: Uint8Array, salt: number): Uint8Array {
  const decoded = new Uint8Array(body.length);
  for (let i = 0; i < body.length; i += 1) {
    const value = body[i]!;
    if (value > 0xfc) {
      decoded[i] = i > 0 && decoded[i - 1] !== 0 ? 0x00 : value;
    } else {
      decoded[i] = (0xff + salt - value) & 0xff;
    }
  }
  return decoded;
}

function parseEntries(buffer: Uint8Array): NvramDictionary {
  const result: NvramDictionary = {};
  let i = 0;
  while (i < buffer.length) {
    const byte = buffer[i]!;

    if (byte === 0 || byte < 32 || byte > 127) {
      i += 1;
      continue;
    }

    const start = i;
    while (i < buffer.length && buffer[i] !== 0) {
      i += 1;
    }

    const entry = buffer.slice(start, i);
    const separatorIndex = entry.indexOf(ASCII_EQ);

    if (separatorIndex === -1) {
      const key = readAsciiString(entry);
      if (!(key in result)) {
        result[key] = "";
      }
    } else {
      const key = readAsciiString(entry.slice(0, separatorIndex));
      const value = readAsciiString(entry.slice(separatorIndex + 1));
      result[key] = value;
    }

    i += 1; // skip padding NUL
  }
  return result;
}

function encodeHdr2(plain: Uint8Array, options: Required<Pick<EncodeOptions, "blockSize">> & {
  salt: number;
  randomByte: () => number;
}): Uint8Array {
  const { blockSize, salt, randomByte } = options;

  const count = plain.length;
  const transformed = new Uint8Array(count);

  for (let i = 0; i < count; i += 1) {
    const value = plain[i]!;
    if (value === 0) {
      transformed[i] = 0xfd + (randomByte() % 3);
    } else {
      transformed[i] = (0xff - value + salt) & 0xff;
    }
  }

  const remainder = count % blockSize;
  const paddedLength = count + (blockSize - remainder || blockSize);
  const out = new Uint8Array(8 + paddedLength);

  out[0] = 0x48; // H
  out[1] = 0x44; // D
  out[2] = 0x52; // R
  out[3] = 0x32; // 2

  out[4] = paddedLength & 0xff;
  out[5] = (paddedLength >> 8) & 0xff;
  out[6] = (paddedLength >> 16) & 0xff;
  out[7] = salt & 0xff;

  out.set(transformed, 8);

  let offset = 8 + count;
  for (let i = count; i < paddedLength; i += 1) {
    out[offset] = 0xfd + (randomByte() % 3);
    offset += 1;
  }

  return out;
}

function encodeHdr1(plain: Uint8Array): Uint8Array {
  const header = new Uint8Array(8);
  header[0] = 0x48; // H
  header[1] = 0x44; // D
  header[2] = 0x52; // R
  header[3] = 0x31; // 1

  const len = plain.length;
  header[4] = len & 0xff;
  header[5] = (len >> 8) & 0xff;
  header[6] = (len >> 16) & 0xff;
  header[7] = (len >> 24) & 0xff;

  const out = new Uint8Array(header.length + len);
  out.set(header, 0);
  out.set(plain, header.length);
  return out;
}

export function decodeCfg(
  input: ArrayBuffer | Uint8Array,
): DecodeResult {
  const bytes = toUint8Array(input);
  if (bytes.length < 8) {
    throw new Error("cfg payload too short to contain a valid header.");
  }

  const header = readAsciiString(bytes.slice(0, 4)) as "HDR1" | "HDR2";
  if (header !== HDR1 && header !== HDR2) {
    throw new Error(`Unsupported cfg header "${header}".`);
  }

  let fileLength: number;
  let payload: Uint8Array;
  let salt: number | undefined;

  if (header === HDR1) {
    fileLength =
      bytes[4]! |
      (bytes[5]! << 8) |
      (bytes[6]! << 16) |
      (bytes[7]! << 24);
    payload = bytes.slice(8, 8 + fileLength);
  } else {
    fileLength =
      bytes[4]! |
      (bytes[5]! << 8) |
      (bytes[6]! << 16);
    salt = bytes[7]!;
    const body = bytes.slice(8, 8 + fileLength);
    payload = decodeHdr2(body, salt);
  }

  const entries = parseEntries(payload);

  return {
    entries,
    header,
    payload,
    fileLength,
    salt,
  };
}

export function encodeCfg(
  input: EncodeInput["entries"],
  options: EncodeOptions = {},
): Uint8Array {
  const entries = normaliseEntries(input);
  const plain = buildPlainPayload(entries);

  const { format = HDR2, blockSize = DEFAULT_BLOCK_SIZE, randomSource, salt } = options;

  if (format === HDR1) {
    if (salt !== undefined) {
      throw new Error("HDR1 format does not use the salt option.");
    }
    return encodeHdr1(plain);
  }

  const randomByte = selectRandomSource(randomSource);
  const saltByte = salt !== undefined ? salt & 0xff : generateSalt(randomByte);

  return encodeHdr2(plain, {
    blockSize,
    salt: saltByte,
    randomByte,
  });
}
