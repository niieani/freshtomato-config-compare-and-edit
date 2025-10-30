import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
  type KeyboardEvent,
  type ReactNode,
  type SVGProps,
} from "react";
import { decodeCfg, encodeCfg } from "@/nvram/nvram-cfg";
import {
  type StructuredPrimitiveField,
  type StructuredPrimitiveType,
  type StructuredSchema,
  type StructuredObjectSchemaDefinition,
} from "@/nvram/nvram-catalog-types";
import {
  computeDiff,
  type DiffEntry,
  type DiffStatus,
  type NvramEntries,
} from "@/lib/diff";
import {
  resolveField,
  prettifyPageId,
  UNCATEGORISED_PAGE_ID,
  labelFromKey,
  type ResolvedField,
} from "@/lib/nvramCatalog";
import {
  getGroupDisplayMeta,
  getPageDisplayMeta,
  PREFERRED_MENU_STRUCTURE,
  UNCATALOGUED_GROUP_KEY,
  UNCATALOGUED_GROUP_LABEL,
  UNCATALOGUED_GROUP_ORDER,
} from "@/lib/pageOrdering";
import "./index.css";

type SelectionOption = "left" | "right" | "custom" | "remove";
type ThemePreference = "system" | "light" | "dark";

interface SelectionState {
  option: SelectionOption;
  customRaw?: string;
}

interface LoadedConfig {
  id: string;
  name: string;
  size: number;
  header: "HDR1" | "HDR2";
  fileLength: number;
  salt?: number;
  entries: NvramEntries;
  loadedAt: string;
}

const PRIMARY_STORAGE_KEY = "tomato-router:primary";
const COMPARISON_STORAGE_KEY = "tomato-router:comparison";
const THEME_PREFERENCE_STORAGE_KEY = "tomato-router:theme";

function parseStoredConfig(raw: string): LoadedConfig | null {
  try {
    const data = JSON.parse(raw) as Partial<LoadedConfig> | null;
    if (!data || typeof data !== "object") {
      return null;
    }
    const { id, name, size, header, fileLength, entries, loadedAt, salt } =
      data;
    if (
      typeof id !== "string" ||
      typeof name !== "string" ||
      typeof size !== "number" ||
      (header !== "HDR1" && header !== "HDR2") ||
      typeof fileLength !== "number" ||
      typeof loadedAt !== "string" ||
      !entries ||
      typeof entries !== "object"
    ) {
      return null;
    }
    const normalised: NvramEntries = {};
    for (const [key, value] of Object.entries(
      entries as Record<string, unknown>,
    )) {
      normalised[key] =
        typeof value === "string" ? value : value == null ? "" : String(value);
    }
    return {
      id,
      name,
      size,
      header,
      fileLength,
      salt: typeof salt === "number" ? salt : undefined,
      entries: normalised,
      loadedAt,
    };
  } catch (error) {
    console.warn("Failed to parse stored configuration", error);
    return null;
  }
}

type DiffFilter = "all" | "different" | "added" | "removed";

interface FieldView {
  key: string;
  field: ResolvedField;
  leftRaw?: string;
  rightRaw?: string;
  workingRaw?: string;
  diff: DiffEntry;
  finalDiff: DiffEntry;
  selection: SelectionState | undefined;
  originCategory?: "onlyLeft" | "onlyRight" | "other" | "custom";
}

const DIFF_BADGE_THEME: Record<DiffStatus, string> = {
  same: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-200 dark:border-slate-700/60",
  different:
    "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-400/40",
  added:
    "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-400/40",
  removed:
    "bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-400/40",
};

const PRIMARY_DIFF_BADGE_THEME: Record<DiffStatus, string> = {
  ...DIFF_BADGE_THEME,
  different:
    "bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-200 dark:border-indigo-400/50",
};

const FINAL_STATUS_LABEL: Record<DiffStatus, string> = {
  same: "SAME",
  different: "EDITED",
  added: "ADDED",
  removed: "REMOVED",
};

type ValueTone = "left" | "right" | "both" | "custom" | "neutral";

const SURFACE_TONE_CLASSES: Record<ValueTone, string> = {
  left: "border-sky-200/80 bg-sky-50 dark:border-sky-400/40 dark:bg-sky-500/20",
  right:
    "border-rose-200/80 bg-rose-50 dark:border-rose-400/40 dark:bg-rose-500/20",
  both: "border-violet-200/80 bg-violet-50 dark:border-violet-400/40 dark:bg-violet-500/20",
  custom:
    "border-amber-200/80 bg-amber-50 dark:border-amber-400/40 dark:bg-amber-500/20",
  neutral:
    "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/70",
};

const CHIP_TONE_BASE_CLASSES: Record<ValueTone, string> = {
  left: "border border-sky-300 text-sky-700 hover:bg-sky-100 dark:border-sky-500/40 dark:text-sky-200 dark:hover:bg-sky-500/20",
  right:
    "border border-rose-300 text-rose-700 hover:bg-rose-100 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/20",
  both: "border border-violet-300 text-violet-700 hover:bg-violet-100 dark:border-violet-500/40 dark:text-violet-200 dark:hover:bg-violet-500/20",
  custom:
    "border border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-500/40 dark:text-amber-200 dark:hover:bg-amber-500/20",
  neutral:
    "border border-slate-300 text-slate-600 hover:bg-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
};

const CHIP_TONE_ACTIVE_CLASSES: Record<ValueTone, string> = {
  left: "bg-sky-200 text-sky-900 shadow-[0_0_0_1px_rgba(56,189,248,0.4)] dark:bg-sky-500/40 dark:text-white dark:shadow-[0_0_0_1px_rgba(56,189,248,0.45)]",
  right:
    "bg-rose-200 text-rose-900 shadow-[0_0_0_1px_rgba(244,114,182,0.35)] dark:bg-rose-500/40 dark:text-white dark:shadow-[0_0_0_1px_rgba(244,114,182,0.45)]",
  both: "bg-violet-200 text-violet-900 shadow-[0_0_0_1px_rgba(196,181,253,0.4)] dark:bg-violet-500/40 dark:text-white dark:shadow-[0_0_0_1px_rgba(167,139,250,0.45)]",
  custom:
    "bg-amber-200 text-amber-900 shadow-[0_0_0_1px_rgba(251,191,36,0.35)] dark:bg-amber-500/40 dark:text-white dark:shadow-[0_0_0_1px_rgba(250,204,21,0.45)]",
  neutral: "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white",
};

const DROPZONE_TONE_CLASSES = {
  left: "border-sky-300/80 bg-sky-50 hover:border-sky-400 hover:bg-sky-100 dark:border-sky-500/40 dark:bg-sky-500/15 dark:hover:border-sky-400/70 dark:hover:bg-sky-500/25",
  right:
    "border-rose-300/80 bg-rose-50 hover:border-rose-400 hover:bg-rose-100 dark:border-rose-500/40 dark:bg-rose-500/15 dark:hover:border-rose-400/70 dark:hover:bg-rose-500/25",
  both: "border-violet-300/80 bg-violet-50 hover:border-violet-400 hover:bg-violet-100 dark:border-violet-500/40 dark:bg-violet-500/15 dark:hover:border-violet-400/70 dark:hover:bg-violet-500/25",
} as const;

const LABEL_TONE_CLASSES: Record<ValueTone, string> = {
  left: "text-sky-700 dark:text-sky-200",
  right: "text-rose-700 dark:text-rose-200",
  both: "text-violet-700 dark:text-violet-200",
  custom: "text-amber-700 dark:text-amber-200",
  neutral: "text-slate-600 dark:text-slate-500",
};

type ControlType =
  | "boolean"
  | "select"
  | "number"
  | "integer"
  | "textarea"
  | "text"
  | "list"
  | "portforward"
  | "structured"
  | "ip"
  | "mac"
  | "netmask"
  | "hex";

interface PortForwardIpv4Rule {
  enabled: boolean;
  protocol: number;
  srcAddr: string;
  extPorts: string;
  intPort?: number;
  intAddr: string;
  description: string;
}

interface PortForwardIpv6Rule {
  enabled: boolean;
  protocol: string;
  srcAddress: string;
  destAddress: string;
  destPorts: string;
  description: string;
}

type PortForwardRule = PortForwardIpv4Rule | PortForwardIpv6Rule;

interface NavigateToFieldOptions {
  preserveFilters?: boolean;
  updateHash?: boolean;
  behavior?: ScrollBehavior;
}

function resolveControlType(field: ResolvedField): ControlType {
  if (field.options && field.options.length > 0) return "select";
  switch (field.type) {
    case "boolean":
      return "boolean";
    case "integer":
      return "integer";
    case "multiline-string":
      return "textarea";
    case "list":
      return "list";
    case "structured-string":
      if (field.key === "portforward" || field.key === "ipv6_portforward") {
        return "portforward";
      }
      return "structured";
    case "ip":
      return "ip";
    case "mac":
      return "mac";
    case "netmask":
      return "netmask";
    case "hex":
      return "hex";
    default:
      return "text";
  }
}

function coerceDisplayValue(
  field: ResolvedField,
  raw: string | undefined,
  controlType: ControlType,
) {
  switch (controlType) {
    case "boolean":
      return Boolean(field.toUi(raw));
    case "integer": {
      const rawValue = raw ?? "";
      if (rawValue === "-") return rawValue;
      const uiValue = field.toUi(raw);
      if (uiValue === null || uiValue === undefined || uiValue === "")
        return "";
      if (typeof uiValue === "number" && Number.isFinite(uiValue)) {
        return Math.trunc(uiValue);
      }
      const sanitized = rawValue.replace(/[^0-9-]/g, "");
      if (sanitized.startsWith("-")) {
        return `-${sanitized.slice(1).replace(/-/g, "")}`;
      }
      return sanitized.replace(/-/g, "");
    }
    case "number": {
      const uiValue = field.toUi(raw);
      const rawValue = raw ?? "";
      const isIntegerField = field.type === "integer";
      if (rawValue === "-" || rawValue === "." || rawValue === "-.")
        return rawValue;
      if (uiValue === null || uiValue === undefined || uiValue === "")
        return "";
      if (typeof uiValue === "number" && Number.isFinite(uiValue)) {
        return isIntegerField ? Math.trunc(uiValue) : uiValue;
      }
      return rawValue;
    }
    case "list": {
      const uiValue = field.toUi(raw);
      if (Array.isArray(uiValue)) return uiValue;
      if (typeof uiValue === "string") {
        const parts = uiValue
          .split(",")
          .map((part) => part.trim())
          .filter((part) => part.length > 0);
        return parts;
      }
      if (uiValue == null) return [];
      return Array.isArray(uiValue) ? uiValue : [];
    }
    case "portforward": {
      const uiValue = field.toUi(raw);
      if (Array.isArray(uiValue)) {
        return uiValue as PortForwardRule[];
      }
      return [];
    }
    case "structured": {
      const uiValue = field.toUi(raw);
      if (Array.isArray(uiValue)) {
        return uiValue.filter(isPlainObject) as Array<Record<string, unknown>>;
      }
      if (isPlainObject(uiValue)) {
        return uiValue;
      }
      return [];
    }
    case "ip":
    case "mac":
    case "netmask":
    case "hex": {
      const uiValue = field.toUi(raw);
      if (typeof uiValue === "string") return uiValue;
      if (uiValue == null) return "";
      return String(uiValue);
    }
    case "select":
      return raw ?? "";
    case "textarea":
    case "text":
    default:
      return raw ?? "";
  }
}

