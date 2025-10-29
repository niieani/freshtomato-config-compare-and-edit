import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { decodeCfg, encodeCfg } from "@/nvram/nvram-cfg";
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
}

const DIFF_BADGE_THEME: Record<DiffStatus, string> = {
  unchanged: "bg-slate-800/40 text-slate-200 border border-slate-700/60",
  changed: "bg-amber-500/15 text-amber-200 border border-amber-400/40",
  added: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40",
  removed: "bg-rose-500/15 text-rose-200 border border-rose-400/40",
};

type ControlType = "boolean" | "select" | "number" | "textarea" | "text";

function resolveControlType(field: ResolvedField): ControlType {
  if (field.options && field.options.length > 0) return "select";
  switch (field.type) {
    case "boolean":
      return "boolean";
    case "integer":
      return "number";
    case "list":
    case "structured-string":
      return "textarea";
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

  const handleClear = useCallback((side: "left" | "right") => {
    if (side === "left") {
      setLeftConfig(null);
      setSelections({});
      setActivePageId(null);
    } else {
      setRightConfig(null);
    }
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

  const diffLeftRight = useMemo(
    () => computeDiff(leftEntries, rightEntries),
    [leftEntries, rightEntries],
  );

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
      const pageId = resolved.page ?? UNCATEGORISED_PAGE_ID;

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

      const entry: FieldView = {
        key,
        field: resolved,
        leftRaw: leftEntries?.[key],
        rightRaw: rightEntries?.[key],
        workingRaw: finalEntries[key],
        diff,
        finalDiff,
        selection: selections[key],
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
    const result: Array<{ id: string; title: string; entries: FieldView[] }> = [];

    for (const [pageId, entries] of fieldViews.entries()) {
      const title =
        pageId === UNCATEGORISED_PAGE_ID ? UNCATEGORISED_PAGE_LABEL : prettifyPageId(pageId);

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

      if (filtered.length > 0) {
        result.push({ id: pageId, title, entries: filtered });
      }
    }

    result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [diffFilter, fieldViews, focusPending, searchTerm]);

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

  const selectedPage = activePageId
    ? filteredPages.find((page) => page.id === activePageId) ?? null
    : filteredPages[0] ?? null;

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
    setActivePageId(UNCATEGORISED_PAGE_ID);
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

          <div className="grid gap-4 md:grid-cols-2">
            <DropZoneCard
              side="left"
              title="Primary configuration"
              subtitle="Drag & drop or click to choose the baseline router backup."
              disabled={false}
              config={leftConfig}
              onFile={(file) => handleLoad(file, "left")}
              onClear={() => handleClear("left")}
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

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-72 shrink-0 border-r border-slate-900 bg-slate-950/60 backdrop-blur md:flex md:flex-col">
          <div className="p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Pages</div>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {filteredPages.map((page) => {
              const isActive = page.id === (selectedPage?.id ?? null);
              const pendingCount = page.entries.filter(
                (entry) => entry.finalDiff.status !== "unchanged",
              ).length;
              return (
                <button
                  key={page.id}
                  onClick={() => setActivePageId(page.id)}
                  className={classNames(
                    "flex w-full items-center justify-between px-4 py-2 text-left text-sm transition",
                    isActive
                      ? "bg-slate-900/80 text-white"
                      : "text-slate-400 hover:bg-slate-900/40 hover:text-slate-200",
                  )}
                >
                  <span className="flex-1 truncate">{page.title}</span>
                  {pendingCount > 0 ? (
                    <span className="ml-3 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-sky-500/20 px-2 text-xs text-sky-200">
                      {pendingCount}
                    </span>
                  ) : null}
                </button>
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

                <div className="space-y-4">
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
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-medium text-slate-200">{config.name}</span>
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClear();
              }}
              className="rounded-full border border-transparent px-2 py-0.5 text-[11px] text-slate-400 transition hover:border-slate-800 hover:bg-slate-800 hover:text-slate-200"
            >
              Clear
            </button>
          </div>
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

  const selectionValue = selection?.option ?? (entry.leftRaw !== undefined ? "left" : "remove");

  const handleCustomChange = (value: string) => {
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

  const finalBadge = finalDiff.status !== "unchanged" && (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        DIFF_BADGE_THEME[finalDiff.status],
      )}
    >
      {finalDiff.status.toUpperCase()}
    </span>
  );

  return (
    <article className="rounded-2xl border border-slate-900 bg-slate-900/70 p-5 shadow-sm shadow-slate-950/40">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">{field.label}</h3>
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] text-slate-500">
              {key}
            </span>
          </div>
          <p className="max-w-3xl text-sm text-slate-400">{field.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={classNames(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
              DIFF_BADGE_THEME[diff.status],
            )}
          >
            {diff.status.toUpperCase()}
          </span>
          {finalBadge}
        </div>
      </header>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <ValueColumn
          title="Left"
          controlType={controlType}
          hint={entry.leftRaw === undefined ? "Not present" : undefined}
          value={leftValue}
          field={field}
          readOnly
          options={field.options}
        />
        <ValueColumn
          title="Right"
          controlType={controlType}
          hint={
            hasRight ? (entry.rightRaw === undefined ? "Not present" : undefined) : "No file loaded"
          }
          value={rightValue}
          field={field}
          readOnly
          options={field.options}
        />
        <ValueColumn
          title="Working"
          controlType={controlType}
          value={workingValue}
          field={field}
          selection={selectionValue}
          onSelect={(option) => {
            if (option === "left" && entry.leftRaw === undefined) return;
            if (option === "right" && (entry.rightRaw === undefined || !hasRight)) return;
            onSelectionChange(key, { option });
          }}
          onCustomChange={handleCustomChange}
          onBooleanChange={handleBooleanChange}
          onNumberChange={handleNumberChange}
          isRemovable={isFallback && entry.leftRaw === undefined && entry.rightRaw === undefined}
          onRemoveCustom={onRemoveCustom}
          fieldKey={key}
          options={field.options}
          disabledOptions={{
            left: entry.leftRaw === undefined,
            right: !hasRight || entry.rightRaw === undefined,
          }}
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
  selection?: SelectionOption;
  hint?: string;
  onSelect?: (option: Exclude<SelectionOption, "custom">) => void;
  onCustomChange?: (value: string) => void;
  onBooleanChange?: (value: boolean) => void;
  onNumberChange?: (value: string) => void;
  isRemovable?: boolean;
  onRemoveCustom?: (key: string) => void;
  fieldKey?: string;
  options?: ResolvedField["options"];
  disabledOptions?: Partial<Record<Exclude<SelectionOption, "custom">, boolean>>;
}

function ValueColumn({
  title,
  value,
  field,
  controlType,
  readOnly,
  selection,
  hint,
  onSelect,
  onCustomChange,
  onBooleanChange,
  onNumberChange,
  isRemovable,
  onRemoveCustom,
  fieldKey,
  options,
  disabledOptions,
}: ValueColumnProps) {
  const renderControl = () => {
    if (readOnly) {
      if (hint) {
        return (
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-500">
            {hint}
          </div>
        );
      }
      return (
        <pre className="max-h-40 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
          {(() => {
            if (value === null || value === undefined || value === "") return "—";
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
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onBooleanChange?.(event.target.checked)}
            className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500"
          />
          <span className="text-sm text-slate-200">{value ? "Enabled" : "Disabled"}</span>
        </label>
      );
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
          className="h-32 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
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
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
        <span>{title}</span>
        {!readOnly && selection ? (
          <SelectionChips current={selection} onSelect={onSelect} disabledOptions={disabledOptions} />
        ) : null}
      </div>

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

interface SelectionChipsProps {
  current: SelectionOption;
  onSelect?: (option: Exclude<SelectionOption, "custom">) => void;
  disabledOptions?: Partial<Record<Exclude<SelectionOption, "custom">, boolean>>;
}

function SelectionChips({ current, onSelect, disabledOptions }: SelectionChipsProps) {
  const options: Array<{ value: Exclude<SelectionOption, "custom">; label: string }> = [
    { value: "left", label: "Use Left" },
    { value: "right", label: "Use Right" },
    { value: "remove", label: "Remove" },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/70 p-1">
      {options.map((option) => {
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
              "rounded-full px-3 py-1 text-[11px] font-medium transition",
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
      })}
    </div>
  );
}

export default App;
