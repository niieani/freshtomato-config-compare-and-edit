import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { decodeCfg, encodeCfg } from "@/nvram/nvram-cfg";
import { multilineScriptTransformer } from "@/nvram/nvram-catalog-types";
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
import "./index.css";

type SelectionOption = "left" | "right" | "custom" | "remove";

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

function parseStoredConfig(raw: string): LoadedConfig | null {
  try {
    const data = JSON.parse(raw) as Partial<LoadedConfig> | null;
    if (!data || typeof data !== "object") {
      return null;
    }
    const { id, name, size, header, fileLength, entries, loadedAt, salt } = data;
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
    for (const [key, value] of Object.entries(entries as Record<string, unknown>)) {
      normalised[key] = typeof value === "string" ? value : value == null ? "" : String(value);
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

type DiffFilter = "all" | "changed" | "added" | "removed";

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
  unchanged: "bg-slate-800/40 text-slate-200 border border-slate-700/60",
  changed: "bg-amber-500/15 text-amber-200 border border-amber-400/40",
  added: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40",
  removed: "bg-rose-500/15 text-rose-200 border border-rose-400/40",
};

const PRIMARY_DIFF_BADGE_THEME: Record<DiffStatus, string> = {
  ...DIFF_BADGE_THEME,
  changed: "bg-indigo-500/20 text-indigo-200 border border-indigo-400/50",
};

type ControlType =
  | "boolean"
  | "select"
  | "number"
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

function resolveControlType(field: ResolvedField): ControlType {
  if (field.options && field.options.length > 0) return "select";
  if (field.transform === multilineScriptTransformer) return "textarea";
  switch (field.type) {
    case "boolean":
      return "boolean";
    case "integer":
      return "number";
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
    case "number": {
      const uiValue = field.toUi(raw);
      if (uiValue === null || uiValue === undefined || uiValue === "") return "";
      if (typeof uiValue === "number") return uiValue;
      const parsed = Number(raw ?? "");
      return Number.isNaN(parsed) ? "" : parsed;
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
        return [uiValue];
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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

type StructuredFieldType = "boolean" | "number" | "string";

function inferStructuredFieldType(value: unknown): StructuredFieldType {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number" && Number.isFinite(value)) return "number";
  return "string";
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const idx = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / 1024 ** idx;
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[idx]}`;
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

function generateNvramScript(entries: NvramEntries, diffToLeft: DiffEntry[]): string {
  const lines: string[] = [];
  for (const entry of diffToLeft) {
    if (entry.status === "unchanged") continue;
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

function fallbackField(key: string): ResolvedField {
  const label = labelFromKey(key);
  return {
    key,
    page: UNCATEGORISED_PAGE_ID,
    label,
    description: "No catalog metadata available for this key. Displaying raw value.",
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
  const [leftConfig, setLeftConfig] = useState<LoadedConfig | null>(null);
  const [rightConfig, setRightConfig] = useState<LoadedConfig | null>(null);
  const [selections, setSelections] = useState<Record<string, SelectionState>>({});
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("changed");
  const [focusPending, setFocusPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScript, setShowScript] = useState(false);

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
      console.warn("Failed to restore primary configuration from storage", restoreError);
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
      console.warn("Failed to restore comparison configuration from storage", restoreError);
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
        localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(rightConfig));
      } else {
        localStorage.removeItem(COMPARISON_STORAGE_KEY);
      }
    } catch (persistError) {
      console.warn("Failed to persist comparison configuration", persistError);
    }
  }, [rightConfig]);

  const handleLoad = useCallback(
    async (file: File, side: "left" | "right") => {
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
        setError(err instanceof Error ? err.message : "Failed to parse .cfg file.");
      }
    },
    [],
  );

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
        const leftHas = leftEntries ? Object.prototype.hasOwnProperty.call(leftEntries, key) : false;
        const rightHas = rightEntries ? Object.prototype.hasOwnProperty.call(rightEntries, key) : false;

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
    () => computeDiff(leftEntries, Object.keys(finalEntries).length ? finalEntries : null),
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

  const fieldViews = useMemo(() => {
    const pages = new Map<string, FieldView[]>();
    for (const key of allKeys) {
      const resolved = resolveField(key) ?? fallbackField(key);
      let pageId = resolved.page ?? UNCATEGORISED_PAGE_ID;

      const diff = diffLeftRight.byKey.get(key) ?? {
        key,
        left: leftEntries?.[key],
        right: rightEntries?.[key],
        status: "unchanged" as DiffStatus,
      };

      const finalDiff = diffLeftFinal.byKey.get(key) ?? {
        key,
        left: leftEntries?.[key],
        right: finalEntries[key],
        status:
          finalEntries[key] === undefined && leftEntries?.[key] === undefined
            ? ("unchanged" as DiffStatus)
            : (leftEntries?.[key] === finalEntries[key]
                ? ("unchanged" as DiffStatus)
                : ((finalEntries[key] === undefined
                    ? "removed"
                    : leftEntries?.[key] === undefined
                      ? "added"
                      : "changed") as DiffStatus)),
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
  }, [allKeys, diffLeftRight, diffLeftFinal, finalEntries, leftEntries, rightEntries, selections]);

  const filteredPages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const result: Array<{
      id: string;
      title: string;
      displayTitle: string;
      entries: FieldView[];
      groupKey: string;
      groupLabel: string;
      hasMatches: boolean;
      sortOrder: number;
    }> = [];

    const getGroupMeta = (pageId: string, title: string) => {
      if (pageId === UNCATEGORISED_PAGE_ID || UNCATALOGUED_VARIANT_BY_ID.has(pageId)) {
        return {
          groupKey: "uncatalogued",
          groupLabel: "Uncatalogued",
        };
      }
      const [group] = title.split(/[-_/]/);
      const key = group || "other";
      return {
        groupKey: key,
        groupLabel: key.toUpperCase(),
      };
    };

    for (const [pageId, entries] of fieldViews.entries()) {
      const variantMeta = UNCATALOGUED_VARIANT_BY_ID.get(pageId);
      const title = variantMeta
        ? variantMeta.title
        : pageId === UNCATEGORISED_PAGE_ID
          ? UNCATEGORISED_PAGE_LABEL
          : prettifyPageId(pageId);

      const filtered = entries.filter((entry) => {
        const matchesQuery =
          !query ||
          entry.key.toLowerCase().includes(query) ||
          entry.field.label.toLowerCase().includes(query) ||
          entry.field.description.toLowerCase().includes(query);

        if (!matchesQuery) return false;

        const filterMatches =
          diffFilter === "all" ? true : entry.diff.status === diffFilter;

        if (!filterMatches) return false;

        if (focusPending) {
          return entry.finalDiff.status !== "unchanged";
        }

        return true;
      });

      const { groupKey, groupLabel } = getGroupMeta(pageId, title);
      const prefix = `${groupKey}-`;
      const displayTitle = title.startsWith(prefix) ? title.slice(prefix.length) : title;
      const sortOrder = variantMeta?.order ?? 0;

      if (filtered.length > 0) {
        result.push({
          id: pageId,
          title,
          displayTitle: displayTitle || title,
          entries: filtered,
          groupKey,
          groupLabel,
          hasMatches: true,
          sortOrder,
        });
      } else if (pageId === activePageId) {
        result.push({
          id: pageId,
          title,
          displayTitle: displayTitle || title,
          entries: [],
          groupKey,
          groupLabel,
          hasMatches: false,
          sortOrder,
        });
      }
    }

    const normaliseGroupKey = (key: string) =>
      key === "uncatalogued" ? "zzzzzzzz" : key;

    result.sort((a, b) => {
      const groupCompare = normaliseGroupKey(a.groupKey).localeCompare(
        normaliseGroupKey(b.groupKey),
      );
      if (groupCompare !== 0) {
        return groupCompare;
      }
      const orderCompare = a.sortOrder - b.sortOrder;
      if (orderCompare !== 0) {
        return orderCompare;
      }
      return a.title.localeCompare(b.title);
    });
    return result;
  }, [activePageId, diffFilter, fieldViews, focusPending, searchTerm]);

  const groupedPages = useMemo(() => {
    const groups = new Map<
      string,
      {
        key: string;
        label: string;
        pages: Array<(typeof filteredPages)[number]>;
        position: number;
      }
    >();
    for (const page of filteredPages) {
      if (!groups.has(page.groupKey)) {
        const position = page.groupKey === "__uncatalogued__" ? Number.POSITIVE_INFINITY : groups.size;
        groups.set(page.groupKey, {
          key: page.groupKey,
          label: page.groupLabel,
          pages: [],
          position,
        });
      }
      groups.get(page.groupKey)!.pages.push(page);
    }
    return Array.from(groups.values()).sort((a, b) => a.position - b.position || a.label.localeCompare(b.label));
  }, [filteredPages]);

  const selectedPage = activePageId
    ? filteredPages.find((page) => page.id === activePageId) ?? null
    : filteredPages[0] ?? null;

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCollapsedGroups((prev) => {
      const next: Record<string, boolean> = {};
      for (const group of groupedPages) {
        const hasActive = group.pages.some((page) => page.id === (selectedPage?.id ?? null));
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

  const totalPending = diffLeftFinal.entries.filter((entry) => entry.status !== "unchanged").length;

  const scriptText = useMemo(
    () => generateNvramScript(finalEntries, diffLeftFinal.entries),
    [diffLeftFinal.entries, finalEntries],
  );

  const handleUpdateSelection = useCallback(
    (key: string, state: SelectionState) => {
      setSelections((prev) => ({
        ...prev,
        [key]: state,
      }));
    },
    [],
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
      const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
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

  const handleCopyScript = useCallback(async () => {
    await navigator.clipboard.writeText(scriptText);
  }, [scriptText]);

  const summaryCards = [
    {
      label: "Changed",
      value: diffLeftRight.counts.changed,
      tone: "text-amber-300",
    },
    {
      label: "Added",
      value: diffLeftRight.counts.added,
      tone: "text-emerald-300",
    },
    {
      label: "Removed",
      value: diffLeftRight.counts.removed,
      tone: "text-rose-300",
    },
    {
      label: "Pending edits",
      value: totalPending,
      tone: "text-sky-300",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                FreshTomato NVRAM Workspace
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-400">
                Inspect, compare, and craft configuration backups visually. Start by dropping a
                FreshTomato <code className="rounded bg-slate-900 px-2 py-1">.cfg</code> file.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {summaryCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center"
                >
                  <div className={classNames("text-lg font-semibold", card.tone)}>{card.value}</div>
                  <div className="text-[12px] uppercase tracking-wide text-slate-500">
                    {card.label}
                  </div>
                </div>
              ))}
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
            <SwapButton disabled={!leftConfig || !rightConfig} onSwap={handleSwap} />
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

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-72 shrink-0 border-r border-slate-900 bg-slate-950/60 backdrop-blur md:flex md:flex-col">
          <div className="p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Pages</div>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {groupedPages.map((group) => {
              const collapsed = collapsedGroups[group.key] ?? false;
              const activeInGroup = group.pages.some((page) => page.id === (selectedPage?.id ?? null));
              return (
                <div key={group.key} className="pb-2">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.key)}
                    className={classNames(
                      "flex w-full items-center justify-between px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide transition",
                      activeInGroup ? "text-slate-200" : "text-slate-500 hover:text-slate-300",
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
                  <div className={classNames("space-y-0.5", collapsed ? "hidden" : "block")}>
                    {group.pages.map((page) => {
                      const isActive = page.id === (selectedPage?.id ?? null);
                      const pendingCount = page.entries.filter(
                        (entry) => entry.finalDiff.status !== "unchanged",
                      ).length;
                      return (
                        <button
                          key={page.id}
                          onClick={() => setActivePageId(page.id)}
                          className={classNames(
                            "flex w-full items-center justify-between py-2 pl-6 pr-4 text-left text-sm transition",
                            isActive
                              ? "bg-slate-900/80 text-white"
                              : "text-slate-400 hover:bg-slate-900/40 hover:text-slate-200",
                          )}
                        >
                          <span className="flex-1 truncate">{page.displayTitle}</span>
                          {pendingCount > 0 ? (
                            <span className="ml-3 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-sky-500/20 px-2 text-xs text-sky-200">
                              {pendingCount}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {filteredPages.length === 0 ? (
              <div className="px-4 py-8 text-sm text-slate-500">No pages match the filters.</div>
            ) : null}
          </nav>
          <div className="border-t border-slate-900 p-4 text-xs text-slate-500">
            {leftConfig ? (
              <div className="space-y-2">
                <div>
                  <div className="font-medium text-slate-300">Baseline</div>
                  <div className="truncate">{leftConfig.name}</div>
                  <div>{formatBytes(leftConfig.size)}</div>
                </div>
                {rightConfig ? (
                  <div>
                    <div className="font-medium text-slate-300">Comparison</div>
                    <div className="truncate">{rightConfig.name}</div>
                    <div>{formatBytes(rightConfig.size)}</div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div>Awaiting primary configuration…</div>
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search by key, label, or description…"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 shadow-inner shadow-slate-950 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>
              <DiffFilterToggle value={diffFilter} onChange={setDiffFilter} />
              <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-xs uppercase tracking-wide text-slate-400">
                <input
                  type="checkbox"
                  checked={focusPending}
                  onChange={(event) => setFocusPending(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500"
                />
                Show only pending edits
              </label>
            </div>

            {selectedPage ? (
              <section>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedPage.title}</h2>
                    <p className="text-sm text-slate-400">
                      {selectedPage.entries.length} field
                      {selectedPage.entries.length === 1 ? "" : "s"} in view
                    </p>
                  </div>
                  <button
                    onClick={handleAddCustomKey}
                    className="inline-flex items-center gap-2 rounded-lg border border-sky-500/60 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-200 transition hover:border-sky-400 hover:bg-sky-500/20"
                  >
                    + Add custom key
                  </button>
                </div>

                {selectedPage.entries.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPage.entries.map((entry) => (
                      <FieldCard
                        key={entry.key}
                        entry={entry}
                        onSelectionChange={handleUpdateSelection}
                        onRemoveCustom={handleRemoveCustomKey}
                        hasRight={!!rightConfig}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-900 bg-slate-900/60 px-4 py-8 text-center text-sm text-slate-400">
                    No fields match the current filters on this page.
                  </div>
                )}
              </section>
            ) : (
              <div className="rounded-xl border border-slate-900 bg-slate-900/50 px-6 py-12 text-center text-slate-400">
                No fields to display yet. Load a configuration to begin.
              </div>
            )}
          </div>
        </main>

        <aside className="hidden w-[22rem] shrink-0 border-l border-slate-900 bg-slate-950/60 backdrop-blur lg:flex lg:flex-col">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white">Preview & export</h3>
            <p className="mt-1 text-sm text-slate-400">
              Generate a curated backup or script reflecting the selections you have applied.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-4">
                <h4 className="text-sm font-semibold text-slate-200">Pending edits</h4>
                <p className="mt-1 text-xs text-slate-400">
                  {totalPending} change
                  {totalPending === 1 ? "" : "s"} relative to the baseline file.
                </p>
                <ul className="mt-2 space-y-1 text-xs text-slate-300">
                  {diffLeftFinal.entries
                    .filter((entry) => entry.status !== "unchanged")
                    .slice(0, 12)
                    .map((entry) => (
                      <li key={entry.key} className="flex items-center justify-between gap-2">
                        <span className="truncate">{entry.key}</span>
                        <span
                          className={classNames(
                            "whitespace-nowrap rounded-full px-2 py-0.5 text-[11px]",
                            DIFF_BADGE_THEME[entry.status],
                          )}
                        >
                          {entry.status}
                        </span>
                      </li>
                    ))}
                  {totalPending === 0 ? <li>No changes yet.</li> : null}
                  {totalPending > 12 ? (
                    <li className="text-slate-500">…and {totalPending - 12} more.</li>
                  ) : null}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-4">
                <h4 className="text-sm font-semibold text-slate-200">Download backup</h4>
                <div className="mt-3 grid gap-2">
                  <button
                    onClick={() => handleDownloadCfg(leftConfig?.header ?? "HDR2")}
                    className="rounded-lg border border-sky-500/60 bg-sky-500/15 px-3 py-2 text-sm font-medium text-sky-200 transition hover:border-sky-400 hover:bg-sky-500/25"
                  >
                    Export as {leftConfig?.header ?? "HDR2"}
                  </button>
                  <button
                    onClick={() => handleDownloadCfg(leftConfig?.header === "HDR1" ? "HDR2" : "HDR1")}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-800"
                  >
                    Export as {leftConfig?.header === "HDR1" ? "HDR2" : "HDR1"}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-200">NVRAM CLI Script</h4>
                  <button
                    onClick={() => setShowScript((prev) => !prev)}
                    className="text-xs text-sky-300 underline-offset-4 hover:underline"
                  >
                    {showScript ? "Hide" : "Show"}
                  </button>
                </div>
                {showScript ? (
                  <div className="mt-3 space-y-2">
                    <pre className="max-h-64 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-200">
                      {scriptText || "# No changes to apply"}
                    </pre>
                    <button
                      onClick={handleCopyScript}
                      className="w-full rounded-lg border border-emerald-500/60 bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-200 transition hover:border-emerald-400 hover:bg-emerald-500/25"
                    >
                      Copy script
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </aside>
      </div>
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
            ? "cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-600"
            : "border-slate-700 bg-slate-900/70 text-slate-200 hover:border-sky-500/60 hover:text-sky-200",
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
        "group relative flex cursor-pointer flex-col gap-3 rounded-2xl border border-dashed border-slate-800 bg-slate-950/70 px-6 py-6 transition",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:border-sky-500/50 hover:bg-slate-900/80",
        isDragging && !disabled ? "border-sky-400/70 bg-sky-500/5" : "",
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
          aria-label={`Remove ${side === "left" ? "primary" : "comparison"} configuration`}
          className="absolute right-3 top-3 rounded-full border border-transparent bg-slate-900/80 p-1.5 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
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
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-sm font-semibold uppercase tracking-wide text-slate-400",
            side === "left" ? "border-sky-500/50 text-sky-300" : "border-emerald-500/50 text-emerald-300",
          )}
        >
          {side === "left" ? "L" : "R"}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-slate-400">{subtitle}</div>
        </div>
      </div>

      {config ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-300">
          <div className="truncate font-medium text-slate-200">{config.name}</div>
          <div className="mt-2 grid grid-cols-2 gap-1 leading-relaxed">
            <InfoItem label="Entries" value={Object.keys(config.entries).length.toString()} />
            <InfoItem label="Size" value={formatBytes(config.size)} />
            <InfoItem label="Header" value={config.header} />
            {config.salt !== undefined ? (
              <InfoItem label="Salt" value={`0x${config.salt.toString(16).padStart(2, "0")}`} />
            ) : (
              <InfoItem label="Length" value={`${config.fileLength} B`} />
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Loaded {formatTimestamp(config.loadedAt)}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-5 text-center text-sm text-slate-500">
          Drop file here or click to browse
        </div>
      )}
    </label>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-xs text-slate-300">{value}</div>
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
    { value: "changed", label: "Changed" },
    { value: "added", label: "Added" },
    { value: "removed", label: "Removed" },
  ];
  return (
    <div className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/70 p-1 text-xs text-slate-300">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={classNames(
              "rounded-lg px-3 py-1.5 transition",
              active
                ? "bg-slate-800 text-white shadow-[0_0_0_1px_rgba(148,163,184,0.35)]"
                : "text-slate-400 hover:text-slate-200",
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
}

function FieldCard({ entry, onSelectionChange, onRemoveCustom, hasRight }: FieldCardProps) {
  const { key, field, diff, finalDiff, selection } = entry;
  const isFallback = field.raw === null;
  const controlType = resolveControlType(field);
  const leftValue = coerceDisplayValue(field, entry.leftRaw, controlType);
  const rightValue = coerceDisplayValue(field, entry.rightRaw, controlType);
  const workingValue = coerceDisplayValue(field, entry.workingRaw, controlType);
  const sidesIdentical =
    hasRight &&
    entry.leftRaw !== undefined &&
    entry.rightRaw !== undefined &&
    entry.leftRaw === entry.rightRaw;

  const selectionValue = selection?.option ?? (entry.leftRaw !== undefined ? "left" : "remove");
  const disabledOptions = {
    left: entry.leftRaw === undefined,
    right: !hasRight || entry.rightRaw === undefined,
  } as const;

  const handleCustomChange = (value: unknown) => {
    onSelectionChange(key, { option: "custom", customRaw: field.fromUi(value) });
  };

  const handleBooleanChange = (value: boolean) => {
    onSelectionChange(key, { option: "custom", customRaw: field.fromUi(value) });
  };

  const handleNumberChange = (value: string) => {
    const parsed = value === "" ? "" : Number(value);
    onSelectionChange(key, {
      option: "custom",
      customRaw: field.fromUi(parsed === "" ? "" : parsed),
    });
  };

  const handleListChange = (value: string[]) => {
    onSelectionChange(key, {
      option: "custom",
      customRaw: field.fromUi(value),
    });
  };

  const handleSelectOption = (option: Exclude<SelectionOption, "custom">) => {
    if (option === "left" && entry.leftRaw === undefined) return;
    if (option === "right" && (entry.rightRaw === undefined || !hasRight)) return;
    onSelectionChange(key, { option });
  };

  const handleSelectEdited = () => {
    onSelectionChange(key, { option: "custom", customRaw: field.fromUi(workingValue) });
  };

  const finalBadge = finalDiff.status !== "unchanged" && (
    <span
      className={classNames(
        "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium",
        DIFF_BADGE_THEME[finalDiff.status],
      )}
    >
      {finalDiff.status.toUpperCase()}
    </span>
  );

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm shadow-slate-950/30">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-white" title={field.label}>
              {key}
            </h3>
            <span
              className={classNames(
                "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium",
                PRIMARY_DIFF_BADGE_THEME[diff.status],
              )}
            >
              {diff.status === "changed" ? "DIFFERENT" : diff.status.toUpperCase()}
            </span>
          </div>
          {field.description ? (
            <p className="text-xs leading-relaxed text-slate-400">{field.description}</p>
          ) : null}
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end md:gap-2 md:min-w-[320px]">
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

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ValueColumn
          title={sidesIdentical ? "Left and Right" : "Left"}
          controlType={controlType}
          hint={entry.leftRaw === undefined ? "Not present" : undefined}
          value={leftValue}
          field={field}
          readOnly
          options={field.options}
          className={sidesIdentical ? "md:col-span-2" : undefined}
        />
        {!sidesIdentical ? (
          <ValueColumn
            title="Right"
            controlType={controlType}
            hint={
              hasRight
                ? entry.rightRaw === undefined
                  ? "Not present"
                  : undefined
                : "No file loaded"
            }
            value={rightValue}
            field={field}
            readOnly
            options={field.options}
          />
        ) : null}
        <ValueColumn
          title="Working"
          controlType={controlType}
          value={workingValue}
          field={field}
          onCustomChange={handleCustomChange}
          onBooleanChange={handleBooleanChange}
          onNumberChange={handleNumberChange}
          onListChange={handleListChange}
          isRemovable={isFallback && entry.leftRaw === undefined && entry.rightRaw === undefined}
          onRemoveCustom={onRemoveCustom}
          fieldKey={key}
          options={field.options}
          className={sidesIdentical ? "md:col-span-1" : undefined}
        />
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
  onNumberChange?: (value: string) => void;
  onListChange?: (value: string[]) => void;
  isRemovable?: boolean;
  onRemoveCustom?: (key: string) => void;
  fieldKey?: string;
  options?: ResolvedField["options"];
  className?: string;
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
}: ValueColumnProps) {
  const portForwardVariant: PortForwardVariant = field.key === "ipv6_portforward" ? "ipv6" : "ipv4";

  const renderBooleanVisual = (checked: boolean) => (
    <div className="flex items-center gap-2">
      <span
        className={classNames(
          "relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full border transition-colors duration-200",
          checked ? "border-sky-500 bg-sky-500/80" : "border-rose-500 bg-rose-500/30",
        )}
      >
        <span
          className={classNames(
            "absolute left-[2px] h-4 w-4 translate-x-0 rounded-full bg-white transition-transform duration-200",
            checked ? "translate-x-4" : "",
          )}
        />
      </span>
      <span
        className={classNames(
          "text-xs font-semibold tracking-wide",
          checked ? "text-sky-300" : "text-rose-300",
        )}
      >
        {checked ? "ENABLED" : "DISABLED"}
      </span>
    </div>
  );

  const renderControl = () => {
    if (readOnly) {
      if (hint) {
        return (
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-500">
            {hint}
          </div>
        );
      }
      if (controlType === "boolean") {
        return (
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            {renderBooleanVisual(Boolean(value))}
          </div>
        );
      }
      if (controlType === "list") {
        const items = Array.isArray(value)
          ? (value as string[])
          : typeof value === "string"
            ? value.split(",").map((part) => part.trim()).filter((part) => part.length > 0)
            : [];
        return <ListInput value={items} readOnly />;
      }
      if (controlType === "structured") {
        const records = Array.isArray(value)
          ? (value as Array<Record<string, unknown>>)
          : [];
        return <StructuredStringEditor value={records} readOnly />;
      }
      if (controlType === "ip" || controlType === "mac" || controlType === "netmask" || controlType === "hex") {
        const display = value == null || value === "" ? "—" : String(value);
        return (
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
            <code className="font-mono text-slate-100">{display}</code>
          </div>
        );
      }
      if (controlType === "portforward") {
        const rules = Array.isArray(value) ? (value as PortForwardRule[]) : [];
        return <PortForwardEditor value={rules} variant={portForwardVariant} readOnly />;
      }
      return (
        <pre className="max-h-40 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 font-mono text-sm text-slate-200">
          {(() => {
            if (value === null || value === undefined || value === "") {
              return <span className="text-slate-500">&lt;EMPTY&gt;</span>;
            }
            if (controlType === "select" && options && options.length > 0) {
              const match = options.find((option) => String(option.value) === String(value));
              return match ? `${match.label} (${value})` : formatDisplay(value, controlType);
            }
            return formatDisplay(value, controlType);
          })()}
        </pre>
      );
    }

    if (controlType === "boolean") {
      return (
        <label className="inline-flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onBooleanChange?.(event.target.checked)}
            className="peer sr-only"
            aria-label={field.label || field.key || title}
          />
          <span className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full border border-rose-500/60 bg-rose-500/30 transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-sky-500 peer-checked:border-sky-500 peer-checked:bg-sky-500/80">
            <span className="absolute left-[2px] h-4 w-4 translate-x-0 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-4" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-rose-300 transition-colors duration-200 peer-checked:text-sky-300">
            {Boolean(value) ? "ENABLED" : "DISABLED"}
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
      return <PortForwardEditor value={rules} onChange={handleChange} variant={portForwardVariant} />;
    }

    if (controlType === "ip" || controlType === "mac" || controlType === "netmask" || controlType === "hex") {
      const stringValue = typeof value === "string" ? value : value == null ? "" : String(value);
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
            onChange={(event) => onCustomChange?.(event.target.value.toUpperCase())}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 font-mono text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
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
            onChange={(event) => onCustomChange?.(event.target.value.toUpperCase())}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 font-mono text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            spellCheck={false}
          />
        );
      }

      const inputMode = controlType === "ip" || controlType === "netmask" ? "decimal" : undefined;
      return (
        <input
          type="text"
          value={stringValue}
          onChange={(event) => onCustomChange?.(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 font-mono text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          inputMode={inputMode}
          spellCheck={false}
        />
      );
    }

    if (controlType === "list") {
      const items = Array.isArray(value)
        ? (value as string[])
        : typeof value === "string"
          ? value.split(",").map((part) => part.trim()).filter((part) => part.length > 0)
          : [];
      const handleChange = (next: string[]) => {
        if (onListChange) {
          onListChange(next);
        } else if (onCustomChange) {
          onCustomChange(next);
        }
      };

      return (
        <ListInput
          value={items}
          onChange={handleChange}
        />
      );
    }

    if (controlType === "structured") {
      const records = Array.isArray(value)
        ? (value as Array<Record<string, unknown>>)
        : [];
      const handleChange = (next: Array<Record<string, unknown>>) => {
        onCustomChange?.(next);
      };
      return <StructuredStringEditor value={records} onChange={handleChange} />;
    }

    if (controlType === "select" && options && options.length > 0) {
      return (
        <select
          value={value ?? ""}
          onChange={(event) => onCustomChange?.(event.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
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
          className="h-32 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 font-mono text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          spellCheck={false}
        />
      );
    }

    if (controlType === "number") {
      return (
        <input
          type="number"
          value={value ?? ""}
          onChange={(event) => onNumberChange?.(event.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
        />
      );
    }

    return (
      <input
        type="text"
        value={value ?? ""}
        onChange={(event) => onCustomChange?.(event.target.value)}
        className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
      />
    );
  };

  return (
    <div className={classNames("space-y-2", className)}>
      <div className="text-xs uppercase tracking-wide text-slate-500">{title}</div>

      {renderControl()}

      {!readOnly && isRemovable && onRemoveCustom && fieldKey ? (
        <button
          onClick={() => onRemoveCustom(fieldKey)}
          className="text-xs text-rose-300 underline-offset-4 hover:underline"
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
}

function ListInput({ value, onChange, readOnly }: ListInputProps) {
  const [draft, setDraft] = useState("");
  const items = useMemo(
    () =>
      (Array.isArray(value) ? value : [])
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    [value],
  );
  const canEdit = Boolean(onChange) && !readOnly;

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
    <div className="flex flex-col gap-2">
      <div
        className={classNames(
          "flex min-h-[42px] flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2",
          items.length === 0 ? "text-xs text-slate-500" : undefined,
        )}
      >
        {items.length === 0 ? (
          <span>No entries</span>
        ) : (
          items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-100"
            >
              {item}
              {canEdit ? (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-slate-400 transition hover:text-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60"
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
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add value"
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
          <button
            type="button"
            onClick={commitDraft}
            className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
          >
            Add
          </button>
        </div>
      ) : null}
    </div>
  );
}

interface StructuredStringEditorProps {
  value: ReadonlyArray<Record<string, unknown>>;
  onChange?: (next: Array<Record<string, unknown>>) => void;
  readOnly?: boolean;
}

function StructuredStringEditor({ value, onChange, readOnly }: StructuredStringEditorProps) {
  const records = Array.isArray(value) ? value : [];
  const canEdit = Boolean(onChange) && !readOnly;

  const fieldTypes = useMemo(() => {
    const map = new Map<string, StructuredFieldType>();
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

  const handleRecordChange = useCallback(
    (index: number, nextRecord: Record<string, unknown>) => {
      if (!canEdit || !onChange) return;
      const base = Array.isArray(value) ? value : [];
      const next = base.map((record, idx) => (idx === index ? nextRecord : record));
      onChange(next);
    },
    [canEdit, onChange, value],
  );

  const handleRecordRemove = useCallback(
    (index: number) => {
      if (!canEdit || !onChange) return;
      const base = Array.isArray(value) ? value : [];
      const next = base.filter((_, idx) => idx !== index);
      onChange(next);
    },
    [canEdit, onChange, value],
  );

  const handleAddRecord = () => {
    if (!canEdit || !onChange) return;
    const template: Record<string, unknown> = {};
    if (fieldTypes.size > 0) {
      for (const [key, type] of fieldTypes.entries()) {
        if (type === "boolean") {
          template[key] = false;
        } else if (type === "number") {
          template[key] = undefined;
        } else {
          template[key] = "";
        }
      }
    }
    const base = Array.isArray(value) ? value : [];
    onChange([...base, template]);
  };

  if (!records.length) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-3 py-4 text-center text-sm text-slate-400">
          {canEdit
            ? "No entries available. Add one to define structured data."
            : "No entries available."}
        </div>
        {canEdit ? (
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

  if (!canEdit) {
    return (
      <div className="space-y-3">
        {records.map((record, index) => (
          <div
            key={`structured-ro-${index}`}
            className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200"
          >
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
              <span>Entry {index + 1}</span>
            </div>
            <dl className="grid gap-2 sm:grid-cols-2">
              {Object.entries(record).map(([key, raw]) => {
                const display = raw === undefined || raw === null || raw === "" ? "—" : String(raw);
                return (
                  <div key={key}>
                    <dt className="text-[10px] uppercase tracking-wide text-slate-500">{key}</dt>
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
          onChange={(nextRecord) => handleRecordChange(index, nextRecord)}
          onRemove={() => handleRecordRemove(index)}
        />
      ))}
      <button
        type="button"
        onClick={handleAddRecord}
        className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
      >
        Add entry
      </button>
    </div>
  );
}

interface StructuredRecordEditorProps {
  index: number;
  record: Record<string, unknown>;
  fieldTypes: ReadonlyMap<string, StructuredFieldType>;
  onChange: (next: Record<string, unknown>) => void;
  onRemove: () => void;
}

function StructuredRecordEditor({ index, record, fieldTypes, onChange, onRemove }: StructuredRecordEditorProps) {
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldType, setNewFieldType] = useState<StructuredFieldType>("string");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [newFieldBoolean, setNewFieldBoolean] = useState(false);

  const keys = useMemo(() => {
    const set = new Set<string>();
    for (const key of fieldTypes.keys()) {
      set.add(key);
    }
    for (const key of Object.keys(record)) {
      set.add(key);
    }
    return Array.from(set);
  }, [fieldTypes, record]);

  const handleFieldChange = (key: string, type: StructuredFieldType, raw: string) => {
    const next: Record<string, unknown> = { ...record };
    if (type === "number") {
      if (raw === "") {
        next[key] = undefined;
      } else {
        const parsed = Number(raw);
        next[key] = Number.isNaN(parsed) ? undefined : parsed;
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
    const next: Record<string, unknown> = { ...record };
    delete next[key];
    onChange(next);
  };

  const handleAddField = () => {
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
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3 shadow-sm shadow-slate-950/30">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Entry {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-rose-300 underline-offset-4 hover:underline"
        >
          Remove
        </button>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {keys.map((key) => {
          const type = fieldTypes.get(key) ?? inferStructuredFieldType(record[key]);
          const rawValue = record[key];
          if (type === "boolean") {
            return (
              <div key={key} className="flex flex-col gap-1 text-xs text-slate-300">
                <span className="text-[10px] uppercase tracking-wide text-slate-500">{key}</span>
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={Boolean(rawValue)}
                    onChange={(event) => handleBooleanChange(key, event.target.checked)}
                    aria-label={key}
                  />
                  <span className="text-sm text-slate-200">{Boolean(rawValue) ? "True" : "False"}</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveField(key)}
                  className="self-start text-[10px] text-rose-300 underline-offset-4 hover:underline"
                >
                  Remove field
                </button>
              </div>
            );
          }

          if (type === "number") {
            return (
              <div key={key} className="flex flex-col gap-1 text-xs text-slate-300">
                <span className="text-[10px] uppercase tracking-wide text-slate-500">{key}</span>
                <input
                  type="number"
                  value={typeof rawValue === "number" && Number.isFinite(rawValue) ? rawValue : ""}
                  onChange={(event) => handleFieldChange(key, "number", event.target.value)}
                  className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  aria-label={key}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField(key)}
                  className="self-start text-[10px] text-rose-300 underline-offset-4 hover:underline"
                >
                  Remove field
                </button>
              </div>
            );
          }

          return (
            <div key={key} className="flex flex-col gap-1 text-xs text-slate-300">
              <span className="text-[10px] uppercase tracking-wide text-slate-500">{key}</span>
              <input
                type="text"
                value={rawValue == null ? "" : String(rawValue)}
                onChange={(event) => handleFieldChange(key, "string", event.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                aria-label={key}
              />
              <button
                type="button"
                onClick={() => handleRemoveField(key)}
                className="self-start text-[10px] text-rose-300 underline-offset-4 hover:underline"
              >
                Remove field
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-dashed border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-300">
        <span className="text-[10px] uppercase tracking-wide text-slate-500">Add field</span>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={newFieldKey}
            onChange={(event) => setNewFieldKey(event.target.value)}
            placeholder="Field name"
            className="flex-1 min-w-[140px] rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
          <select
            value={newFieldType}
            onChange={(event) => setNewFieldType(event.target.value as StructuredFieldType)}
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
          </select>
          {newFieldType === "boolean" ? (
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
              <input
                type="checkbox"
                checked={newFieldBoolean}
                onChange={(event) => setNewFieldBoolean(event.target.checked)}
              />
              <span className="text-sm text-slate-200">{newFieldBoolean ? "True" : "False"}</span>
            </label>
          ) : (
            <input
              type={newFieldType === "number" ? "number" : "text"}
              value={newFieldValue}
              onChange={(event) => setNewFieldValue(event.target.value)}
              placeholder="Value"
              className="flex-1 min-w-[120px] rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          )}
          <button
            type="button"
            onClick={handleAddField}
            className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

type PortForwardVariant = "ipv4" | "ipv6";

interface PortForwardEditorProps {
  value: ReadonlyArray<PortForwardRule>;
  onChange?: (next: PortForwardRule[]) => void;
  readOnly?: boolean;
  variant: PortForwardVariant;
}

function PortForwardEditor({ value, onChange, readOnly, variant }: PortForwardEditorProps) {
  const rules = Array.isArray(value) ? [...value] : [];
  const canEdit = Boolean(onChange) && !readOnly;
  const isIpv6 = variant === "ipv6";

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
      className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-wide text-slate-400">
        <span>Rule {index + 1}</span>
        <span>{rule.enabled ? "Enabled" : "Disabled"}</span>
      </div>
      <dl className="grid gap-2 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Protocol</dt>
          <dd>{protocolLabel(rule.protocol)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Source Address</dt>
          <dd>{rule.srcAddr || "Any"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">External Ports</dt>
          <dd>{rule.extPorts || "—"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Internal Port</dt>
          <dd>{rule.intPort != null ? String(rule.intPort) : "Auto"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Internal Address</dt>
          <dd>{rule.intAddr || "—"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Description</dt>
          <dd>{rule.description || "—"}</dd>
        </div>
      </dl>
    </div>
  );

  const renderIpv4Editable = (rule: PortForwardIpv4Rule, index: number) => (
    <div
      key={`pfipv4-edit-${index}`}
      className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3 shadow-sm shadow-slate-950/30"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Rule {index + 1}
          </span>
          <label className="inline-flex items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={Boolean(rule.enabled)}
              onChange={(event) => updateRule(index, { enabled: event.target.checked })}
            />
            <span>{rule.enabled ? "Enabled" : "Disabled"}</span>
          </label>
        </div>
        <button
          type="button"
          onClick={() => removeRule(index)}
          className="text-xs text-rose-300 underline-offset-4 hover:underline"
        >
          Remove
        </button>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">Protocol</span>
          <select
            value={String(rule.protocol)}
            onChange={(event) => {
              const raw = event.target.value;
              const parsed = Number(raw);
              const valid = [1, 2, 3].includes(parsed) ? parsed : 1;
              updateRule(index, { protocol: valid });
            }}
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          >
            {protocolOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">Source Address</span>
          <input
            type="text"
            value={rule.srcAddr}
            onChange={(event) => updateRule(index, { srcAddr: event.target.value })}
            placeholder="0.0.0.0/0"
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">External Ports</span>
          <input
            type="text"
            value={rule.extPorts}
            onChange={(event) => updateRule(index, { extPorts: event.target.value })}
            placeholder="80-80"
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">Internal Port</span>
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
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">Internal Address</span>
          <input
            type="text"
            value={rule.intAddr}
            onChange={(event) => updateRule(index, { intAddr: event.target.value })}
            placeholder="192.168.1.2"
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-300 sm:col-span-2">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">Description</span>
          <input
            type="text"
            value={rule.description}
            onChange={(event) => updateRule(index, { description: event.target.value })}
            placeholder="Web Server"
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
      </div>
    </div>
  );

  const renderIpv6ReadOnly = (rule: PortForwardIpv6Rule, index: number) => (
    <div
      key={`pfipv6-ro-${index}`}
      className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-wide text-slate-400">
        <span>Rule {index + 1}</span>
        <span>{rule.enabled ? "Enabled" : "Disabled"}</span>
      </div>
      <dl className="grid gap-2 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Protocol</dt>
          <dd>{protocolLabel(rule.protocol)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Source Address</dt>
          <dd>{rule.srcAddress || "Any"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Destination Address</dt>
          <dd>{rule.destAddress || "—"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Destination Ports</dt>
          <dd>{rule.destPorts || "—"}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-slate-500">Description</dt>
          <dd>{rule.description || "—"}</dd>
        </div>
      </dl>
    </div>
  );

  const renderIpv6Editable = (rule: PortForwardIpv6Rule, index: number) => (
    <div
      key={`pfipv6-edit-${index}`}
      className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3 shadow-sm shadow-slate-950/30"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Rule {index + 1}
          </span>
          <label className="inline-flex items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={Boolean(rule.enabled)}
              onChange={(event) => updateRule(index, { enabled: event.target.checked })}
            />
            <span>{rule.enabled ? "Enabled" : "Disabled"}</span>
          </label>
        </div>
        <button
          type="button"
          onClick={() => removeRule(index)}
          className="text-xs text-rose-300 underline-offset-4 hover:underline"
        >
          Remove
        </button>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">Protocol</span>
          <select
            value={String(rule.protocol)}
            onChange={(event) => {
              const raw = event.target.value as "1" | "2" | "3";
              const valid = ["1", "2", "3"].includes(raw) ? raw : "1";
              updateRule(index, { protocol: valid });
            }}
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          >
            {protocolOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">Source Address</span>
          <input
            type="text"
            value={rule.srcAddress}
            onChange={(event) => updateRule(index, { srcAddress: event.target.value })}
            placeholder="::/0"
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">Destination Address</span>
          <input
            type="text"
            value={rule.destAddress}
            onChange={(event) => updateRule(index, { destAddress: event.target.value })}
            placeholder="2001:db8::100"
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-300">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">Destination Ports</span>
          <input
            type="text"
            value={rule.destPorts}
            onChange={(event) => updateRule(index, { destPorts: event.target.value })}
            placeholder="80-80"
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-300 sm:col-span-2">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">Description</span>
          <input
            type="text"
            value={rule.description}
            onChange={(event) => updateRule(index, { description: event.target.value })}
            placeholder="Service"
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {rules.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-3 py-4 text-center text-sm text-slate-400">
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

  const renderOptionButton = (option: { value: Exclude<SelectionOption, "custom">; label: string }) => {
    const active = current === option.value;
    const disabled = disabledOptions?.[option.value] ?? false;
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
            ? "cursor-not-allowed text-slate-600"
            : active
              ? "bg-slate-800 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
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
            ? "cursor-not-allowed text-slate-600"
            : unifiedActive
              ? "bg-slate-800 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
        )}
        disabled={unifiedDisabled}
      >
        Keep Unchanged
      </button>
    );
  };

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/70 p-1">
      {showEdited ? (
        <button
          type="button"
          onClick={() => onSelectCustom?.()}
          className="rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-semibold text-amber-200 hover:bg-amber-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 whitespace-nowrap"
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
