import type {
  NvramOption,
  NvramProperty,
  PatternedNvramProperty,
  ValueTransformer,
  Validator,
  StructuredSchema,
} from "@/nvram/nvram-catalog-types";
import * as nvramCatalog from "@/nvram/nvram";

type RawCatalogEntry =
  | NvramProperty<any>
  | PatternedNvramProperty<Record<string, any>, any>;

export type CatalogEntry = NvramProperty<any>;
export type CatalogPatternEntry = PatternedNvramProperty<
  Record<string, any>,
  any
>;

export interface CatalogMatch {
  key: string;
  page: string;
  label: string;
  description: string;
  type: CatalogEntry["type"];
  defaultRaw?: string;
  options?: ReadonlyArray<NvramOption<any>>;
  transform?: ValueTransformer<any>;
  validation?: Validator<any>;
  structuredSchema?: StructuredSchema;
  patternParams?: Record<string, string | number>;
  raw: RawCatalogEntry | null;
  sourceName: string;
}

export interface ResolvedField extends CatalogMatch {
  /**
   * Normalised helper that converts a raw nvram string into the UI-friendly format.
   * Consumers must treat the return type according to `type`.
   */
  toUi: (rawValue: string | undefined) => unknown;
  /**
   * Normalised helper that converts UI values back to the raw nvram string.
   */
  fromUi: (uiValue: unknown) => string;
}

const directMap = new Map<string, CatalogEntry>();
const patternList: Array<{ name: string; entry: CatalogPatternEntry }> = [];

function isCatalogEntry(value: any): value is CatalogEntry {
  return value && typeof value === "object" && "key" in value && "page" in value;
}

function isPatternEntry(value: any): value is CatalogPatternEntry {
  return (
    value &&
    typeof value === "object" &&
    "regex" in value &&
    "getKey" in value &&
    "page" in value
  );
}

for (const [name, value] of Object.entries(nvramCatalog)) {
  if (isCatalogEntry(value)) {
    directMap.set(value.key, value);
  } else if (isPatternEntry(value)) {
    patternList.push({ name, entry: value });
  }
}

const patternCache = new Map<string, CatalogMatch | null>();

function removeGlobalFlag(regex: RegExp): RegExp {
  if (!regex.flags.includes("g")) {
    return regex;
  }
  return new RegExp(regex.source, regex.flags.replace("g", ""));
}

function normaliseLabel(key: string): string {
  const friendly = key
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return friendly;
}

function toRawString(
  entry: CatalogEntry | CatalogPatternEntry | null,
  value: unknown,
): string {
  if (!entry) {
    return value == null ? "" : String(value);
  }

  const transformer = entry.transform;
  if (transformer) {
    return transformer.fromUi(value);
  }

  switch (entry.type) {
    case "boolean":
      return value ? "1" : "0";
    default:
      return value == null ? "" : String(value);
  }
}

function toUiValue(
  entry: CatalogEntry | CatalogPatternEntry | null,
  raw: string | undefined,
): unknown {
  const rawValue = raw ?? "";
  if (!entry) {
    return rawValue;
  }

  const transformer = entry.transform;
  if (transformer) {
    return transformer.toUi(rawValue);
  }

  switch (entry.type) {
    case "boolean":
      return rawValue === "1";
    case "integer":
      return rawValue === "" ? null : Number(rawValue);
    default:
      return rawValue;
  }
}

function formatDefaultRaw(
  entry: CatalogEntry | CatalogPatternEntry | null,
): string | undefined {
  if (entry?.defaultValue === undefined) {
    return undefined;
  }
  return toRawString(entry, entry.defaultValue);
}

function resolvePatternMatch(key: string): CatalogMatch | null {
  if (patternCache.has(key)) {
    return patternCache.get(key)!;
  }

  for (const { name, entry } of patternList) {
    const regex = removeGlobalFlag(entry.regex);
    const match = regex.exec(key);
    if (!match) continue;

    const params: Record<string, string | number> = {};
    const paramNames = Object.keys(entry.parameters ?? {});
    for (let i = 0; i < paramNames.length; i += 1) {
      const raw = match[i + 1] ?? "";
      const paramName = paramNames[i]!;
      const definition = entry.parameters[paramName]!;
      if (definition.type === "integer" || definition.type === "number") {
        const parsed = Number(raw);
        params[paramName] = Number.isNaN(parsed) ? raw : parsed;
      } else {
        params[paramName] = raw;
      }
    }

    const label = entry.ui?.label
      ? `${entry.ui.label}${paramNames.length ? ` (${Object.values(params).join(", ")})` : ""}`
      : normaliseLabel(key);

    const result: CatalogMatch = {
      key,
      page: entry.page,
      label,
      description: entry.description,
      type: entry.type,
      defaultRaw: formatDefaultRaw(entry),
      options: entry.ui?.options,
      transform: entry.transform,
      validation: entry.validation,
      structuredSchema: entry.structuredSchema,
      patternParams: params,
      raw: entry,
      sourceName: name,
    };
    patternCache.set(key, result);
    return result;
  }

  patternCache.set(key, null);
  return null;
}

export function resolveField(key: string): ResolvedField | null {
  const direct = directMap.get(key);
  if (direct) {
    const match: CatalogMatch = {
      key,
      page: direct.page,
      label: direct.ui?.label ?? normaliseLabel(direct.key),
      description: direct.description,
      type: direct.type,
      defaultRaw: formatDefaultRaw(direct),
      options: direct.ui?.options,
      transform: direct.transform,
      validation: direct.validation,
      structuredSchema: direct.structuredSchema,
      raw: direct,
      sourceName: direct.key,
    };

    return {
      ...match,
      toUi: (rawValue) => toUiValue(direct, rawValue),
      fromUi: (uiValue) => toRawString(direct, uiValue),
    };
  }

  const pattern = resolvePatternMatch(key);
  if (pattern) {
    return {
      ...pattern,
      toUi: (rawValue) => toUiValue(pattern.raw, rawValue),
      fromUi: (uiValue) => toRawString(pattern.raw, uiValue),
    };
  }

  return null;
}

export function resolveMany(
  keys: Iterable<string>,
): Map<string, ResolvedField | null> {
  const map = new Map<string, ResolvedField | null>();
  for (const key of keys) {
    map.set(key, resolveField(key));
  }
  return map;
}

export function getAllPages(): Array<{ id: string; title: string }> {
  const ids = new Set<string>();
  for (const entry of directMap.values()) {
    ids.add(entry.page);
  }
  for (const { entry } of patternList) {
    ids.add(entry.page);
  }

  const result = Array.from(ids).sort();
  return result.map((id) => ({
    id,
    title: prettifyPageId(id),
  }));
}

export function prettifyPageId(page: string): string {
  return page
    .toLowerCase()
    .replace(/\.asp(?:\.html)?$/i, "")
    .replace(/\s+/g, "-");
}

export const UNCATEGORISED_PAGE_ID = "__uncategorised__";

export { normaliseLabel as labelFromKey };