function formatDisplay(value: any, controlType: ControlType): string {
  if (value === null || value === undefined) return "";
  if (controlType === "boolean") {
    return value ? "Enabled" : "Disabled";
  }
  return String(value);
}

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function normaliseAnchorBase(key: string) {
  const trimmed = key.trim().toLowerCase();
  const sanitized = trimmed
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (sanitized.length > 0) {
    return sanitized;
  }
  const fallback = Array.from(key)
    .map((char) => char.codePointAt(0)?.toString(16).padStart(2, "0") ?? "00")
    .join("");
  return fallback.slice(0, 64) || "field";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

type StructuredFieldType = "boolean" | "number" | "string";
type StructuredEditorMode = "array" | "object" | "primitive-array";

function inferStructuredFieldType(value: unknown): StructuredFieldType {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number" && Number.isFinite(value)) return "number";
  return "string";
}

function primitiveToStructuredFieldType(
  type: StructuredPrimitiveType,
): StructuredFieldType {
  if (type === "boolean") return "boolean";
  if (type === "number" || type === "integer") return "number";
  return "string";
}

function isStructuredObjectSchemaDefinition(
  schema:
    | StructuredSchema
    | StructuredObjectSchemaDefinition
    | StructuredPrimitiveField
    | undefined,
): schema is StructuredObjectSchemaDefinition {
  return (
    Boolean(schema) &&
    typeof schema === "object" &&
    "kind" in schema &&
    schema.kind === "object"
  );
}

function isStructuredPrimitiveField(
  schema:
    | StructuredSchema
    | StructuredObjectSchemaDefinition
    | StructuredPrimitiveField
    | undefined,
): schema is StructuredPrimitiveField {
  return (
    Boolean(schema) &&
    typeof schema === "object" &&
    "type" in schema &&
    !("kind" in schema)
  );
}

function defaultValueForPrimitiveField(field: StructuredPrimitiveField) {
  if (field.defaultValue !== undefined) return field.defaultValue;
  switch (field.type) {
    case "boolean":
      return false;
    case "string":
      return "";
    case "number":
    case "integer":
    default:
      return undefined;
  }
}

function normaliseRecordWithSchema(
  record: Record<string, unknown> | null | undefined,
  schema: StructuredObjectSchemaDefinition,
): Record<string, unknown> {
  const source = isPlainObject(record) ? record : {};
  const normalised: Record<string, unknown> = {};
  for (const [key, field] of Object.entries(schema.fields)) {
    if (key in source) {
      normalised[key] = (source as Record<string, unknown>)[key];
    } else {
      normalised[key] = defaultValueForPrimitiveField(field);
    }
  }
  for (const [key, value] of Object.entries(
    source as Record<string, unknown>,
  )) {
    if (!(key in schema.fields)) {
      normalised[key] = value;
    }
  }
  return normalised;
}

function detectStructuredMode(
  field: ResolvedField,
  entry: FieldView,
): StructuredEditorMode {
  const schema = field.structuredSchema;
  if (schema) {
    if (schema.kind === "object") {
      return "object";
    }
    if (schema.kind === "array") {
      if (isStructuredObjectSchemaDefinition(schema.items)) {
        return "array";
      }
      if (isStructuredPrimitiveField(schema.items)) {
        return "primitive-array";
      }
    }
  }
  const candidateUiValues: unknown[] = [
    field.toUi(entry.workingRaw),
    field.toUi(entry.leftRaw),
    field.toUi(entry.rightRaw),
  ];

  if (field.defaultRaw !== undefined) {
    candidateUiValues.push(field.toUi(field.defaultRaw));
  }

  for (const candidate of candidateUiValues) {
    if (Array.isArray(candidate)) {
      return "array";
    }
    if (isPlainObject(candidate)) {
      return "object";
    }
  }

  if (
    field.raw &&
    "defaultValue" in field.raw &&
    field.raw.defaultValue !== undefined
  ) {
    const defaultValue = field.raw.defaultValue;
    if (Array.isArray(defaultValue)) return "array";
    if (isPlainObject(defaultValue)) return "object";
  }

  return "array";
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const idx = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / 1024 ** idx;
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${
    units[idx]
  }`;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString();
}

async function loadCfg(file: File): Promise<LoadedConfig> {
  const buffer = await file.arrayBuffer();
  const { entries, header, fileLength, salt } = decodeCfg(buffer);
  const normalised: NvramEntries = {};
  for (const [key, value] of Object.entries(entries)) {
    normalised[key] = value ?? "";
  }
  return {
    id: `${file.name}-${file.size}-${Date.now()}`,
    name: file.name,
    size: file.size,
    header,
    fileLength,
    salt,
    entries: normalised,
    loadedAt: new Date().toISOString(),
  };
}

function initialSelectionForKey(
  key: string,
  leftEntries?: NvramEntries | null,
  rightEntries?: NvramEntries | null,
): SelectionState {
  if (leftEntries && Object.prototype.hasOwnProperty.call(leftEntries, key)) {
    return { option: "left" };
  }
  if (rightEntries && Object.prototype.hasOwnProperty.call(rightEntries, key)) {
    return { option: "remove" };
  }
  return { option: "custom", customRaw: "" };
}

function composeFinalEntries(
  left: LoadedConfig | null,
  right: LoadedConfig | null,
  selections: Record<string, SelectionState>,
): NvramEntries {
  const map = new Map<string, string>();

  if (left) {
    for (const [key, value] of Object.entries(left.entries)) {
      map.set(key, value);
    }
  }

  for (const [key, state] of Object.entries(selections)) {
    switch (state.option) {
      case "left": {
        const leftValue = left?.entries[key];
        if (leftValue !== undefined) {
          map.set(key, leftValue);
        } else {
          map.delete(key);
        }
        break;
      }
      case "right": {
        const rightValue = right?.entries[key];
        if (rightValue !== undefined) {
          map.set(key, rightValue);
        } else {
          map.delete(key);
        }
        break;
      }
      case "custom": {
        map.set(key, state.customRaw ?? "");
        break;
      }
      case "remove": {
        map.delete(key);
        break;
      }
      default:
        break;
    }
  }

  const result: NvramEntries = {};
  for (const [key, value] of map.entries()) {
    result[key] = value;
  }
  return result;
}

function escapeForShell(value: string): string {
  return value.replace(/'/g, "'\"'\"'");
}

function generateNvramScript(
  entries: NvramEntries,
  diffToLeft: DiffEntry[],
): string {
  const lines: string[] = [];
  for (const entry of diffToLeft) {
    if (entry.status === "same") continue;
    if (entry.status === "removed") {
      lines.push(`nvram unset ${entry.key}`);
      continue;
    }
    const value = entries[entry.key];
    if (value === undefined) continue;
    lines.push(`nvram set ${entry.key}='${escapeForShell(value)}'`);
  }
  if (lines.length > 0) {
    lines.push("nvram commit");
  }
  return lines.join("\n");
}

function buildRouterHref(
  ipAddress: string,
  pagePath: string,
  username: string,
  password: string | null,
): string {
  const normalisedPath = pagePath.replace(/^\//, "");
  const credentials = password
    ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
    : "";
  return `http://${credentials}${ipAddress}/${normalisedPath}`;
}

function compareOrder(a: number, b: number): number {
  if (a === b) return 0;
  if (a === Number.POSITIVE_INFINITY) return 1;
  if (b === Number.POSITIVE_INFINITY) return -1;
  return a - b;
}

function fallbackField(key: string): ResolvedField {
  const label = labelFromKey(key);
  return {
    key,
    page: UNCATEGORISED_PAGE_ID,
    label,
    description:
      "No catalog metadata available for this key. Displaying raw value.",
    type: "string",
    defaultRaw: undefined,
    transform: undefined,
    validation: undefined,
    options: undefined,
    patternParams: undefined,
    raw: null,
    sourceName: key,
    toUi: (rawValue) => rawValue ?? "",
    fromUi: (uiValue) => (uiValue == null ? "" : String(uiValue)),
  };
}

const UNCATEGORISED_PAGE_LABEL = "Uncatalogued Keys";

type UncataloguedCategory = "onlyLeft" | "onlyRight" | "other" | "custom";

const UNCATEGORISED_VARIANTS: Record<
  UncataloguedCategory,
  { id: string; title: string; order: number }
> = {
  onlyLeft: {
    id: "__uncatalogued__only_left",
    title: "uncatalogued-only-left",
    order: 0,
  },
  onlyRight: {
    id: "__uncatalogued__only_right",
    title: "uncatalogued-only-right",
    order: 1,
  },
  other: {
    id: "__uncatalogued__other",
    title: "uncatalogued-other",
    order: 2,
  },
  custom: {
    id: "__uncatalogued__custom",
    title: "uncatalogued-custom",
    order: 3,
  },
};

const UNCATALOGUED_VARIANT_BY_ID = new Map(
  Object.values(UNCATEGORISED_VARIANTS).map((variant) => [variant.id, variant]),
);

export function App() {
  const [themePreference, setThemePreference] = useState<ThemePreference>(
    () => {
      if (typeof window === "undefined") return "system";
      const stored = window.localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY);
      return stored === "light" || stored === "dark" ? stored : "system";
    },
  );
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [leftConfig, setLeftConfig] = useState<LoadedConfig | null>(null);
  const [rightConfig, setRightConfig] = useState<LoadedConfig | null>(null);
  const [selections, setSelections] = useState<Record<string, SelectionState>>(
    {},
  );
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("different");
  const [focusPending, setFocusPending] = useState(false);
  const [showRawValues, setShowRawValues] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScript, setShowScript] = useState(false);
  const [forcedVisibleKey, setForcedVisibleKey] = useState<string | null>(null);
  const [pendingScroll, setPendingScroll] = useState<{
    key: string;
    behavior: ScrollBehavior;
  } | null>(null);
  const [activeAnchorKey, setActiveAnchorKey] = useState<string | null>(null);
  const manualHashNavigationRef = useRef<string | null>(null);
  const handledInitialHashRef = useRef(false);
  const resolvedTheme = useMemo<"light" | "dark">(
    () =>
      themePreference === "system"
        ? systemPrefersDark
          ? "dark"
          : "light"
        : themePreference,
    [systemPrefersDark, themePreference],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };
    setSystemPrefersDark(media.matches);
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange);
      return () => {
        media.removeEventListener("change", handleChange);
      };
    }
    media.addListener(handleChange);
    return () => {
      media.removeListener(handleChange);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const shouldUseDark =
      themePreference === "dark" ||
      (themePreference === "system" && systemPrefersDark);
    root.classList.toggle("dark", shouldUseDark);
    root.dataset.theme = themePreference;
  }, [systemPrefersDark, themePreference]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (themePreference === "system") {
      window.localStorage.removeItem(THEME_PREFERENCE_STORAGE_KEY);
    } else {
      window.localStorage.setItem(
        THEME_PREFERENCE_STORAGE_KEY,
        themePreference,
      );
    }
  }, [themePreference]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedPrimary = localStorage.getItem(PRIMARY_STORAGE_KEY);
      if (storedPrimary) {
        const parsedPrimary = parseStoredConfig(storedPrimary);
        if (parsedPrimary) {
          setLeftConfig(parsedPrimary);
        }
      }
    } catch (restoreError) {
      console.warn(
        "Failed to restore primary configuration from storage",
        restoreError,
      );
    }

    try {
      const storedComparison = localStorage.getItem(COMPARISON_STORAGE_KEY);
      if (storedComparison) {
        const parsedComparison = parseStoredConfig(storedComparison);
        if (parsedComparison) {
          setRightConfig(parsedComparison);
        }
      }
    } catch (restoreError) {
      console.warn(
        "Failed to restore comparison configuration from storage",
        restoreError,
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (leftConfig) {
        localStorage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(leftConfig));
      } else {
        localStorage.removeItem(PRIMARY_STORAGE_KEY);
      }
    } catch (persistError) {
      console.warn("Failed to persist primary configuration", persistError);
    }
  }, [leftConfig]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (rightConfig) {
        localStorage.setItem(
          COMPARISON_STORAGE_KEY,
          JSON.stringify(rightConfig),
        );
      } else {
        localStorage.removeItem(COMPARISON_STORAGE_KEY);
      }
    } catch (persistError) {
      console.warn("Failed to persist comparison configuration", persistError);
    }
  }, [rightConfig]);

  const handleLoad = useCallback(async (file: File, side: "left" | "right") => {
    try {
      const config = await loadCfg(file);
      if (side === "left") {
        setLeftConfig(config);
        setActivePageId(null);
      } else {
        setRightConfig(config);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to parse .cfg file.",
      );
    }
  }, []);

  const handleClear = useCallback(
    (side: "left" | "right") => {
      if (side === "left") {
        if (rightConfig) {
          const promoted = rightConfig;
          setLeftConfig(promoted);
          setRightConfig(null);
        } else {
          setLeftConfig(null);
        }
        setSelections({});
        setActivePageId(null);
      } else {
        setRightConfig(null);
      }
    },
    [rightConfig],
  );

  const handleSwap = useCallback(() => {
    if (!leftConfig || !rightConfig) return;
    setLeftConfig(rightConfig);
    setRightConfig(leftConfig);
    setSelections({});
    setActivePageId(null);
  }, [leftConfig, rightConfig]);

  const handleCycleThemePreference = useCallback(() => {
    setThemePreference((current) => {
      if (current === "system") return "light";
      if (current === "light") return "dark";
      return "system";
    });
  }, []);

  useEffect(() => {
    const leftEntries = leftConfig?.entries ?? null;
    const rightEntries = rightConfig?.entries ?? null;
    setSelections((prev) => {
      const keys = new Set<string>();
      if (leftEntries) {
        for (const key of Object.keys(leftEntries)) keys.add(key);
      }
      if (rightEntries) {
        for (const key of Object.keys(rightEntries)) keys.add(key);
      }
      for (const key of Object.keys(prev)) {
        keys.add(key);
      }

      const next: Record<string, SelectionState> = {};
      let changed = false;

      for (const key of keys) {
        const prevState = prev[key];
        const leftHas = leftEntries
          ? Object.prototype.hasOwnProperty.call(leftEntries, key)
          : false;
        const rightHas = rightEntries
          ? Object.prototype.hasOwnProperty.call(rightEntries, key)
          : false;

        if (!prevState) {
          next[key] = initialSelectionForKey(key, leftEntries, rightEntries);
          changed = true;
          continue;
        }

        let nextState = prevState;
        if (prevState.option === "right" && !rightHas) {
          if (leftHas) {
            nextState = { option: "left" };
          } else if (prevState.customRaw !== undefined) {
            nextState = { option: "custom", customRaw: prevState.customRaw };
          } else {
            nextState = { option: "remove" };
          }
        }

        if (prevState.option === "left" && !leftHas) {
          if (rightHas) {
            nextState = { option: "remove" };
          } else if (prevState.customRaw !== undefined) {
            nextState = { option: "custom", customRaw: prevState.customRaw };
          } else {
            nextState = { option: "remove" };
          }
        }

        next[key] = nextState;
        if (nextState !== prevState) {
          changed = true;
        }
      }

      if (!changed && Object.keys(prev).length === Object.keys(next).length) {
        return prev;
      }
      return next;
    });
  }, [leftConfig?.id, rightConfig?.id]);

  const finalEntries = useMemo(
    () => composeFinalEntries(leftConfig, rightConfig, selections),
    [leftConfig, rightConfig, selections],
  );

  const leftEntries = leftConfig?.entries ?? null;
  const rightEntries = rightConfig?.entries ?? null;

  const leftLanIpRaw = leftEntries?.["lan_ipaddr"];
  const rightLanIpRaw = rightEntries?.["lan_ipaddr"];
  const leftLanIp =
    leftLanIpRaw && leftLanIpRaw.trim() !== "" ? leftLanIpRaw.trim() : null;
  const rightLanIp =
    rightLanIpRaw && rightLanIpRaw.trim() !== "" ? rightLanIpRaw.trim() : null;

  const leftHttpUsernameRaw = leftEntries?.["http_username"];
  const rightHttpUsernameRaw = rightEntries?.["http_username"];
  const leftHttpPasswordRaw = leftEntries?.["http_passwd"];
  const rightHttpPasswordRaw = rightEntries?.["http_passwd"];

  const leftHttpUsername =
    leftHttpUsernameRaw && leftHttpUsernameRaw.trim() !== ""
      ? leftHttpUsernameRaw.trim()
      : "root";
  const rightHttpUsername =
    rightHttpUsernameRaw && rightHttpUsernameRaw.trim() !== ""
      ? rightHttpUsernameRaw.trim()
      : "root";
  const leftHttpPassword =
    leftHttpPasswordRaw && leftHttpPasswordRaw.trim() !== ""
      ? leftHttpPasswordRaw.trim()
      : null;
  const rightHttpPassword =
    rightHttpPasswordRaw && rightHttpPasswordRaw.trim() !== ""
      ? rightHttpPasswordRaw.trim()
      : null;

  const diffLeftRight = useMemo(() => {
    if (!leftEntries) {
      return computeDiff(null, null);
    }
    if (!rightConfig) {
      return computeDiff(leftEntries, leftEntries);
    }
    return computeDiff(leftEntries, rightEntries);
  }, [leftEntries, rightEntries, rightConfig?.id]);

  const diffLeftFinal = useMemo(
    () =>
      computeDiff(
        leftEntries,
        Object.keys(finalEntries).length ? finalEntries : null,
      ),
    [leftEntries, finalEntries],
  );

  const allKeys = useMemo(() => {
    const keys = new Set<string>();
    if (leftEntries) {
      for (const key of Object.keys(leftEntries)) keys.add(key);
    }
    if (rightEntries) {
      for (const key of Object.keys(rightEntries)) keys.add(key);
    }
    for (const key of Object.keys(finalEntries)) keys.add(key);
    for (const key of Object.keys(selections)) keys.add(key);
    return Array.from(keys).sort();
  }, [leftEntries, rightEntries, finalEntries, selections]);

  const { anchorByKey, keyByAnchor } = useMemo(() => {
    const anchorByKeyMap = new Map<string, string>();
    const keyByAnchorMap = new Map<string, string>();
    const counts = new Map<string, number>();
    for (const key of allKeys) {
      const base = normaliseAnchorBase(key);
      const currentCount = counts.get(base) ?? 0;
      counts.set(base, currentCount + 1);
      const suffix = currentCount === 0 ? "" : `-${currentCount + 1}`;
      const anchorId = `field-${base}${suffix}`;
      anchorByKeyMap.set(key, anchorId);
      keyByAnchorMap.set(anchorId, key);
    }
    return { anchorByKey: anchorByKeyMap, keyByAnchor: keyByAnchorMap };
  }, [allKeys]);

  const fieldViews = useMemo(() => {
    const pages = new Map<string, FieldView[]>();
    for (const key of allKeys) {
      const resolved = resolveField(key) ?? fallbackField(key);
      let pageId = resolved.page ?? UNCATEGORISED_PAGE_ID;

      const diff = diffLeftRight.byKey.get(key) ?? {
        key,
        left: leftEntries?.[key],
        right: rightEntries?.[key],
        status: "same" as DiffStatus,
      };

      const fallbackFinalStatus: DiffStatus =
        finalEntries[key] === undefined && leftEntries?.[key] === undefined
          ? "same"
          : leftEntries?.[key] === finalEntries[key]
          ? "same"
          : finalEntries[key] === undefined
          ? "removed"
          : leftEntries?.[key] === undefined
          ? "added"
          : "different";

      const finalDiff = diffLeftFinal.byKey.get(key) ?? {
        key,
        left: leftEntries?.[key],
        right: finalEntries[key],
        status: fallbackFinalStatus,
      };

      const leftRaw = leftEntries?.[key];
      const rightRaw = rightEntries?.[key];
      const workingRaw = finalEntries[key];
      const selectionState = selections[key];

      let originCategory: FieldView["originCategory"];
      if (pageId === UNCATEGORISED_PAGE_ID) {
        const isCustomEntry =
          !!selectionState &&
          leftRaw === undefined &&
          rightRaw === undefined &&
          resolved.raw === null;
        if (isCustomEntry) {
          originCategory = "custom";
        } else if (leftRaw !== undefined && rightRaw === undefined) {
          originCategory = "onlyLeft";
        } else if (rightRaw !== undefined && leftRaw === undefined) {
          originCategory = "onlyRight";
        } else {
          originCategory = "other";
        }
        originCategory = originCategory ?? "other";
        pageId = UNCATEGORISED_VARIANTS[originCategory].id;
      }

      const entry: FieldView = {
        key,
        field: resolved,
        leftRaw,
        rightRaw,
        workingRaw,
        diff,
        finalDiff,
        selection: selectionState,
        originCategory,
      };

      if (!pages.has(pageId)) {
        pages.set(pageId, []);
      }
      pages.get(pageId)!.push(entry);
    }

    for (const list of pages.values()) {
      list.sort((a, b) => a.key.localeCompare(b.key));
    }

    return pages;
  }, [
    allKeys,
    diffLeftRight,
    diffLeftFinal,
    finalEntries,
    leftEntries,
    rightEntries,
    selections,
  ]);

  const keyToPageId = useMemo(() => {
    const map = new Map<string, string>();
    for (const [pageId, entries] of fieldViews.entries()) {
      for (const entry of entries) {
        map.set(entry.key, pageId);
      }
    }
    return map;
  }, [fieldViews]);

  const [showEmptyPages, setShowEmptyPages] = useState(false);

  const filteredPages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const result: Array<{
      id: string;
      title: string;
      displayTitle: string;
      entries: FieldView[];
      totalCount: number;
      pendingCount: number;
      groupKey: string;
      groupLabel: string;
      hasMatches: boolean;
      sortOrder: number;
      groupOrder: number;
      pageOrder: number;
    }> = [];

    const dynamicGroupOrder = new Map<string, number>();
    const assignFallbackGroupOrder = (groupKey: string) => {
      if (groupKey === UNCATALOGUED_GROUP_KEY) {
        return UNCATALOGUED_GROUP_ORDER;
      }
      if (!dynamicGroupOrder.has(groupKey)) {
        dynamicGroupOrder.set(
          groupKey,
          PREFERRED_MENU_STRUCTURE.length + dynamicGroupOrder.size,
        );
      }
      return dynamicGroupOrder.get(groupKey)!;
    };

    for (const [pageId, entries] of fieldViews.entries()) {
      const variantMeta = UNCATALOGUED_VARIANT_BY_ID.get(pageId);
      const baseTitle = variantMeta
        ? variantMeta.title
        : pageId === UNCATEGORISED_PAGE_ID
        ? UNCATEGORISED_PAGE_LABEL
        : prettifyPageId(pageId);
      const totalCount = entries.length;

      if (totalCount === 0) {
        continue;
      }

      const pendingCount = entries.reduce(
        (count, entry) => count + (entry.finalDiff.status !== "same" ? 1 : 0),
        0,
      );
      const preferredMeta = getPageDisplayMeta(pageId);

      let groupKey: string;
      let groupLabel: string;
      let groupOrder: number;
      let pageOrder: number;
      let title = (preferredMeta?.pageLabel ?? baseTitle).trim();

      if (
        pageId === UNCATEGORISED_PAGE_ID ||
        UNCATALOGUED_VARIANT_BY_ID.has(pageId)
      ) {
        groupKey = UNCATALOGUED_GROUP_KEY;
        groupLabel = UNCATALOGUED_GROUP_LABEL;
        groupOrder = UNCATALOGUED_GROUP_ORDER;
        pageOrder = variantMeta?.order ?? Number.POSITIVE_INFINITY;
      } else if (preferredMeta) {
        groupKey = preferredMeta.groupKey;
        groupLabel = preferredMeta.groupLabel;
        groupOrder = preferredMeta.groupOrder;
        pageOrder = preferredMeta.pageOrder;
      } else {
        const pageIdBase = pageId
          .replace(/\.asp(?:\.html)?$/i, "")
          .toLowerCase();
        const [primarySegment] = pageIdBase.split("-");
        const fallbackGroupKey = primarySegment || "other";
        const normalisedFallbackKey =
          fallbackGroupKey && fallbackGroupKey.trim() !== ""
            ? fallbackGroupKey
            : "other";
        const fallbackGroupMeta = getGroupDisplayMeta(normalisedFallbackKey);
        groupKey = fallbackGroupMeta
          ? normalisedFallbackKey
          : normalisedFallbackKey;
        const fallbackLabel =
          normalisedFallbackKey
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
            .trim() || "Other";
        groupLabel = fallbackGroupMeta?.label ?? fallbackLabel;
        groupOrder =
          fallbackGroupMeta?.order ?? assignFallbackGroupOrder(groupKey);
        pageOrder = Number.POSITIVE_INFINITY;
      }

      const filtered = entries.filter((entry) => {
        const isForced = forcedVisibleKey === entry.key;

        if (!isForced) {
          const matchesQuery =
            !query ||
            entry.key.toLowerCase().includes(query) ||
            entry.field.label.toLowerCase().includes(query) ||
            entry.field.description.toLowerCase().includes(query) ||
            (entry.leftRaw
              ? entry.leftRaw.toLowerCase().includes(query)
              : false) ||
            (entry.rightRaw
              ? entry.rightRaw.toLowerCase().includes(query)
              : false);

          if (!matchesQuery) return false;

          const filterMatches =
            diffFilter === "all" ? true : entry.diff.status === diffFilter;

          if (!filterMatches) return false;

          if (focusPending) {
            return entry.finalDiff.status !== "same";
          }
        }

        return true;
      });

      let displayTitle = title;
      if (groupKey === UNCATALOGUED_GROUP_KEY) {
        displayTitle =
          title
            .replace(/^uncatalogued[-_]?/i, "")
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
            .trim() || title;
      }
      const sortOrder =
        variantMeta?.order ?? pageOrder ?? Number.POSITIVE_INFINITY;
      const hasMatches = filtered.length > 0;

      if (hasMatches || pageId === activePageId || showEmptyPages) {
        result.push({
          id: pageId,
          title,
          displayTitle: displayTitle || title,
          entries: filtered,
          totalCount,
          pendingCount,
          groupKey,
          groupLabel,
          hasMatches,
          sortOrder,
          groupOrder,
          pageOrder,
        });
      }
    }

    result.sort((a, b) => {
      const groupCompare = compareOrder(a.groupOrder, b.groupOrder);
      if (groupCompare !== 0) {
        return groupCompare;
      }
      const pageCompare = compareOrder(a.pageOrder, b.pageOrder);
      if (pageCompare !== 0) {
        return pageCompare;
      }
      const sortCompare = compareOrder(a.sortOrder, b.sortOrder);
      if (sortCompare !== 0) {
        return sortCompare;
      }
      return a.title.localeCompare(b.title);
    });
    return result;
  }, [
    activePageId,
    diffFilter,
    fieldViews,
    focusPending,
    forcedVisibleKey,
    searchTerm,
    showEmptyPages,
  ]);

  const groupedPages = useMemo(() => {
    const groups = new Map<
      string,
      {
        key: string;
        label: string;
        pages: Array<(typeof filteredPages)[number]>;
        order: number;
      }
    >();
    for (const page of filteredPages) {
      if (!groups.has(page.groupKey)) {
        groups.set(page.groupKey, {
          key: page.groupKey,
          label: page.groupLabel,
          pages: [],
          order: page.groupOrder,
        });
      }
      groups.get(page.groupKey)!.pages.push(page);
    }
    for (const group of groups.values()) {
      group.pages.sort((a, b) => {
        const pageCompare = compareOrder(a.pageOrder, b.pageOrder);
        if (pageCompare !== 0) {
          return pageCompare;
        }
        const sortCompare = compareOrder(a.sortOrder, b.sortOrder);
        if (sortCompare !== 0) {
          return sortCompare;
        }
        return a.title.localeCompare(b.title);
      });
    }
    return Array.from(groups.values()).sort((a, b) => {
      const groupCompare = compareOrder(a.order, b.order);
      if (groupCompare !== 0) {
        return groupCompare;
      }
      return a.label.localeCompare(b.label);
    });
  }, [filteredPages]);

  const selectedPage = activePageId
    ? filteredPages.find((page) => page.id === activePageId) ?? null
    : filteredPages[0] ?? null;

  const visibleEntries = useMemo(
    () => selectedPage?.entries ?? [],
    [selectedPage],
  );

  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    setCollapsedGroups((prev) => {
      const next: Record<string, boolean> = {};
      for (const group of groupedPages) {
        const hasActive = group.pages.some(
          (page) => page.id === (selectedPage?.id ?? null),
        );
        if (hasActive) {
          next[group.key] = false;
        } else {
          next[group.key] = prev[group.key] ?? true;
        }
      }
      return next;
    });
  }, [groupedPages, selectedPage?.id]);

  const toggleGroup = useCallback((groupKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  }, []);

  useEffect(() => {
    if (activePageId) {
      const exists = filteredPages.some((page) => page.id === activePageId);
      if (!exists) {
        setActivePageId(filteredPages[0]?.id ?? null);
      }
    } else if (filteredPages.length > 0) {
      setActivePageId(filteredPages[0]!.id);
    }
  }, [activePageId, filteredPages]);

  const totalPending = diffLeftFinal.entries.filter(
    (entry) => entry.status !== "same",
  ).length;

  const scriptText = useMemo(
    () => generateNvramScript(finalEntries, diffLeftFinal.entries),
    [diffLeftFinal.entries, finalEntries],
  );

  const navigateToField = useCallback(
    (fieldKey: string, options?: NavigateToFieldOptions) => {
      const anchorId = anchorByKey.get(fieldKey);
      if (!anchorId) return;
      const preserveFilters = options?.preserveFilters ?? false;
      const behavior: ScrollBehavior = options?.behavior ?? "smooth";

      if (!preserveFilters) {
        setSearchTerm((prev) => (prev === "" ? prev : ""));
        setDiffFilter((prev) => (prev === "all" ? prev : "all"));
        setFocusPending((prev) => (prev ? false : prev));
        setForcedVisibleKey(fieldKey);
      }

      const pageId = keyToPageId.get(fieldKey);
      if (pageId) {
        setActivePageId((prev) => (prev === pageId ? prev : pageId));
      }

      setPendingScroll({ key: fieldKey, behavior });
      setActiveAnchorKey(fieldKey);

      if (options?.updateHash !== false && typeof window !== "undefined") {
        manualHashNavigationRef.current = anchorId;
        if (window.location.hash.slice(1) !== anchorId) {
          window.location.hash = anchorId;
        } else {
          window.history.replaceState(null, "", `#${anchorId}`);
        }
      }
    },
    [
      anchorByKey,
      keyToPageId,
      setActivePageId,
      setDiffFilter,
      setFocusPending,
      setPendingScroll,
      setSearchTerm,
    ],
  );

  const handleUpdateSelection = useCallback(
    (key: string, state: SelectionState) => {
      setSelections((prev) => {
        const previous = prev[key];
        let nextState: SelectionState = state;

        if (state.option === "custom") {
          const customValue = state.customRaw ?? "";
          const leftValue = leftEntries?.[key];
          const rightValue = rightEntries?.[key];
          const matchesLeft =
            leftValue !== undefined && customValue === leftValue;
          const matchesRight =
            rightValue !== undefined && customValue === rightValue;

          if (matchesLeft && matchesRight) {
            nextState =
              previous?.option === "right"
                ? { option: "right" }
                : { option: "left" };
          } else if (matchesLeft) {
            nextState = { option: "left" };
          } else if (matchesRight) {
            nextState = { option: "right" };
          }
        }

        if (
          previous &&
          previous.option === nextState.option &&
          previous.customRaw === nextState.customRaw
        ) {
          return prev;
        }

        return {
          ...prev,
          [key]: nextState,
        };
      });
    },
    [leftEntries, rightEntries],
  );

  const handleUndoPending = useCallback(
    (key: string) => {
      setSelections((prev) => {
        const leftHas = leftEntries
          ? Object.prototype.hasOwnProperty.call(leftEntries, key)
          : false;
        const rightHas = rightEntries
          ? Object.prototype.hasOwnProperty.call(rightEntries, key)
          : false;

        if (!leftHas && !rightHas) {
          if (!Object.prototype.hasOwnProperty.call(prev, key)) {
            return prev;
          }
          const next = { ...prev };
          delete next[key];
          return next;
        }

        const baseline = initialSelectionForKey(key, leftEntries, rightEntries);
        const prevState = prev[key];

        if (
          prevState &&
          prevState.option === baseline.option &&
          prevState.customRaw === baseline.customRaw
        ) {
          return prev;
        }

        return {
          ...prev,
          [key]: baseline,
        };
      });
    },
    [leftEntries, rightEntries],
  );

  const handleRemoveCustomKey = useCallback((key: string) => {
    setSelections((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleAddCustomKey = useCallback(() => {
    const name = prompt("Enter the NVRAM key name");
    if (!name) return;
    if (selections[name] || finalEntries[name] !== undefined) {
      alert("Key already exists.");
      return;
    }
    setSelections((prev) => ({
      ...prev,
      [name]: { option: "custom", customRaw: "" },
    }));
    setActivePageId(UNCATEGORISED_VARIANTS.custom.id);
  }, [finalEntries, selections]);

  const handleDownloadCfg = useCallback(
    (format: "HDR1" | "HDR2") => {
      const bytes = encodeCfg(Object.entries(finalEntries), {
        format,
      });
      const blob = new Blob([bytes], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const name =
        leftConfig?.name.replace(/\.cfg$/i, "") ??
        rightConfig?.name.replace(/\.cfg$/i, "") ??
        "nvram-export";
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:T]/g, "")
        .slice(0, 14);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}-${timestamp}.cfg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [finalEntries, leftConfig?.name, rightConfig?.name],
  );

  const handleExportJson = useCallback(() => {
    const sortedEntries = Object.keys(finalEntries)
      .sort()
      .reduce<Record<string, string>>((acc, key) => {
        const value = finalEntries[key];
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});
    const blob = new Blob([JSON.stringify(sortedEntries, null, 2)], {
      type: "application/json",
    });
    const name =
      leftConfig?.name.replace(/\.cfg$/i, "") ??
      rightConfig?.name.replace(/\.cfg$/i, "") ??
      "nvram-export";
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T]/g, "")
      .slice(0, 14);
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `${name}-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [finalEntries, leftConfig?.name, rightConfig?.name]);

  const handleCopyScript = useCallback(async () => {
    await navigator.clipboard.writeText(scriptText);
  }, [scriptText]);

  const handleCopyVisibleKeys = useCallback(async () => {
    const text = visibleEntries.map((entry) => entry.key).join("\n");
    await navigator.clipboard.writeText(text);
  }, [visibleEntries]);

  const handleCopyVisiblePairs = useCallback(async () => {
    const lines = visibleEntries.map((entry) => {
      const value = finalEntries[entry.key] ?? "";
      return `${entry.key}=${value}`;
    });
    await navigator.clipboard.writeText(lines.join("\n"));
  }, [finalEntries, visibleEntries]);

  useEffect(() => {
    if (!pendingScroll) return;
    if (typeof window === "undefined") return;
    const targetKey = pendingScroll.key;
    const behavior = pendingScroll.behavior;
    const anchorId = anchorByKey.get(targetKey);
    if (!anchorId) {
      setPendingScroll(null);
      setForcedVisibleKey((current) =>
        current === targetKey ? null : current,
      );
      return;
    }
    let attempts = 0;
    let cancelled = false;
    let timeoutId: number | null = null;

    const attempt = () => {
      if (cancelled) return;
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({
          behavior,
          block: "start",
          inline: "nearest",
        });
        setPendingScroll(null);
        if (forcedVisibleKey === targetKey) {
          timeoutId = window.setTimeout(() => {
            setForcedVisibleKey((current) =>
              current === targetKey ? null : current,
            );
          }, 500);
        }
        return;
      }
      if (attempts < 40) {
        attempts += 1;
        window.requestAnimationFrame(attempt);
      } else {
        setPendingScroll(null);
        setForcedVisibleKey((current) =>
          current === targetKey ? null : current,
        );
      }
    };

    window.requestAnimationFrame(attempt);

    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [anchorByKey, forcedVisibleKey, pendingScroll]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (manualHashNavigationRef.current === hash) {
        manualHashNavigationRef.current = null;
        return;
      }
      manualHashNavigationRef.current = null;
      if (!hash) {
        setActiveAnchorKey(null);
        return;
      }
      const targetKey = keyByAnchor.get(hash);
      if (!targetKey) return;
      navigateToField(targetKey, { updateHash: false });
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [keyByAnchor, navigateToField]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (handledInitialHashRef.current) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const targetKey = keyByAnchor.get(hash);
    if (!targetKey) return;
    handledInitialHashRef.current = true;
    navigateToField(targetKey, { updateHash: false, behavior: "auto" });
  }, [keyByAnchor, navigateToField]);

  const summaryCards = [
    {
      label: "Different",
      value: diffLeftRight.counts.different,
      tone: "text-amber-600 dark:text-amber-300",
    },
    {
      label: "Added",
      value: diffLeftRight.counts.added,
      tone: "text-emerald-600 dark:text-emerald-300",
    },
    {
      label: "Removed",
      value: diffLeftRight.counts.removed,
      tone: "text-rose-600 dark:text-rose-300",
    },
    {
      label: "Pending edits",
      value: totalPending,
      tone: "text-sky-600 dark:text-sky-300",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-900 dark:bg-slate-950/80 dark:supports-[backdrop-filter]:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                🍅 FreshTomato Config Compare and Edit
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Inspect, compare, and craft configuration backups visually. Runs
                fully locally, in your browser, so your config files never leave
                your computer. Start by dropping a FreshTomato Router{" "}
                <code className="rounded bg-slate-200 px-2 py-1 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                  .cfg
                </code>{" "}
                file.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-4 sm:items-end">
              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                <ThemeToggle
                  preference={themePreference}
                  resolvedTheme={resolvedTheme}
                  onCycle={handleCycleThemePreference}
                />
                <a
                  href="https://github.com/niieani/freshtomato-config-compare-and-edit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <GitHubIcon className="h-4 w-4" />
                  View on GitHub
                </a>
                <a
                  href="https://github.com/sponsors/niieani?o=esb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/70"
                >
                  Sponsor @niieani
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {summaryCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <div
                      className={classNames("text-lg font-semibold", card.tone)}
                    >
                      {card.value}
                    </div>
                    <div className="text-[12px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {card.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
            <DropZoneCard
              side="left"
              title="Primary configuration"
              subtitle="Drag & drop or click to choose the baseline router backup."
              disabled={false}
              config={leftConfig}
              onFile={(file) => handleLoad(file, "left")}
              onClear={() => handleClear("left")}
            />
            <SwapButton
              disabled={!leftConfig || !rightConfig}
              onSwap={handleSwap}
            />
            <DropZoneCard
              side="right"
              title="Comparison snapshot"
              subtitle={
                leftConfig
                  ? "Optional: drop another backup to explore differences side-by-side."
                  : "Load the primary configuration first to enable comparisons."
              }
              disabled={!leftConfig}
              config={rightConfig}
              onFile={(file) => handleLoad(file, "right")}
              onClear={() => handleClear("right")}
            />
          </div>
          {error ? (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-slate-100/80 backdrop-blur supports-[backdrop-filter]:bg-slate-100/60 dark:border-slate-900 dark:bg-slate-950/60 dark:supports-[backdrop-filter]:bg-slate-950/50 md:flex md:flex-col">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Pages
              </span>
              <button
                type="button"
                onClick={() => setShowEmptyPages((prev) => !prev)}
                className={classNames(
                  "inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 text-slate-500 transition hover:border-slate-400 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200",
                  showEmptyPages
                    ? "border-sky-500/50 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                    : "",
                )}
                aria-pressed={showEmptyPages}
                title={showEmptyPages ? "Hide empty pages" : "Show empty pages"}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 6h12" />
                  <path d="M4 10h12" />
                  <path d="M4 14h8" />
                  <circle
                    cx="15"
                    cy="14"
                    r="1.2"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
                <span className="sr-only">
                  {showEmptyPages ? "Hide empty pages" : "Show empty pages"}
                </span>
              </button>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {groupedPages.map((group) => {
              const collapsed = collapsedGroups[group.key] ?? false;
              const activeInGroup = group.pages.some(
                (page) => page.id === (selectedPage?.id ?? null),
              );
              return (
                <div key={group.key} className="pb-2">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.key)}
                    className={classNames(
                      "flex w-full items-center justify-between px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide transition",
                      activeInGroup
                        ? "text-slate-900 dark:text-slate-200"
                        : "text-slate-600 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300",
                    )}
                  >
                    <span>{group.label}</span>
                    <svg
                      className={classNames(
                        "h-4 w-4 transition-transform",
                        collapsed ? "-rotate-90" : "rotate-0",
                      )}
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </button>
                  <div
                    className={classNames(
                      "space-y-0.5",
                      collapsed ? "hidden" : "block",
                    )}
                  >
                    {group.pages.map((page) => {
                      const isActive = page.id === (selectedPage?.id ?? null);
                      const pagePath = page.id.endsWith(".asp")
                        ? page.id
                        : null;
                      const pageTitle = page.displayTitle || page.title;

                      const externalLinks: JSX.Element[] = [];
                      if (pagePath) {
                        const sharedLan =
                          leftLanIp && rightLanIp && leftLanIp === rightLanIp
                            ? leftLanIp
                            : null;
                        if (sharedLan) {
                          const sharedPassword =
                            leftHttpPassword ?? rightHttpPassword ?? null;
                          const sharedUsername =
                            leftHttpPassword != null
                              ? leftHttpUsername
                              : rightHttpPassword != null
                              ? rightHttpUsername
                              : leftHttpUsername;
                          const sharedHref = buildRouterHref(
                            sharedLan,
                            pagePath,
                            sharedUsername,
                            sharedPassword,
                          );
                          externalLinks.push(
                            <PageExternalLink
                              key="shared"
                              href={sharedHref}
                              title={`Open ${pageTitle} (${sharedLan})`}
                              variant="shared"
                            />,
                          );
                        } else {
                          if (leftLanIp) {
                            const href = buildRouterHref(
                              leftLanIp,
                              pagePath,
                              leftHttpUsername,
                              leftHttpPassword,
                            );
                            externalLinks.push(
                              <PageExternalLink
                                key="left"
                                href={href}
                                title={`Open ${pageTitle} on left router (${leftLanIp})`}
                                variant="left"
                              />,
                            );
                          }
                          if (rightLanIp) {
                            const href = buildRouterHref(
                              rightLanIp,
                              pagePath,
                              rightHttpUsername,
                              rightHttpPassword,
                            );
                            externalLinks.push(
                              <PageExternalLink
                                key="right"
                                href={href}
                                title={`Open ${pageTitle} on right router (${rightLanIp})`}
                                variant="right"
                              />,
                            );
                          }
                        }
                      }

                      return (
                        <div
                          key={page.id}
                          className={classNames(
                            "group flex w-full items-center gap-2 rounded-lg py-2 pl-6 pr-4 text-[13px] transition",
                            isActive
                              ? "bg-slate-200 text-slate-900 dark:bg-slate-900/80 dark:text-white"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/40 dark:hover:text-slate-200",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => setActivePageId(page.id)}
                            className="flex flex-1 items-center justify-between gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
                          >
                            <span className="flex-1 truncate">
                              {page.displayTitle}
                            </span>
                            <span className="flex items-center gap-1">
                              {page.pendingCount > 0 ? (
                                <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-amber-100 px-2 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                                  {page.pendingCount}
                                </span>
                              ) : null}
                              <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-sky-100 px-2 text-xs text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                                {page.totalCount}
                              </span>
                            </span>
                          </button>
                          {externalLinks.length > 0 ? (
                            <div className="flex items-center gap-1">
                              {externalLinks}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {filteredPages.length === 0 ? (
              <div className="px-4 py-8 text-sm text-slate-600 dark:text-slate-500">
                No pages match the filters.
              </div>
            ) : null}
          </nav>
          <div className="border-t border-slate-200 p-4 text-xs text-slate-600 dark:border-slate-900 dark:text-slate-500">
            {leftConfig ? (
              <div className="space-y-2">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-300">
                    Baseline
                  </div>
                  <div className="truncate">{leftConfig.name}</div>
                  <div>{formatBytes(leftConfig.size)}</div>
                </div>
                {rightConfig ? (
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-300">
                      Comparison
                    </div>
                    <div className="truncate">{rightConfig.name}</div>
                    <div>{formatBytes(rightConfig.size)}</div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-slate-500 dark:text-slate-400">
                Awaiting primary configuration…
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1">
          <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-900/60 dark:bg-slate-950/90 dark:supports-[backdrop-filter]:bg-slate-950/70">
            <div className="mx-auto flex max-w-7xl flex-col gap-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search key, label, description, or raw values…"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-inner shadow-slate-200 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:shadow-slate-950"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <DiffFilterToggle value={diffFilter} onChange={setDiffFilter} />
                <label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs uppercase tracking-wide text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={focusPending}
                    onChange={(event) => setFocusPending(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 bg-white text-sky-600 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-sky-400"
                  />
                  Only edited
                </label>
                <label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs uppercase tracking-wide text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={showRawValues}
                    onChange={(event) => setShowRawValues(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 bg-white text-sky-600 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-sky-400"
                  />
                  Raw
                </label>
              </div>
            </div>
          </div>

          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
            {selectedPage ? (
              <section>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {selectedPage.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedPage.entries.length} field
                      {selectedPage.entries.length === 1 ? "" : "s"} in view
                    </p>
                  </div>
                  <button
                    onClick={handleAddCustomKey}
                    className="inline-flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-700 transition hover:border-sky-500 hover:bg-sky-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 dark:border-sky-500/60 dark:text-sky-200"
                  >
                    + Add custom key
                  </button>
                </div>

                {selectedPage.entries.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPage.entries.map((entry) => {
                      const anchorId =
                        anchorByKey.get(entry.key) ??
                        `field-${normaliseAnchorBase(entry.key)}`;
                      return (
                        <FieldCard
                          key={entry.key}
                          entry={entry}
                          onSelectionChange={handleUpdateSelection}
                          onRemoveCustom={handleRemoveCustomKey}
                          hasRight={!!rightConfig}
                          rawMode={showRawValues}
                          anchorId={anchorId}
                          onNavigate={navigateToField}
                          isAnchorTarget={activeAnchorKey === entry.key}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600 dark:border-slate-900 dark:bg-slate-900/60 dark:text-slate-400">
                    No fields match the current filters on this page.
                  </div>
                )}
              </section>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-600 dark:border-slate-900 dark:bg-slate-900/50 dark:text-slate-400">
                No fields to display yet. Load a configuration to begin.
              </div>
            )}
          </div>
        </main>

        <aside className="hidden w-[22rem] shrink-0 border-l border-slate-200 bg-slate-100/80 backdrop-blur supports-[backdrop-filter]:bg-slate-100/60 dark:border-slate-900 dark:bg-slate-950/60 dark:supports-[backdrop-filter]:bg-slate-950/50 lg:flex lg:flex-col">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Preview & export
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Generate a curated backup or script reflecting the selections you
              have applied.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-900 dark:bg-slate-900/60">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Pending edits
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {totalPending} change
                  {totalPending === 1 ? "" : "s"} relative to the baseline file.
                </p>
                <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {diffLeftFinal.entries
                    .filter((entry) => entry.status !== "same")
                    .slice(0, 12)
                    .map((entry) => {
                      const anchorId = anchorByKey.get(entry.key);
                      const handleClick = (
                        event: MouseEvent<HTMLAnchorElement>,
                      ) => {
                        event.preventDefault();
                        navigateToField(entry.key);
                      };
                      const handleUndoClick = () => {
                        handleUndoPending(entry.key);
                      };
                      return (
                        <li
                          key={entry.key}
                          className="flex items-center justify-between gap-2"
                        >
                          {anchorId ? (
                            <a
                              href={`#${anchorId}`}
                              onClick={handleClick}
                              className="truncate text-sky-600 transition hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 dark:text-sky-300 dark:hover:text-sky-200"
                            >
                              {entry.key}
                            </a>
                          ) : (
                            <span className="truncate">{entry.key}</span>
                          )}
                          <div className="flex items-center gap-1.5">
                            <span
                              className={classNames(
                                "whitespace-nowrap rounded-full px-2 py-0.5 text-[11px]",
                                DIFF_BADGE_THEME[entry.status],
                              )}
                            >
                              {FINAL_STATUS_LABEL[entry.status]}
                            </span>
                            <button
                              type="button"
                              onClick={handleUndoClick}
                              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-200"
                              aria-label="Undo change"
                              title="Undo change"
                            >
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  {totalPending === 0 ? <li>No changes yet.</li> : null}
                  {totalPending > 12 ? (
                    <li className="text-slate-500 dark:text-slate-400">
                      …and {totalPending - 12} more.
                    </li>
                  ) : null}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-900 dark:bg-slate-900/60">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Download backup
                </h4>
                <div className="mt-3 grid gap-2">
                  <button
                    onClick={() =>
                      handleDownloadCfg(leftConfig?.header ?? "HDR2")
                    }
                    className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-700 transition hover:border-sky-500 hover:bg-sky-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 dark:border-sky-500/60 dark:text-sky-200"
                  >
                    Export as .cfg ({leftConfig?.header ?? "HDR2"})
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadCfg(
                        leftConfig?.header === "HDR1" ? "HDR2" : "HDR1",
                      )
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                  >
                    Export as .cfg (
                    {leftConfig?.header === "HDR1" ? "HDR2" : "HDR1"})
                  </button>
                  <button
                    onClick={handleExportJson}
                    className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-500 hover:bg-rose-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 dark:border-rose-500/60 dark:text-rose-200"
                  >
                    Export as JSON
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-900 dark:bg-slate-900/60">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                    NVRAM CLI Script
                  </h4>
                  <button
                    onClick={() => setShowScript((prev) => !prev)}
                    className="text-xs text-sky-600 underline-offset-4 transition hover:text-sky-700 hover:underline dark:text-sky-300 dark:hover:text-sky-200"
                  >
                    {showScript ? "Hide" : "Show"}
                  </button>
                </div>
                {showScript ? (
                  <div className="mt-3 space-y-2">
                    <pre className="max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-slate-100 p-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200">
                      {scriptText || "# No changes to apply"}
                    </pre>
                    <button
                      onClick={handleCopyScript}
                      className="w-full rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 dark:border-emerald-500/60 dark:text-emerald-200"
                    >
                      Copy script
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-900 dark:bg-slate-900/60">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Tools
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Operates on the currently visible fields in the workspace.
                </p>
                <div className="mt-3 grid gap-2">
                  <button
                    onClick={handleCopyVisibleKeys}
                    className="w-full rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-700 transition hover:border-sky-500 hover:bg-sky-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 dark:border-sky-500/60 dark:text-sky-200"
                  >
                    Copy visible keys
                  </button>
                  <button
                    onClick={handleCopyVisiblePairs}
                    className="w-full rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:border-indigo-500 hover:bg-indigo-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 dark:border-indigo-500/60 dark:text-indigo-200"
                  >
                    Copy visible key value pairs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <footer className="border-t border-slate-200 bg-white/80 px-6 py-4 dark:border-slate-900 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl justify-center text-xs text-slate-500 dark:text-slate-400">
          <span>
            made by{" "}
            <a
              href="https://github.com/niieani"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 transition hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200"
            >
              @niieani
            </a>{" "}
            (Bazyli Brzóska)
          </span>
        </div>
      </footer>
    </div>
  );
}

interface DropZoneCardProps {
  side: "left" | "right";
  title: string;
  subtitle: string;
  disabled: boolean;
  config: LoadedConfig | null;
  onFile: (file: File) => void;
  onClear: () => void;
}

interface SwapButtonProps {
  disabled: boolean;
  onSwap: () => void;
}

function SwapButton({ disabled, onSwap }: SwapButtonProps) {
  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={onSwap}
        disabled={disabled}
        aria-label="Swap primary and comparison configurations"
        className={classNames(
          "flex h-12 w-12 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60",
          disabled
            ? "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-600"
            : "border-slate-300 bg-white text-slate-700 hover:border-sky-500/60 hover:bg-slate-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:text-sky-200",
        )}
      >
        <SwapIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

function SwapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={classNames("h-5 w-5", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 7h11" />
      <path d="M18 7l-3-3" />
      <path d="M18 7l-3 3" />
      <path d="M17 17H6" />
      <path d="M6 17l3 3" />
      <path d="M6 17l3-3" />
    </svg>
  );
}

interface ThemeToggleProps {
  preference: ThemePreference;
  resolvedTheme: "light" | "dark";
  onCycle: () => void;
}

function ThemeToggle({ preference, resolvedTheme, onCycle }: ThemeToggleProps) {
  const labels: Record<ThemePreference, string> = {
    system: "Auto",
    light: "Light",
    dark: "Dark",
  };
  const IconComponent = resolvedTheme === "dark" ? MoonIcon : SunIcon;
  return (
    <button
      type="button"
      onClick={onCycle}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800"
      aria-label={`Switch theme (current: ${labels[preference]})`}
      title={`Switch theme (current: ${labels[preference]})`}
    >
      <IconComponent className="h-5 w-5" />
      <span>{labels[preference]}</span>
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={classNames("h-5 w-5", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="M5.64 5.64l1.42 1.42" />
      <path d="M16.94 16.94l1.42 1.42" />
      <path d="M3 12h2" />
      <path d="M19 12h2" />
      <path d="M5.64 18.36l1.42-1.42" />
      <path d="M16.94 7.06l1.42-1.42" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={classNames("h-5 w-5", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M17.293 13.293A8 8 0 017.707 3.707 8.001 8.001 0 1017.293 13.293z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.85 10.9.58.1.79-.24.79-.55 0-.27-.01-1.16-.02-2.1-3.19.69-3.87-1.37-3.87-1.37-.53-1.35-1.29-1.71-1.29-1.71-1.06-.72.08-.7.08-.7 1.18.08 1.8 1.21 1.8 1.21 1.04 1.78 2.74 1.27 3.41.97.1-.76.41-1.27.75-1.56-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.19-3.07-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18.92-.26 1.9-.39 2.88-.4.98 0 1.96.14 2.88.4 2.21-1.49 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.82 1.19 3.07 0 4.41-2.68 5.37-5.24 5.65.42.36.8 1.07.8 2.16 0 1.56-.01 2.82-.01 3.21 0 .31.21.66.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

interface PageExternalLinkProps {
  href: string;
  title: string;
  variant: "shared" | "left" | "right";
}

function PageExternalLink({ href, title, variant }: PageExternalLinkProps) {
  const toneClasses: Record<PageExternalLinkProps["variant"], string> = {
    shared:
      "text-slate-400 hover:text-slate-600 focus-visible:ring-slate-300/60 dark:text-slate-500 dark:hover:text-slate-300 dark:focus-visible:ring-slate-600/50",
    left: "text-slate-400 hover:text-sky-500 focus-visible:ring-sky-300/60 dark:text-slate-500 dark:hover:text-sky-300 dark:focus-visible:ring-sky-500/50",
    right:
      "text-slate-400 hover:text-rose-500 focus-visible:ring-rose-300/60 dark:text-slate-500 dark:hover:text-rose-300 dark:focus-visible:ring-rose-500/50",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={title}
      className={classNames(
        "inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 transition",
        toneClasses[variant],
      )}
    >
      <ExternalLinkIcon className="h-3.5 w-3.5" />
    </a>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={classNames("h-4 w-4", className)}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 3h6v6" />
      <path d="M9 11l8-8" />
      <path d="M17 11v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

function DropZoneCard({
  side,
  title,
  subtitle,
  disabled,
  config,
  onFile,
  onClear,
}: DropZoneCardProps) {
  const [isDragging, setDragging] = useState(false);
  const tone: ValueTone = side === "left" ? "left" : "right";
  const dropzoneToneClass =
    side === "left" ? DROPZONE_TONE_CLASSES.left : DROPZONE_TONE_CLASSES.right;
  const draggingToneClass =
    side === "left"
      ? "border-sky-400/70 bg-sky-100 dark:bg-sky-500/20"
      : "border-rose-400/70 bg-rose-100 dark:bg-rose-500/20";
  const infoSurfaceClass = SURFACE_TONE_CLASSES[tone];

  const handleDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragging(false);
      if (disabled) return;
      const file = event.dataTransfer.files?.[0];
      if (file) {
        onFile(file);
      }
    },
    [disabled, onFile],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onFile(file);
      }
      event.target.value = "";
    },
    [onFile],
  );

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragging(false);
      }}
      onDrop={handleDrop}
      className={classNames(
        "group relative flex min-w-0 cursor-pointer flex-col gap-3 rounded-2xl border border-dashed px-6 py-6 shadow-sm transition",
        dropzoneToneClass,
        disabled ? "cursor-not-allowed opacity-40" : null,
        isDragging && !disabled ? draggingToneClass : null,
      )}
    >
      <input
        type="file"
        accept=".cfg,application/octet-stream"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      {config ? (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClear();
          }}
          aria-label={`Remove ${
            side === "left" ? "primary" : "comparison"
          } configuration`}
          className="absolute right-3 top-3 rounded-full border border-transparent bg-slate-200/90 p-1.5 text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 4l8 8" />
            <path d="M12 4l-8 8" />
          </svg>
        </button>
      ) : null}
      <div className="flex items-center gap-3">
        <div
          className={classNames(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-semibold uppercase tracking-wide",
            side === "left"
              ? "border-sky-400/60 bg-sky-100 text-sky-700 dark:border-sky-400/50 dark:bg-sky-500/25 dark:text-sky-200"
              : "border-rose-400/60 bg-rose-100 text-rose-700 dark:border-rose-400/50 dark:bg-rose-500/25 dark:text-rose-200",
          )}
        >
          {side === "left" ? "L" : "R"}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {subtitle}
          </div>
        </div>
      </div>

      {config ? (
        <div
          className={classNames(
            "min-w-0 rounded-xl border p-3 text-xs text-slate-600 dark:text-slate-300",
            infoSurfaceClass,
          )}
        >
          <div className="w-full truncate font-medium text-slate-900 dark:text-slate-200">
            {config.name}
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2 leading-relaxed">
            <InfoItem
              label="Entries"
              value={Object.keys(config.entries).length.toString()}
            />
            <InfoItem label="Size" value={formatBytes(config.size)} />
            <InfoItem label="Header" value={config.header} />
            {config.salt !== undefined ? (
              <InfoItem
                label="Salt"
                value={`0x${config.salt.toString(16).padStart(2, "0")}`}
              />
            ) : (
              <InfoItem label="Length" value={`${config.fileLength} B`} />
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Loaded {formatTimestamp(config.loadedAt)}
          </div>
        </div>
      ) : (
        <div
          className={classNames(
            "rounded-xl border px-4 py-5 text-center text-sm text-slate-600 dark:text-slate-400",
            infoSurfaceClass,
          )}
        >
          Drop file here or click to browse
        </div>
      )}
    </label>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="text-xs text-slate-700 dark:text-slate-200">{value}</div>
    </div>
  );
}

interface DiffFilterToggleProps {
  value: DiffFilter;
  onChange: (value: DiffFilter) => void;
}

function DiffFilterToggle({ value, onChange }: DiffFilterToggleProps) {
  const options: Array<{ value: DiffFilter; label: string }> = [
    { value: "all", label: "All fields" },
    { value: "different", label: "Different" },
    { value: "added", label: "Added" },
    { value: "removed", label: "Removed" },
  ];
  return (
    <div className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-slate-300 bg-white p-1 text-xs text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={classNames(
              "rounded-lg px-3 py-1.5 transition",
              active
                ? "bg-slate-200 text-slate-900 shadow-[0_0_0_1px_rgba(148,163,184,0.25)] dark:bg-slate-800 dark:text-white dark:shadow-[0_0_0_1px_rgba(148,163,184,0.35)]"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

interface FieldCardProps {
  entry: FieldView;
  onSelectionChange: (key: string, state: SelectionState) => void;
  onRemoveCustom: (key: string) => void;
  hasRight: boolean;
  rawMode: boolean;
  anchorId: string;
  onNavigate: (key: string, options?: NavigateToFieldOptions) => void;
  isAnchorTarget: boolean;
}

function FieldCard({
  entry,
  onSelectionChange,
  onRemoveCustom,
  hasRight,
  rawMode,
  anchorId,
  onNavigate,
  isAnchorTarget,
}: FieldCardProps) {
  const { key, field, diff, finalDiff, selection } = entry;
  const isFallback = field.raw === null;
  const controlType = resolveControlType(field);
  const rawModeActive = rawMode && controlType !== "text";
  const structuredMode =
    !rawModeActive && controlType === "structured"
      ? detectStructuredMode(field, entry)
      : undefined;
  const leftValue = rawModeActive
    ? entry.leftRaw ?? ""
    : coerceDisplayValue(field, entry.leftRaw, controlType);
  const rightValue = rawModeActive
    ? entry.rightRaw ?? ""
    : coerceDisplayValue(field, entry.rightRaw, controlType);
  const workingValue = rawModeActive
    ? entry.workingRaw ?? ""
    : coerceDisplayValue(field, entry.workingRaw, controlType);
  const leftHint =
    entry.leftRaw === undefined
      ? "Not present"
      : controlType === "boolean" && entry.leftRaw === ""
      ? "<EMPTY>"
      : undefined;
  const rightHint = hasRight
    ? entry.rightRaw === undefined
      ? "Not present"
      : controlType === "boolean" && entry.rightRaw === ""
      ? "<EMPTY>"
      : undefined
    : "No file loaded";
  const workingHint =
    controlType === "boolean" && entry.workingRaw === "" ? "<EMPTY>" : undefined;
  const sidesIdentical =
    hasRight &&
    entry.leftRaw !== undefined &&
    entry.rightRaw !== undefined &&
    entry.leftRaw === entry.rightRaw;
  const workingMatchesLeft =
    entry.leftRaw !== undefined && entry.workingRaw === entry.leftRaw;
  const workingMatchesRight =
    entry.rightRaw !== undefined && entry.workingRaw === entry.rightRaw;
  const workingTone: ValueTone =
    workingMatchesLeft && workingMatchesRight
      ? "both"
      : workingMatchesLeft
      ? "left"
      : workingMatchesRight
      ? "right"
      : entry.workingRaw !== undefined &&
        entry.workingRaw !== null &&
        entry.workingRaw !== ""
      ? "custom"
      : "neutral";
  const [workingExpanded, setWorkingExpanded] = useState(false);

  const selectionValue =
    selection?.option ?? (entry.leftRaw !== undefined ? "left" : "remove");
  const disabledOptions = {
    left: entry.leftRaw === undefined,
    right: !hasRight || entry.rightRaw === undefined,
  } as const;

  const handleCustomChange = (value: unknown) => {
    onSelectionChange(key, {
      option: "custom",
      customRaw: field.fromUi(value),
    });
  };

  const handleBooleanChange = (value: boolean) => {
    onSelectionChange(key, {
      option: "custom",
      customRaw: field.fromUi(value),
    });
  };

  const handleNumberChange = (value: string, kind: "integer" | "number") => {
    const rawInput = value.trim();

    if (rawInput === "") {
      onSelectionChange(key, { option: "custom", customRaw: field.fromUi("") });
      return;
    }

    if (kind === "integer") {
      if (rawInput === "-") {
        onSelectionChange(key, { option: "custom", customRaw: "-" });
        return;
      }
      const digitsOnly = rawInput.replace(/[^0-9-]/g, "");
      const normalized = digitsOnly.startsWith("-")
        ? `-${digitsOnly.slice(1).replace(/-/g, "")}`
        : digitsOnly.replace(/-/g, "");
      if (normalized === "" || normalized === "-") {
        onSelectionChange(key, { option: "custom", customRaw: normalized });
        return;
      }
      if (!/^-?\d+$/.test(normalized)) {
        return;
      }
      const parsed = Number.parseInt(normalized, 10);
      if (Number.isNaN(parsed)) {
        return;
      }
      onSelectionChange(key, {
        option: "custom",
        customRaw: field.fromUi(parsed),
      });
      return;
    }

    if (rawInput === "-" || rawInput === "." || rawInput === "-.") {
      onSelectionChange(key, { option: "custom", customRaw: rawInput });
      return;
    }

    if (!/^-?\d*(?:\.\d+)?$/.test(rawInput)) {
      return;
    }

    const parsed = Number(rawInput);
    if (Number.isNaN(parsed)) {
      return;
    }
    onSelectionChange(key, {
      option: "custom",
      customRaw: field.fromUi(parsed),
    });
  };

  const handleListChange = (value: string[]) => {
    onSelectionChange(key, {
      option: "custom",
      customRaw: field.fromUi(value),
    });
  };

  const handleRawChange = (value: string) => {
    onSelectionChange(key, { option: "custom", customRaw: value });
  };

  const makeIconButtonClass = (disabled?: boolean) =>
    classNames(
      "inline-flex h-6 w-6 items-center justify-center rounded-md border text-[11px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50",
      disabled
        ? "cursor-not-allowed border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-600"
        : "border-slate-300 hover:border-slate-400 hover:text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100",
    );

  const copyRawValue = async (raw: string | undefined) => {
    if (raw === undefined) return;
    const clipboard = globalThis.navigator?.clipboard;
    if (!clipboard) return;
    try {
      await clipboard.writeText(raw);
    } catch (error) {
      console.error("Failed to copy value", error);
    }
  };

  const handleCopyLeft = () => {
    void copyRawValue(entry.leftRaw);
  };

  const handleCopyRight = () => {
    void copyRawValue(entry.rightRaw);
  };

  const canCopyLeft = entry.leftRaw !== undefined;
  const canCopyRight = hasRight && entry.rightRaw !== undefined;

  const leftCopyLabel = sidesIdentical ? "Copy value" : "Copy left value";
  const rightCopyLabel = "Copy right value";

  const leftHeaderActions = (
    <button
      type="button"
      className={makeIconButtonClass(!canCopyLeft)}
      onClick={handleCopyLeft}
      disabled={!canCopyLeft}
      aria-label={leftCopyLabel}
      title={leftCopyLabel}
    >
      <CopyIcon className="h-3.5 w-3.5" />
    </button>
  );

  const rightHeaderActions = !sidesIdentical ? (
    <button
      type="button"
      className={makeIconButtonClass(!canCopyRight)}
      onClick={handleCopyRight}
      disabled={!canCopyRight}
      aria-label={rightCopyLabel}
      title={rightCopyLabel}
    >
      <CopyIcon className="h-3.5 w-3.5" />
    </button>
  ) : null;

  const handleToggleWorkingExpanded = () => {
    setWorkingExpanded((previous) => !previous);
  };

  const workingHeaderActions = (
    <button
      type="button"
      className={classNames(
        makeIconButtonClass(false),
        workingExpanded
          ? "border-sky-400 text-sky-600 dark:border-sky-500 dark:text-sky-300"
          : undefined,
      )}
      onClick={handleToggleWorkingExpanded}
      aria-pressed={workingExpanded}
      aria-label={workingExpanded ? "Collapse working editor" : "Expand working editor"}
      title={workingExpanded ? "Collapse working editor" : "Expand working editor"}
    >
      <ExpandToggleIcon expanded={workingExpanded} className="h-3.5 w-3.5" />
    </button>
  );

  const gridClassName = classNames(
    "mt-4 grid gap-3",
    workingExpanded ? "md:grid-cols-2" : "md:grid-cols-3",
  );
  const workingColumnClass = classNames(
    workingExpanded ? "md:col-span-2" : undefined,
    !workingExpanded && sidesIdentical ? "md:col-span-1" : undefined,
  );
  const leftColumnClass = classNames(
    sidesIdentical ? "md:col-span-2" : undefined,
  );
  const showRightColumn = !sidesIdentical;

  const leftColumn = (
    <ValueColumn
      title={sidesIdentical ? "Left = Right" : "Left"}
      controlType={controlType}
      hint={leftHint}
      value={leftValue}
      field={field}
      readOnly
      options={field.options}
      className={leftColumnClass}
      structuredMode={structuredMode}
      structuredSchema={field.structuredSchema}
      rawMode={rawModeActive}
      tone={sidesIdentical ? "both" : "left"}
      headerActions={leftHeaderActions}
    />
  );

  const rightColumn = showRightColumn ? (
    <ValueColumn
      title="Right"
      controlType={controlType}
      hint={rightHint}
      value={rightValue}
      field={field}
      readOnly
      options={field.options}
      structuredMode={structuredMode}
      structuredSchema={field.structuredSchema}
      rawMode={rawModeActive}
      tone="right"
      headerActions={rightHeaderActions}
    />
  ) : null;

  const workingColumn = (
    <ValueColumn
      title="Working"
      controlType={controlType}
      value={workingValue}
      field={field}
      isRemovable={
        isFallback &&
        entry.leftRaw === undefined &&
        entry.rightRaw === undefined
      }
      onRemoveCustom={onRemoveCustom}
      fieldKey={key}
      options={field.options}
      className={workingColumnClass}
      structuredMode={structuredMode}
      structuredSchema={field.structuredSchema}
      rawMode={rawModeActive}
      hint={workingHint}
      onRawChange={rawModeActive ? handleRawChange : undefined}
      onCustomChange={rawModeActive ? undefined : handleCustomChange}
      onBooleanChange={rawModeActive ? undefined : handleBooleanChange}
      onNumberChange={rawModeActive ? undefined : handleNumberChange}
      onListChange={rawModeActive ? undefined : handleListChange}
      tone={workingTone}
      headerActions={workingHeaderActions}
    />
  );

  const handleSelectOption = (option: Exclude<SelectionOption, "custom">) => {
    if (option === "left" && entry.leftRaw === undefined) return;
    if (option === "right" && (entry.rightRaw === undefined || !hasRight))
      return;
    onSelectionChange(key, { option });
  };

  const handleSelectEdited = () => {
    if (rawModeActive) {
      onSelectionChange(key, {
        option: "custom",
        customRaw: entry.workingRaw ?? "",
      });
      return;
    }
    onSelectionChange(key, {
      option: "custom",
      customRaw: field.fromUi(workingValue),
    });
  };

  const finalBadge = finalDiff.status !== "same" && (
    <span
      className={classNames(
        "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium",
        DIFF_BADGE_THEME[finalDiff.status],
      )}
    >
      {FINAL_STATUS_LABEL[finalDiff.status]}
    </span>
  );

  return (
    <article
      id={anchorId}
      className={classNames(
        "rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 p-4 shadow-sm shadow-slate-200 dark:shadow-slate-950/30 scroll-mt-28 transition-shadow",
        isAnchorTarget ? "ring-2 ring-sky-500/60 shadow-sky-500/20" : null,
      )}
    >
      <header className="flex flex-col gap-3 min-[460px]:flex-row min-[460px]:items-center min-[460px]:justify-between min-[460px]:gap-4 md:gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            <a
              href={`#${anchorId}`}
              title={field.label}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(key, { preserveFilters: true });
              }}
              className="-mx-1 rounded px-1 transition hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 dark:hover:text-sky-300"
            >
              {key}
            </a>
          </h3>
          <span
            className={classNames(
              "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium",
              PRIMARY_DIFF_BADGE_THEME[diff.status],
            )}
          >
            {diff.status === "different"
              ? "DIFFERENT"
              : diff.status.toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col items-start gap-2 min-[460px]:items-end md:gap-2 md:min-w-[320px]">
          <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:justify-end">
            {finalBadge}
            <SelectionChips
              current={selectionValue}
              onSelect={handleSelectOption}
              onSelectCustom={handleSelectEdited}
              disabledOptions={disabledOptions}
              showEdited={selectionValue === "custom"}
              sidesIdentical={sidesIdentical}
            />
          </div>
        </div>
      </header>
      {field.description ? (
        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {field.description}
        </p>
      ) : null}

      <div className={gridClassName}>
        {workingExpanded ? (
          <>
            {workingColumn}
            {leftColumn}
            {rightColumn}
          </>
        ) : (
          <>
            {leftColumn}
            {rightColumn}
            {workingColumn}
          </>
        )}
      </div>
    </article>
  );
}

interface ValueColumnProps {
  title: string;
  value: any;
  field: ResolvedField;
  controlType: ControlType;
  readOnly?: boolean;
  hint?: string;
  onCustomChange?: (value: unknown) => void;
  onBooleanChange?: (value: boolean) => void;
  onNumberChange?: (value: string, kind: "integer" | "number") => void;
  onListChange?: (value: string[]) => void;
  isRemovable?: boolean;
  onRemoveCustom?: (key: string) => void;
  fieldKey?: string;
  options?: ResolvedField["options"];
  className?: string;
  structuredMode?: StructuredEditorMode;
  structuredSchema?: StructuredSchema;
  rawMode?: boolean;
  onRawChange?: (value: string) => void;
  tone?: ValueTone;
  headerActions?: ReactNode;
}

function ValueColumn({
  title,
  value,
  field,
  controlType,
  readOnly,
  hint,
  onCustomChange,
  onBooleanChange,
  onNumberChange,
  onListChange,
  isRemovable,
  onRemoveCustom,
  fieldKey,
  options,
  className,
  structuredMode,
  structuredSchema,
  rawMode = false,
  onRawChange,
  tone = "neutral",
  headerActions,
}: ValueColumnProps) {
  const portForwardVariant: PortForwardVariant =
    field.key === "ipv6_portforward" ? "ipv6" : "ipv4";
  const schema = structuredSchema;
  const resolvedStructuredMode: StructuredEditorMode =
    structuredMode ??
    (schema
      ? schema.kind === "object"
        ? "object"
        : schema.kind === "array" && isStructuredPrimitiveField(schema.items)
        ? "primitive-array"
        : "array"
      : "array");
  const surfaceToneClass = SURFACE_TONE_CLASSES[tone] ?? SURFACE_TONE_CLASSES.neutral;
  const makeSurfaceClass = (
    ...extras: Array<string | false | null | undefined>
  ) => classNames("rounded-xl border px-3 py-2", surfaceToneClass, ...extras);
  const makeInputClass = (
    ...extras: Array<string | false | null | undefined>
  ) => classNames("w-full rounded-xl border px-3 py-2", surfaceToneClass, ...extras);
  const primitiveArraySchema =
    schema &&
    schema.kind === "array" &&
    isStructuredPrimitiveField(schema.items)
      ? schema.items
      : undefined;
  const objectSchema =
    schema && schema.kind === "object"
      ? schema
      : schema &&
        schema.kind === "array" &&
        isStructuredObjectSchemaDefinition(schema.items)
      ? schema.items
      : undefined;
  const editorModeForRecords: "array" | "object" =
    resolvedStructuredMode === "primitive-array"
      ? "array"
      : resolvedStructuredMode;
  const toStructuredRecords = (
    input: unknown,
  ): Array<Record<string, unknown>> => {
    if (Array.isArray(input)) {
      return input.filter(isPlainObject) as Array<Record<string, unknown>>;
    }
    if (isPlainObject(input)) {
      return [input as Record<string, unknown>];
    }
    return [];
  };

  const renderHintSurface = () => {
    if (!hint) return null;
    if (hint === "<EMPTY>") {
      return (
        <pre
          className={makeSurfaceClass(
            "max-h-40 overflow-y-auto font-mono text-sm text-slate-700 dark:text-slate-200",
          )}
        >
          <span className="text-slate-400 dark:text-slate-500">&lt;EMPTY&gt;</span>
        </pre>
      );
    }
    return (
      <div
        className={makeSurfaceClass(
          "text-xs text-slate-600 dark:text-slate-500",
        )}
      >
        {hint}
      </div>
    );
  };

  const hintSurface = renderHintSurface();

  const renderBooleanVisual = (checked: boolean) => (
    <div className="flex items-center gap-2">
      <span
        className={classNames(
          "relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full border transition-colors duration-200",
          checked
            ? "border-sky-600 bg-sky-500 dark:border-sky-400 dark:bg-sky-500/60"
            : "border-rose-400 bg-rose-100 dark:border-rose-500/60 dark:bg-rose-500/30",
        )}
      >
        <span
          className={classNames(
            "absolute left-[2px] h-4 w-4 translate-x-0 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-4" : "",
          )}
        />
      </span>
      <span
        className={classNames(
          "text-xs font-semibold tracking-wide transition-colors duration-200",
          checked ? "text-sky-700 dark:text-sky-300" : "text-rose-600 dark:text-rose-300",
        )}
      >
        {checked ? "ENABLED" : "DISABLED"}
      </span>
    </div>
  );

  const renderControl = () => {
    if (rawMode) {
      if (readOnly) {
        const rawValue = value ?? "";
        const display =
          rawValue === null || rawValue === undefined || rawValue === ""
            ? null
            : typeof rawValue === "string"
            ? rawValue
            : String(rawValue);
        return (
          <pre
            className={makeSurfaceClass(
              "max-h-40 overflow-auto font-mono text-sm text-slate-700 dark:text-slate-200 whitespace-pre",
            )}
          >
            {display === null ? (
              <span className="text-slate-400 dark:text-slate-500">&lt;EMPTY&gt;</span>
            ) : (
              display
            )}
          </pre>
        );
      }
      const editableRaw =
        typeof value === "string"
          ? value
          : value === null || value === undefined
          ? ""
          : String(value);
      return (
        <textarea
          value={editableRaw}
          onChange={(event) => onRawChange?.(event.target.value)}
          wrap="off"
          className={makeInputClass(
            "h-32 font-mono text-sm text-slate-800 dark:text-slate-100 whitespace-pre overflow-auto focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40",
          )}
          spellCheck={false}
        />
      );
    }

    if (readOnly) {
      if (controlType === "boolean") {
        return (
          <div className={makeSurfaceClass()}>
            {renderBooleanVisual(Boolean(value))}
          </div>
        );
      }
      if (controlType === "list") {
        const items = Array.isArray(value)
          ? (value as string[])
          : typeof value === "string"
          ? value
              .split(",")
              .map((part) => part.trim())
              .filter((part) => part.length > 0)
          : [];
        return <ListInput value={items} readOnly tone={tone} />;
      }
      if (controlType === "structured") {
        if (primitiveArraySchema) {
          const items = Array.isArray(value)
            ? (value as Array<string | number | boolean>)
            : value == null
            ? []
            : [value].filter(
                (item): item is string | number | boolean =>
                  typeof item !== "object",
              );
          return (
            <StructuredPrimitiveArrayEditor
              schema={primitiveArraySchema}
              values={items}
              readOnly
              tone={tone}
            />
          );
        }
        const records = toStructuredRecords(value);
        const normalisedRecords = objectSchema
          ? records.map((record) =>
              normaliseRecordWithSchema(record, objectSchema),
            )
          : records;
        return (
          <StructuredStringEditor
            value={normalisedRecords}
            readOnly
            mode={editorModeForRecords}
            schema={schema}
            tone={tone}
          />
        );
      }
      if (
        controlType === "ip" ||
        controlType === "mac" ||
        controlType === "netmask" ||
        controlType === "hex"
      ) {
        const display = value == null || value === "" ? "—" : String(value);
        return (
          <div
            className={makeSurfaceClass(
              "text-sm text-slate-700 dark:text-slate-200",
            )}
          >
            <code className="font-mono text-slate-800 dark:text-slate-100">{display}</code>
          </div>
        );
      }
      if (controlType === "portforward") {
        const rules = Array.isArray(value) ? (value as PortForwardRule[]) : [];
        return (
          <PortForwardEditor
            value={rules}
            variant={portForwardVariant}
            readOnly
            tone={tone}
          />
        );
      }
      return (
        <pre
          className={makeSurfaceClass(
            "max-h-40 overflow-y-auto font-mono text-sm text-slate-700 dark:text-slate-200",
          )}
        >
          {(() => {
            if (value === null || value === undefined || value === "") {
              return <span className="text-slate-400 dark:text-slate-500">&lt;EMPTY&gt;</span>;
            }
            if (controlType === "select" && options && options.length > 0) {
              const match = options.find(
                (option) => String(option.value) === String(value),
              );
              return match
                ? `${match.label} (${value})`
                : formatDisplay(value, controlType);
            }
            return formatDisplay(value, controlType);
          })()}
        </pre>
      );
    }

    if (controlType === "boolean") {
      const checked =
        value === true ||
        value === 1 ||
        value === "1" ||
        value === "true" ||
        (typeof value === "string" && value.toLowerCase?.() === "on");
      const offLabel = hint === "<EMPTY>" ? "<EMPTY>" : "DISABLED";
      return (
        <label
          className={makeSurfaceClass("inline-flex items-center gap-3")}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onBooleanChange?.(event.target.checked)}
            className="peer sr-only"
            aria-label={field.label || field.key || title}
          />
          <span
            className={classNames(
              "relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full border transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-sky-500",
              checked
                ? "border-sky-600 bg-sky-500 hover:bg-sky-500/90 dark:border-sky-400 dark:bg-sky-500/60 dark:hover:bg-sky-500/70"
                : "border-rose-400 bg-rose-100 hover:bg-rose-200 dark:border-rose-500/60 dark:bg-rose-500/30 dark:hover:bg-rose-500/40",
            )}
          >
            <span
              className={classNames(
                "absolute left-[2px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                checked ? "translate-x-4" : "translate-x-0",
              )}
            />
          </span>
          <span
            className={classNames(
              "text-xs font-semibold tracking-wide transition-colors duration-200",
              checked ? "text-sky-700 dark:text-sky-300" : "text-rose-600 dark:text-rose-300",
            )}
          >
            {checked ? "ENABLED" : offLabel}
          </span>
        </label>
      );
    }

    if (controlType === "portforward") {
      const rules = Array.isArray(value) ? (value as PortForwardRule[]) : [];
      const handleChange = (next: PortForwardRule[]) => {
        if (onCustomChange) {
          onCustomChange(next);
        }
      };
      return (
        <PortForwardEditor
          value={rules}
          onChange={handleChange}
          variant={portForwardVariant}
          tone={tone}
        />
      );
    }

    if (
      controlType === "ip" ||
      controlType === "mac" ||
      controlType === "netmask" ||
      controlType === "hex"
    ) {
      const stringValue =
        typeof value === "string" ? value : value == null ? "" : String(value);
      const placeholderMap = {
        ip: "e.g. 192.168.1.1",
        mac: "e.g. AA:BB:CC:DD:EE:FF",
        netmask: "e.g. 255.255.255.0",
        hex: "e.g. 0A1B2C",
      } as const;
      const placeholder = placeholderMap[controlType];

      if (controlType === "mac") {
        return (
          <input
            type="text"
            value={stringValue}
            onChange={(event) =>
              onCustomChange?.(event.target.value.toUpperCase())
            }
            placeholder={placeholder}
            className={makeInputClass(
              "font-mono text-sm text-slate-800 dark:text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40",
            )}
            autoCapitalize="characters"
            spellCheck={false}
          />
        );
      }

      if (controlType === "hex") {
        return (
          <input
            type="text"
            value={stringValue}
            onChange={(event) =>
              onCustomChange?.(event.target.value.toUpperCase())
            }
            placeholder={placeholder}
            className={makeInputClass(
              "font-mono text-sm text-slate-800 dark:text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40",
            )}
            spellCheck={false}
          />
        );
      }

      const inputMode =
        controlType === "ip" || controlType === "netmask"
          ? "decimal"
          : undefined;
      return (
        <input
          type="text"
          value={stringValue}
          onChange={(event) => onCustomChange?.(event.target.value)}
          placeholder={placeholder}
          className={makeInputClass(
            "font-mono text-sm text-slate-800 dark:text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40",
          )}
          inputMode={inputMode}
          spellCheck={false}
        />
      );
    }

    if (controlType === "list") {
      const items = Array.isArray(value)
        ? (value as string[])
        : typeof value === "string"
        ? value
            .split(",")
            .map((part) => part.trim())
            .filter((part) => part.length > 0)
        : [];
      const handleChange = (next: string[]) => {
        if (onListChange) {
          onListChange(next);
        } else if (onCustomChange) {
          onCustomChange(next);
        }
      };

      return <ListInput value={items} onChange={handleChange} tone={tone} />;
    }

    if (controlType === "structured") {
      if (primitiveArraySchema) {
        const items = Array.isArray(value)
          ? (value as Array<string | number | boolean>)
          : value == null
          ? []
          : [value].filter(
              (item): item is string | number | boolean =>
                typeof item !== "object",
            );
        const handlePrimitiveChange = (
          next: Array<string | number | boolean>,
        ) => {
          onCustomChange?.(next);
        };
        return (
          <StructuredPrimitiveArrayEditor
            schema={primitiveArraySchema}
            values={items}
            onChange={handlePrimitiveChange}
            tone={tone}
          />
        );
      }
      const records = toStructuredRecords(value);
      const normalisedRecords = objectSchema
        ? records.map((record) =>
            normaliseRecordWithSchema(record, objectSchema),
          )
        : records;
      const handleChange = (next: Array<Record<string, unknown>>) => {
        if (!onCustomChange) return;
        if (editorModeForRecords === "object") {
          const nextRecord = next.find(isPlainObject) ?? {};
          onCustomChange(nextRecord);
        } else {
          onCustomChange(next);
        }
      };
      return (
        <StructuredStringEditor
          value={normalisedRecords}
          onChange={handleChange}
          mode={editorModeForRecords}
          schema={schema}
          tone={tone}
        />
      );
    }

    if (controlType === "select" && options && options.length > 0) {
      return (
        <select
          value={value ?? ""}
          onChange={(event) => onCustomChange?.(event.target.value)}
          className={makeInputClass(
            "text-sm text-slate-800 dark:text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40",
          )}
        >
          {options.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (controlType === "textarea") {
      return (
        <textarea
          value={value ?? ""}
          onChange={(event) => onCustomChange?.(event.target.value)}
          wrap="off"
          className={makeInputClass(
            "h-32 font-mono text-sm text-slate-800 dark:text-slate-100 whitespace-pre overflow-auto focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40",
          )}
          spellCheck={false}
        />
      );
    }

    if (controlType === "integer" || controlType === "number") {
      const isIntegerField = controlType === "integer";
      const stringValue =
        value === null || value === undefined
          ? ""
          : typeof value === "number"
          ? isIntegerField
            ? String(Math.trunc(value))
            : String(value)
          : String(value);
      const allowedKeys = new Set([
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        "Tab",
        "Enter",
      ]);
      return (
        <input
          type="text"
          value={stringValue}
          onChange={(event) =>
            onNumberChange?.(event.target.value, controlType)
          }
          onKeyDown={(event) => {
            if (!isIntegerField) return;
            if (allowedKeys.has(event.key)) return;
            if (
              event.key === "-" &&
              event.currentTarget.selectionStart === 0 &&
              !event.currentTarget.value.includes("-")
            ) {
              return;
            }
            if (/^\d$/.test(event.key)) return;
            event.preventDefault();
          }}
          onPaste={(event) => {
            if (!isIntegerField) return;
            const text = event.clipboardData.getData("text/plain");
            if (/^-?\d*$/.test(text)) return;
            event.preventDefault();
          }}
          inputMode={isIntegerField ? "numeric" : "decimal"}
          autoComplete="off"
          spellCheck={false}
          pattern={isIntegerField ? "^-?[0-9]*$" : undefined}
          className={makeInputClass(
            "font-mono text-sm text-slate-800 dark:text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40",
          )}
        />
      );
    }

    return (
      <input
        type="text"
        value={value ?? ""}
        onChange={(event) => onCustomChange?.(event.target.value)}
        className={makeInputClass(
          "font-mono text-sm text-slate-800 dark:text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40",
        )}
        spellCheck={false}
      />
    );
  };

  const controlContent = (() => {
    if (rawMode && hintSurface) {
      return hintSurface;
    }
    if (!rawMode && readOnly && hintSurface) {
      return hintSurface;
    }
    const control = renderControl();
    if (!rawMode && !readOnly && hintSurface && controlType !== "boolean") {
      return (
        <div className="flex flex-col gap-2">
          {hintSurface}
          {control}
        </div>
      );
    }
    return control;
  })();

  return (
    <div className={classNames("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <div
          className={classNames(
            "text-xs uppercase tracking-wide",
            LABEL_TONE_CLASSES[tone] ?? LABEL_TONE_CLASSES.neutral,
          )}
        >
          {title}
        </div>
        {headerActions ? (
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            {headerActions}
          </div>
        ) : null}
      </div>

      {controlContent}

      {!readOnly && isRemovable && onRemoveCustom && fieldKey ? (
        <button
          onClick={() => onRemoveCustom(fieldKey)}
          className="text-xs text-rose-600 underline-offset-4 transition hover:text-rose-700 hover:underline dark:text-rose-300 dark:hover:text-rose-200"
        >
          Remove field
        </button>
      ) : null}
    </div>
  );
}

interface ListInputProps {
  value: ReadonlyArray<string>;
  onChange?: (next: string[]) => void;
  readOnly?: boolean;
  tone?: ValueTone;
}

type ExpandToggleIconProps = SVGProps<SVGSVGElement> & {
  expanded?: boolean;
};

function CopyIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M7 4.75A1.75 1.75 0 0 1 8.75 3h5.5A1.75 1.75 0 0 1 16 4.75v5.5A1.75 1.75 0 0 1 14.25 12H8.75A1.75 1.75 0 0 1 7 10.25v-5.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 7.25A1.75 1.75 0 0 1 5.75 5.5H7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 9.75v5.5A1.75 1.75 0 0 0 5.75 17h5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExpandToggleIcon({ expanded = false, className, ...props }: ExpandToggleIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={classNames(className, expanded ? "rotate-90" : undefined)}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M4 10h12" strokeLinecap="round" />
      <path d="M7.5 6.5 4.5 9.5l3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 6.5l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ListInput({ value, onChange, readOnly, tone = "neutral" }: ListInputProps) {
  const [draft, setDraft] = useState("");
  const items = useMemo(
    () =>
      (Array.isArray(value) ? value : [])
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    [value],
  );
  const canEdit = Boolean(onChange) && !readOnly;
  const toneClass = SURFACE_TONE_CLASSES[tone] ?? SURFACE_TONE_CLASSES.neutral;

  const commitDraft = () => {
    if (!canEdit) return;
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange?.([...items, trimmed]);
    setDraft("");
  };

  const handleRemove = (index: number) => {
    if (!canEdit) return;
    onChange?.(items.filter((_, idx) => idx !== index));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!canEdit) return;
    if (event.key === "Enter") {
      event.preventDefault();
      commitDraft();
    } else if (event.key === ",") {
      event.preventDefault();
      commitDraft();
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div
        className={classNames(
          "flex w-full min-h-[42px] flex-wrap items-center gap-2 rounded-xl border px-3 py-2",
          toneClass,
          items.length === 0 ? "text-xs text-slate-600 dark:text-slate-500" : undefined,
        )}
      >
        {items.length === 0 ? (
          <span>No entries</span>
        ) : (
          items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-200 dark:bg-slate-800/60 px-3 py-1 text-xs text-slate-800 dark:text-slate-100"
            >
              {item}
              {canEdit ? (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-slate-600 dark:text-slate-400 transition hover:text-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60"
                  aria-label={`Remove ${item}`}
                >
                  ×
                </button>
              ) : null}
            </span>
          ))
        )}
      </div>
      {canEdit ? (
        <div className="flex w-full items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add value"
            className={classNames(
              "min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40",
              toneClass,
            )}
          />
          <button
            type="button"
            onClick={commitDraft}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sky-600 text-base font-semibold text-white shadow-sm transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
            aria-label="Add value"
          >
            +
          </button>
        </div>
      ) : null}
    </div>
  );
}

interface StructuredStringEditorProps {
  value: ReadonlyArray<Record<string, unknown>>;
  mode?: StructuredEditorMode;
  schema?: StructuredSchema;
  onChange?: (next: Array<Record<string, unknown>>) => void;
  readOnly?: boolean;
  tone?: ValueTone;
}

function StructuredStringEditor({ value, onChange, readOnly, mode = "array", schema, tone = "neutral" }: StructuredStringEditorProps) {
  const objectSchema =
    schema && schema.kind === "object"
      ? schema
      : schema && schema.kind === "array" && isStructuredObjectSchemaDefinition(schema.items)
        ? schema.items
        : undefined;
  const records = useMemo(() => {
    if (mode === "object") {
      const first = value[0];
      const baseRecord = isPlainObject(first) ? (first as Record<string, unknown>) : {};
      return objectSchema ? [normaliseRecordWithSchema(baseRecord, objectSchema)] : [baseRecord];
    }
    const list = Array.isArray(value)
      ? value.map((entry) => (isPlainObject(entry) ? (entry as Record<string, unknown>) : {}))
      : [];
    return objectSchema ? list.map((entry) => normaliseRecordWithSchema(entry, objectSchema)) : list;
  }, [mode, objectSchema, value]);
  const canEdit = Boolean(onChange) && !readOnly;
  const toneClass = SURFACE_TONE_CLASSES[tone] ?? SURFACE_TONE_CLASSES.neutral;
  const surfaceClass = (
    ...extra: Array<string | false | null | undefined>
  ) => classNames("rounded-xl border px-3 py-2", toneClass, ...extra);

  const fieldTypes = useMemo(() => {
    const map = new Map<string, StructuredFieldType>();
    if (objectSchema) {
      for (const [key, definition] of Object.entries(objectSchema.fields)) {
        map.set(key, primitiveToStructuredFieldType(definition.type));
      }
    }
    for (const record of records) {
      if (!isPlainObject(record)) continue;
      for (const [key, raw] of Object.entries(record)) {
        const inferred = inferStructuredFieldType(raw);
        if (!map.has(key)) {
          map.set(key, inferred);
          continue;
        }
        const existing = map.get(key)!;
        if (existing === "string") continue;
        if (existing === "number" && inferred === "string") {
          map.set(key, "string");
        } else if (existing === "boolean" && inferred !== "boolean") {
          map.set(key, "string");
        }
      }
    }
    return map;
  }, [records]);

  const fieldLabels = useMemo(() => {
    if (!objectSchema) return undefined;
    const labelMap = new Map<string, string>();
    for (const [key, definition] of Object.entries(objectSchema.fields)) {
      labelMap.set(key, definition.label ?? key);
    }
    return labelMap;
  }, [objectSchema]);

  const handleRecordChange = useCallback(
    (index: number, nextRecord: Record<string, unknown>) => {
      if (!canEdit || !onChange) return;
      const baseRecord = objectSchema ? normaliseRecordWithSchema(nextRecord, objectSchema) : nextRecord;
      const next = records.map((record, idx) => (idx === index ? baseRecord : record));
      onChange(mode === "object" ? next.slice(0, 1) : next);
    },
    [canEdit, mode, objectSchema, onChange, records],
  );

  const handleRecordRemove = useCallback(
    (index: number) => {
      if (!canEdit || !onChange) return;
      const next = records.filter((_, idx) => idx !== index);
      onChange(mode === "object" ? next.slice(0, 1) : next);
    },
    [canEdit, mode, onChange, records],
  );

  const canAddMoreRecords = mode === "array" || records.length === 0;

  const handleAddRecord = () => {
    if (!canEdit || !onChange || !canAddMoreRecords) return;
    const template: Record<string, unknown> = objectSchema
      ? normaliseRecordWithSchema({}, objectSchema)
      : (() => {
          if (fieldTypes.size === 0) return {};
          const draft: Record<string, unknown> = {};
          for (const [key, type] of fieldTypes.entries()) {
            if (type === "boolean") {
              draft[key] = false;
            } else if (type === "number") {
              draft[key] = undefined;
            } else {
              draft[key] = "";
            }
          }
          return draft;
        })();
    if (mode === "array") {
      onChange([...records, template]);
    } else {
      onChange([template]);
    }
  };

  if (!records.length) {
    return (
      <div className="space-y-3">
        <div
          className={surfaceClass(
            "border-dashed px-3 py-4 text-center text-sm text-slate-600 dark:text-slate-400",
          )}
        >
          {canEdit
            ? "No entries available. Add one to define structured data."
            : "No entries available."}
        </div>
        {canEdit ? (
          <button
            type="button"
            onClick={handleAddRecord}
            disabled={!canAddMoreRecords}
            className={classNames(
              "inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60",
              !canAddMoreRecords ? "cursor-not-allowed opacity-40 hover:bg-sky-600" : "hover:bg-sky-500",
            )}
          >
            Add entry
          </button>
        ) : null}
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="space-y-3">
        {records.map((record, index) => (
          <div
            key={`structured-ro-${index}`}
            className={surfaceClass(
              "space-y-2 text-sm text-slate-700 dark:text-slate-200",
            )}
          >
            {mode === "array" ? (
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">
                <span>Entry {index + 1}</span>
              </div>
            ) : null}
            <dl className="grid gap-2 sm:grid-cols-2">
              {Object.entries(record).map(([key, raw]) => {
                const display = raw === undefined || raw === null || raw === "" ? "—" : String(raw);
                const label = fieldLabels?.get(key) ?? key;
                return (
                  <div key={key}>
                    <dt className="text-[10px] uppercase tracking-wide text-slate-600 dark:text-slate-500">{label}</dt>
                    <dd>{display}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record, index) => (
        <StructuredRecordEditor
          key={`structured-edit-${index}`}
          index={index}
          record={isPlainObject(record) ? record : {}}
          fieldTypes={fieldTypes}
          fieldLabels={fieldLabels}
          schema={objectSchema}
          allowCustomFields={!objectSchema}
          onChange={(nextRecord) => handleRecordChange(index, nextRecord)}
          onRemove={mode === "array" ? () => handleRecordRemove(index) : undefined}
          showHeader={mode === "array"}
          tone={tone}
        />
      ))}
      {canAddMoreRecords ? (
        <button
          type="button"
          onClick={handleAddRecord}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
        >
          Add entry
        </button>
      ) : null}
    </div>
  );
}

interface StructuredRecordEditorProps {
  index: number;
  record: Record<string, unknown>;
  fieldTypes: ReadonlyMap<string, StructuredFieldType>;
  fieldLabels?: ReadonlyMap<string, string>;
  schema?: StructuredObjectSchemaDefinition;
  allowCustomFields: boolean;
  onChange: (next: Record<string, unknown>) => void;
  onRemove?: () => void;
  showHeader?: boolean;
  tone?: ValueTone;
}

function StructuredRecordEditor({
  index,
  record,
  fieldTypes,
  fieldLabels,
  schema,
  allowCustomFields,
  onChange,
  onRemove,
  showHeader = true,
  tone = "neutral",
}: StructuredRecordEditorProps) {
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldType, setNewFieldType] = useState<StructuredFieldType>("string");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [newFieldBoolean, setNewFieldBoolean] = useState(false);
  const toneClass = SURFACE_TONE_CLASSES[tone] ?? SURFACE_TONE_CLASSES.neutral;
  const surfaceClass = (
    ...extra: Array<string | false | null | undefined>
  ) => classNames("rounded-xl border px-3 py-2", toneClass, ...extra);

  const keys = useMemo(() => {
    if (schema) {
      const ordered = Object.keys(schema.fields);
      const extras = Object.keys(record).filter((key) => !(key in schema.fields));
      return [...ordered, ...extras];
    }
    const set = new Set<string>();
    for (const key of fieldTypes.keys()) {
      set.add(key);
    }
    for (const key of Object.keys(record)) {
      set.add(key);
    }
    return Array.from(set);
  }, [fieldTypes, record, schema]);

  const handleFieldChange = (key: string, type: StructuredFieldType, raw: string) => {
    const next: Record<string, unknown> = { ...record };
    if (type === "number") {
      const definition = schema?.fields?.[key];
      if (raw === "") {
        next[key] = definition?.defaultValue ?? undefined;
      } else {
        const parser =
          definition?.type === "integer"
            ? (value: string) => Number.parseInt(value, 10)
            : (value: string) => Number(value);
        const parsed = parser(raw);
        next[key] = Number.isNaN(parsed) ? definition?.defaultValue ?? undefined : parsed;
      }
    } else {
      next[key] = raw;
    }
    onChange(next);
  };

  const handleBooleanChange = (key: string, checked: boolean) => {
    const next: Record<string, unknown> = { ...record, [key]: checked };
    onChange(next);
  };

  const handleRemoveField = (key: string) => {
    if (!allowCustomFields && schema && key in schema.fields) return;
    const next: Record<string, unknown> = { ...record };
    delete next[key];
    onChange(next);
  };

  const handleAddField = () => {
    if (!allowCustomFields) return;
    const trimmedKey = newFieldKey.trim();
    if (!trimmedKey) return;
    const next: Record<string, unknown> = { ...record };
    if (newFieldType === "boolean") {
      next[trimmedKey] = newFieldBoolean;
    } else if (newFieldType === "number") {
      if (newFieldValue === "") {
        next[trimmedKey] = undefined;
      } else {
        const parsed = Number(newFieldValue);
        next[trimmedKey] = Number.isNaN(parsed) ? undefined : parsed;
      }
    } else {
      next[trimmedKey] = newFieldValue;
    }
    onChange(next);
    setNewFieldKey("");
    setNewFieldValue("");
    setNewFieldBoolean(false);
  };

  return (
    <div
      className={surfaceClass(
        "space-y-4 shadow-sm shadow-slate-200/60 dark:shadow-slate-950/30",
      )}
    >
      {(showHeader || onRemove) && (
        <header className="flex flex-wrap items-center justify-between gap-3">
          {showHeader ? (
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Entry {index + 1}
            </span>
          ) : (
            <span className="sr-only">Entry {index + 1}</span>
          )}
          {onRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs text-rose-600 underline-offset-4 transition hover:text-rose-700 hover:underline dark:text-rose-300 dark:hover:text-rose-200"
            >
              Remove
            </button>
          ) : null}
        </header>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {keys.map((key) => {
          const type =
            fieldTypes.get(key) ?? inferStructuredFieldType(record[key]);
          const rawValue = record[key];
          const label = fieldLabels?.get(key) ?? key;
          const canRemoveField =
            allowCustomFields || !(schema && key in schema.fields);
          if (type === "boolean") {
            return (
              <div
                key={key}
                className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300"
              >
                <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {label}
                </span>
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 transition-colors dark:border-slate-800 dark:bg-slate-950/70">
                  <input
                    type="checkbox"
                    checked={Boolean(rawValue)}
                    onChange={(event) =>
                      handleBooleanChange(key, event.target.checked)
                    }
                    aria-label={label}
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    {Boolean(rawValue) ? "True" : "False"}
                  </span>
                </label>
                {canRemoveField ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveField(key)}
                    className="self-start text-[10px] text-rose-600 underline-offset-4 transition hover:text-rose-700 hover:underline dark:text-rose-300 dark:hover:text-rose-200"
                  >
                    Remove field
                  </button>
                ) : null}
              </div>
            );
          }

          if (type === "number") {
            return (
              <div
                key={key}
                className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300"
              >
                <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {label}
                </span>
                <input
                  type="number"
                  value={
                    typeof rawValue === "number" && Number.isFinite(rawValue)
                      ? rawValue
                      : ""
                  }
                  onChange={(event) =>
                    handleFieldChange(key, "number", event.target.value)
                  }
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
                  aria-label={label}
                />
                {canRemoveField ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveField(key)}
                    className="self-start text-[10px] text-rose-600 underline-offset-4 transition hover:text-rose-700 hover:underline dark:text-rose-300 dark:hover:text-rose-200"
                  >
                    Remove field
                  </button>
                ) : null}
              </div>
            );
          }

          return (
            <div
              key={key}
              className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300"
            >
              <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
              </span>
              <input
                type="text"
                value={rawValue == null ? "" : String(rawValue)}
                onChange={(event) =>
                  handleFieldChange(key, "string", event.target.value)
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
                aria-label={label}
              />
              {canRemoveField ? (
                <button
                  type="button"
                  onClick={() => handleRemoveField(key)}
                  className="self-start text-[10px] text-rose-600 underline-offset-4 transition hover:text-rose-700 hover:underline dark:text-rose-300 dark:hover:text-rose-200"
                >
                  Remove field
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
      {allowCustomFields ? (
        <div className="flex flex-col gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Add field
          </span>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={newFieldKey}
              onChange={(event) => setNewFieldKey(event.target.value)}
              placeholder="Field name"
              className="flex-1 min-w-[140px] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
            />
            <select
              value={newFieldType}
              onChange={(event) =>
                setNewFieldType(event.target.value as StructuredFieldType)
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
            {newFieldType === "boolean" ? (
              <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 transition-colors dark:border-slate-800 dark:bg-slate-950/70">
                <input
                  type="checkbox"
                  checked={newFieldBoolean}
                  onChange={(event) => setNewFieldBoolean(event.target.checked)}
                />
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  {newFieldBoolean ? "True" : "False"}
                </span>
              </label>
            ) : (
              <input
                type={newFieldType === "number" ? "number" : "text"}
                value={newFieldValue}
                onChange={(event) => setNewFieldValue(event.target.value)}
                placeholder="Value"
                className="flex-1 min-w-[120px] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
              />
            )}
            <button
              type="button"
              onClick={handleAddField}
              className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
            >
              Add field
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface StructuredPrimitiveArrayEditorProps {
  schema: StructuredPrimitiveField;
  values: ReadonlyArray<string | number | boolean>;
  onChange?: (next: Array<string | number | boolean>) => void;
  readOnly?: boolean;
  tone?: ValueTone;
}

function StructuredPrimitiveArrayEditor({ schema, values, onChange, readOnly, tone = "neutral" }: StructuredPrimitiveArrayEditorProps) {
  const canEdit = Boolean(onChange) && !readOnly;
  const items = Array.isArray(values) ? values : [];
  const label = schema.label ?? "Value";
  const toneClass = SURFACE_TONE_CLASSES[tone] ?? SURFACE_TONE_CLASSES.neutral;
  const surfaceClass = (
    ...extra: Array<string | false | null | undefined>
  ) => classNames("rounded-xl border px-3 py-2", toneClass, ...extra);
  const inputToneClass = (...extra: Array<string | false | null | undefined>) =>
    classNames("rounded-lg border px-3 py-1.5", toneClass, ...extra);

  const handleStringChange = (index: number, raw: string) => {
    if (!onChange) return;
    const next = items.map((value, idx) => (idx === index ? raw : value));
    onChange(next);
  };

  const handleNumberChange = (index: number, raw: string) => {
    if (!onChange) return;
    if (raw === "") return;
    const parser = schema.type === "integer" ? (value: string) => Number.parseInt(value, 10) : (value: string) => Number(value);
    const parsed = parser(raw);
    if (Number.isNaN(parsed)) return;
    const next = items.map((value, idx) => (idx === index ? parsed : value));
    onChange(next);
  };

  const handleBooleanChange = (index: number, checked: boolean) => {
    if (!onChange) return;
    const next = items.map((value, idx) => (idx === index ? checked : value));
    onChange(next);
  };

  const handleRemove = (index: number) => {
    if (!onChange) return;
    onChange(items.filter((_, idx) => idx !== index));
  };

  const handleAdd = () => {
    if (!onChange) return;
    const base = defaultValueForPrimitiveField(schema);
    let entry: string | number | boolean;
    if (base !== undefined) {
      entry = base;
    } else if (schema.type === "boolean") {
      entry = false;
    } else if (schema.type === "number" || schema.type === "integer") {
      entry = 0;
    } else {
      entry = "";
    }
    onChange([...items, entry]);
  };

  if (!canEdit) {
    if (items.length === 0) {
      return (
        <div
          className={surfaceClass(
            "border-dashed px-3 py-4 text-center text-sm text-slate-600 dark:text-slate-400",
          )}
        >
          No entries available.
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {items.map((value, index) => (
          <div
            key={`primitive-ro-${index}`}
            className={surfaceClass(
              "flex items-center justify-between text-sm text-slate-700 dark:text-slate-200",
            )}
          >
            <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {label} {index + 1}
            </span>
            <span>{value === "" ? "—" : String(value)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {items.length === 0 ? (
          <div
            className={surfaceClass(
              "border-dashed px-3 py-4 text-center text-sm text-slate-600 dark:text-slate-400",
            )}
          >
            No entries available. Add one to get started.
          </div>
        ) : (
          items.map((value, index) => {
            if (schema.type === "boolean") {
              return (
                <div
                  key={`primitive-${index}`}
                  className={surfaceClass(
                    "flex items-center justify-between gap-3",
                  )}
                >
                  <label className="flex flex-1 items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {label} {index + 1}
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(event) => handleBooleanChange(index, event.target.checked)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-[10px] text-rose-600 underline-offset-4 transition hover:text-rose-700 hover:underline dark:text-rose-300 dark:hover:text-rose-200"
                  >
                    Remove
                  </button>
                </div>
              );
            }

            if (schema.type === "number" || schema.type === "integer") {
              return (
                <div
                  key={`primitive-${index}`}
                  className={surfaceClass("flex items-center gap-3")}
                >
                  <div className="flex flex-1 flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
                    <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {label} {index + 1}
                    </span>
                    <input
                      type="number"
                      value={typeof value === "number" && Number.isFinite(value) ? value : ""}
                      onChange={(event) => handleNumberChange(index, event.target.value)}
                      className={inputToneClass(
                        "text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:text-slate-100",
                      )}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-[10px] text-rose-600 underline-offset-4 transition hover:text-rose-700 hover:underline dark:text-rose-300 dark:hover:text-rose-200"
                  >
                    Remove
                  </button>
                </div>
              );
            }

            return (
              <div
                key={`primitive-${index}`}
                className={surfaceClass("flex items-center gap-3")}
              >
                <div className="flex flex-1 flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
                  <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {label} {index + 1}
                  </span>
                  <input
                    type="text"
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => handleStringChange(index, event.target.value)}
                    className={inputToneClass(
                      "text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:text-slate-100",
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-[10px] text-rose-600 underline-offset-4 transition hover:text-rose-700 hover:underline dark:text-rose-300 dark:hover:text-rose-200"
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
      >
        Add entry
      </button>
    </div>
  );
}

type PortForwardVariant = "ipv4" | "ipv6";

interface PortForwardEditorProps {
  value: ReadonlyArray<PortForwardRule>;
  onChange?: (next: PortForwardRule[]) => void;
  readOnly?: boolean;
  variant: PortForwardVariant;
  tone?: ValueTone;
}

function PortForwardEditor({ value, onChange, readOnly, variant, tone = "neutral" }: PortForwardEditorProps) {
  const rules = Array.isArray(value) ? [...value] : [];
  const canEdit = Boolean(onChange) && !readOnly;
  const isIpv6 = variant === "ipv6";
  const toneClass = SURFACE_TONE_CLASSES[tone] ?? SURFACE_TONE_CLASSES.neutral;
  const surfaceClass = (
    ...extra: Array<string | false | null | undefined>
  ) => classNames("rounded-xl border px-3 py-2", toneClass, ...extra);

  const protocolOptions = isIpv6
    ? [
        { value: "1", label: "TCP" },
        { value: "2", label: "UDP" },
        { value: "3", label: "TCP & UDP" },
      ]
    : [
        { value: "1", label: "TCP" },
        { value: "2", label: "UDP" },
        { value: "3", label: "TCP & UDP" },
      ];

  const protocolLabel = (protocol: number | string) => {
    const raw = String(protocol);
    const match = protocolOptions.find((option) => option.value === raw);
    return match ? match.label : raw;
  };

  const updateRule = (index: number, patch: Partial<PortForwardRule>) => {
    if (!canEdit) return;
    const next = rules.map((rule, idx) => (idx === index ? { ...rule, ...patch } : rule));
    onChange?.(next);
  };

  const removeRule = (index: number) => {
    if (!canEdit) return;
    onChange?.(rules.filter((_, idx) => idx !== index));
  };

  const addRule = () => {
    if (!canEdit) return;
    if (isIpv6) {
      const defaultRule: PortForwardIpv6Rule = {
        enabled: true,
        protocol: "1",
        srcAddress: "",
        destAddress: "",
        destPorts: "",
        description: "",
      };
      onChange?.([...rules, defaultRule]);
      return;
    }
    const defaultRule: PortForwardIpv4Rule = {
      enabled: true,
      protocol: 1,
      srcAddr: "",
      extPorts: "",
      intPort: undefined,
      intAddr: "",
      description: "",
    };
    onChange?.([...rules, defaultRule]);
  };

  const renderIpv4ReadOnly = (rule: PortForwardIpv4Rule, index: number) => (
    <div
      key={`pfipv4-ro-${index}`}
      className={surfaceClass(
        "space-y-2 text-sm text-slate-700 dark:text-slate-200",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">
        <span>Rule {index + 1}</span>
        <span>{rule.enabled ? "Enabled" : "Disabled"}</span>
      </div>
      <dl className="grid gap-2 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Protocol</dt>
          <dd>{protocolLabel(rule.protocol)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Source Address</dt>
          <dd>{rule.srcAddr || "Any"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">External Ports</dt>
          <dd>{rule.extPorts || "—"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Internal Port</dt>
          <dd>{rule.intPort != null ? String(rule.intPort) : "Auto"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Internal Address</dt>
          <dd>{rule.intAddr || "—"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Description</dt>
          <dd>{rule.description || "—"}</dd>
        </div>
      </dl>
    </div>
  );

  const renderIpv4Editable = (rule: PortForwardIpv4Rule, index: number) => (
    <div
      key={`pfipv4-edit-${index}`}
      className={surfaceClass(
        "space-y-4 shadow-sm shadow-slate-200/60 dark:shadow-slate-950/30",
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Rule {index + 1}
          </span>
          <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={Boolean(rule.enabled)}
              onChange={(event) => updateRule(index, { enabled: event.target.checked })}
            />
            <span className="text-sm text-slate-700 dark:text-slate-200">
              {rule.enabled ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
        <button
          type="button"
          onClick={() => removeRule(index)}
          className="text-xs text-rose-600 underline-offset-4 transition hover:text-rose-700 hover:underline dark:text-rose-300 dark:hover:text-rose-200"
        >
          Remove
        </button>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Protocol</span>
          <select
            value={String(rule.protocol)}
            onChange={(event) => {
              const raw = event.target.value;
              const parsed = Number(raw);
              const valid = [1, 2, 3].includes(parsed) ? parsed : 1;
              updateRule(index, { protocol: valid });
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
          >
            {protocolOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Source Address</span>
          <input
            type="text"
            value={rule.srcAddr}
            onChange={(event) => updateRule(index, { srcAddr: event.target.value })}
            placeholder="0.0.0.0/0"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">External Ports</span>
          <input
            type="text"
            value={rule.extPorts}
            onChange={(event) => updateRule(index, { extPorts: event.target.value })}
            placeholder="80-80"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Internal Port</span>
          <input
            type="number"
            value={rule.intPort ?? ""}
            onChange={(event) => {
              const rawValue = event.target.value;
              if (rawValue === "") {
                updateRule(index, { intPort: undefined });
                return;
              }
              const parsedValue = Number(rawValue);
              updateRule(index, {
                intPort: Number.isNaN(parsedValue) || !Number.isFinite(parsedValue) ? undefined : parsedValue,
              });
            }}
            placeholder="auto"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Internal Address</span>
          <input
            type="text"
            value={rule.intAddr}
            onChange={(event) => updateRule(index, { intAddr: event.target.value })}
            placeholder="192.168.1.2"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300 sm:col-span-2">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Description</span>
          <input
            type="text"
            value={rule.description}
            onChange={(event) => updateRule(index, { description: event.target.value })}
            placeholder="Web Server"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
          />
        </label>
      </div>
    </div>
  );

  const renderIpv6ReadOnly = (rule: PortForwardIpv6Rule, index: number) => (
    <div
      key={`pfipv6-ro-${index}`}
      className={surfaceClass(
        "space-y-2 text-sm text-slate-700 dark:text-slate-200",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">
        <span>Rule {index + 1}</span>
        <span>{rule.enabled ? "Enabled" : "Disabled"}</span>
      </div>
      <dl className="grid gap-2 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Protocol</dt>
          <dd>{protocolLabel(rule.protocol)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Source Address</dt>
          <dd>{rule.srcAddress || "Any"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Destination Address</dt>
          <dd>{rule.destAddress || "—"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Destination Ports</dt>
          <dd>{rule.destPorts || "—"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Description</dt>
          <dd>{rule.description || "—"}</dd>
        </div>
      </dl>
    </div>
  );

  const renderIpv6Editable = (rule: PortForwardIpv6Rule, index: number) => (
    <div
      key={`pfipv6-edit-${index}`}
      className={surfaceClass(
        "space-y-4 shadow-sm shadow-slate-200/60 dark:shadow-slate-950/30",
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Rule {index + 1}
          </span>
          <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={Boolean(rule.enabled)}
              onChange={(event) => updateRule(index, { enabled: event.target.checked })}
            />
            <span className="text-sm text-slate-700 dark:text-slate-200">
              {rule.enabled ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
        <button
          type="button"
          onClick={() => removeRule(index)}
          className="text-xs text-rose-600 underline-offset-4 transition hover:text-rose-700 hover:underline dark:text-rose-300 dark:hover:text-rose-200"
        >
          Remove
        </button>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Protocol</span>
          <select
            value={String(rule.protocol)}
            onChange={(event) => {
              const raw = event.target.value as "1" | "2" | "3";
              const valid = ["1", "2", "3"].includes(raw) ? raw : "1";
              updateRule(index, { protocol: valid });
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
          >
            {protocolOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Source Address</span>
          <input
            type="text"
            value={rule.srcAddress}
            onChange={(event) => updateRule(index, { srcAddress: event.target.value })}
            placeholder="::/0"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Destination Address</span>
          <input
            type="text"
            value={rule.destAddress}
            onChange={(event) => updateRule(index, { destAddress: event.target.value })}
            placeholder="2001:db8::100"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Destination Ports</span>
          <input
            type="text"
            value={rule.destPorts}
            onChange={(event) => updateRule(index, { destPorts: event.target.value })}
            placeholder="80-80"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300 sm:col-span-2">
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Description</span>
          <input
            type="text"
            value={rule.description}
            onChange={(event) => updateRule(index, { description: event.target.value })}
            placeholder="Service"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {rules.length === 0 ? (
        <div
          className={surfaceClass(
            "border-dashed px-3 py-4 text-center text-sm text-slate-600 dark:text-slate-400",
          )}
        >
          {canEdit
            ? "No port forwarding rules. Add one to get started."
            : "No port forwarding rules configured."}
        </div>
      ) : canEdit ? (
        rules.map((rule, index) =>
          isIpv6
            ? renderIpv6Editable(rule as PortForwardIpv6Rule, index)
            : renderIpv4Editable(rule as PortForwardIpv4Rule, index),
        )
      ) : (
        rules.map((rule, index) =>
          isIpv6
            ? renderIpv6ReadOnly(rule as PortForwardIpv6Rule, index)
            : renderIpv4ReadOnly(rule as PortForwardIpv4Rule, index),
        )
      )}
      {canEdit ? (
        <button
          type="button"
          onClick={addRule}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
        >
          Add rule
        </button>
      ) : null}
    </div>
  );
}

interface SelectionChipsProps {
  current: SelectionOption;
  onSelect?: (option: Exclude<SelectionOption, "custom">) => void;
  onSelectCustom?: () => void;
  disabledOptions?: Partial<Record<Exclude<SelectionOption, "custom">, boolean>>;
  showEdited?: boolean;
  sidesIdentical?: boolean;
}

function SelectionChips({
  current,
  onSelect,
  onSelectCustom,
  disabledOptions,
  showEdited,
  sidesIdentical = false,
}: SelectionChipsProps) {
  const standardOptions: Array<{ value: Exclude<SelectionOption, "custom">; label: string }> = [
    { value: "left", label: "Keep Left" },
    { value: "right", label: "Keep Right" },
    { value: "remove", label: "Remove" },
  ];
  const optionToneMap: Record<Exclude<SelectionOption, "custom">, ValueTone> = {
    left: "left",
    right: "right",
    remove: "neutral",
  };
  const disabledToneClass = "cursor-not-allowed text-slate-400 dark:text-slate-600";

  const renderOptionButton = (option: { value: Exclude<SelectionOption, "custom">; label: string }) => {
    const active = current === option.value;
    const disabled = disabledOptions?.[option.value] ?? false;
    const tone = optionToneMap[option.value];
    return (
      <button
        key={option.value}
        onClick={() => {
          if (disabled) return;
          onSelect?.(option.value);
        }}
        className={classNames(
          "rounded-full px-3 py-1 text-[11px] font-medium transition whitespace-nowrap",
          disabled
            ? disabledToneClass
            : active
            ? CHIP_TONE_ACTIVE_CLASSES[tone]
            : CHIP_TONE_BASE_CLASSES[tone],
        )}
        disabled={disabled}
      >
        {option.label}
      </button>
    );
  };

  const renderUnifiedButton = () => {
    const leftDisabled = disabledOptions?.left ?? false;
    const rightDisabled = disabledOptions?.right ?? false;
    const unifiedDisabled = leftDisabled && rightDisabled;
    const unifiedActive = current === "left" || current === "right";
    const targetOption: Exclude<SelectionOption, "custom"> = leftDisabled && !rightDisabled ? "right" : "left";
    const tone: ValueTone = "both";

    return (
      <button
        type="button"
        onClick={() => {
          if (unifiedDisabled) return;
          if (targetOption === "left" && leftDisabled) return;
          if (targetOption === "right" && rightDisabled) return;
          onSelect?.(targetOption);
        }}
        className={classNames(
          "rounded-full px-3 py-1 text-[11px] font-medium transition whitespace-nowrap",
          unifiedDisabled
            ? disabledToneClass
            : unifiedActive
            ? CHIP_TONE_ACTIVE_CLASSES[tone]
            : CHIP_TONE_BASE_CLASSES[tone],
        )}
        disabled={unifiedDisabled}
      >
        Keep Unchanged
      </button>
    );
  };

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
      {showEdited ? (
        <button
          type="button"
          onClick={() => onSelectCustom?.()}
          className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 whitespace-nowrap dark:bg-amber-500/20 dark:text-amber-200 dark:hover:bg-amber-500/30"
        >
          User Provided
        </button>
      ) : null}
      {sidesIdentical ? (
        <>
          {renderUnifiedButton()}
          {renderOptionButton({ value: "remove", label: "Remove" })}
        </>
      ) : (
        standardOptions.map(renderOptionButton)
      )}
    </div>
  );
}

export default App;
