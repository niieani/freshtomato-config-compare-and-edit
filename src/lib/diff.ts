export type DiffStatus = "same" | "different" | "added" | "removed";

export interface DiffEntry {
  key: string;
  left?: string;
  right?: string;
  status: DiffStatus;
}

export interface DiffSummary {
  entries: DiffEntry[];
  counts: Record<DiffStatus, number>;
  byKey: Map<string, DiffEntry>;
}

export type NvramEntries = Record<string, string>;

export function computeDiff(
  left: NvramEntries | null,
  right: NvramEntries | null,
): DiffSummary {
  const counts: Record<DiffStatus, number> = {
    same: 0,
    different: 0,
    added: 0,
    removed: 0,
  };

  const keys = new Set<string>();
  if (left) {
    for (const key of Object.keys(left)) keys.add(key);
  }
  if (right) {
    for (const key of Object.keys(right)) keys.add(key);
  }

  const entries: DiffEntry[] = [];
  const byKey = new Map<string, DiffEntry>();

  for (const key of Array.from(keys).sort()) {
    const leftValue = left?.[key];
    const rightValue = right?.[key];

    let status: DiffStatus;
    if (leftValue === undefined && rightValue !== undefined) {
      status = "added";
    } else if (leftValue !== undefined && rightValue === undefined) {
      status = "removed";
    } else if (leftValue === rightValue) {
      status = "same";
    } else {
      status = "different";
    }

    counts[status] += 1;
    const entry: DiffEntry = { key, left: leftValue, right: rightValue, status };
    entries.push(entry);
    byKey.set(key, entry);
  }

  return { entries, counts, byKey };
}
