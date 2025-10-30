#!/usr/bin/env bun

import { readFile, writeFile } from 'fs/promises';
import { dirname, basename } from 'path';
import { checkbox, confirm } from '@inquirer/prompts';
import * as nvramCatalog from './nvram.js';
import type { NvramProperty, PatternedNvramProperty } from './nvram-catalog-types.js';

interface NvramData {
  [key: string]: any;
}

interface PageData {
  [pageName: string]: NvramData;
}

interface KeyLocation {
  page: string;
  value: any;
}

interface ComparisonResult {
  different: Array<{
    key: string;
    page: string;
    oldValue: any;
    newValue: any;
  }>;
  added: Array<{
    key: string;
    page: string;
    value: any;
  }>;
  removed: Array<{
    key: string;
    page: string;
    value: any;
  }>;
  same: number;
}

/**
 * Build a map of unique keys to their first occurrence
 */
function buildUniqueKeyMap(data: PageData): Map<string, KeyLocation> {
  const keyMap = new Map<string, KeyLocation>();

  // Iterate through pages in a consistent order
  const pages = Object.keys(data).sort();

  for (const page of pages) {
    const nvramData = data[page];
    if (!nvramData) continue;
    for (const key of Object.keys(nvramData)) {
      // Only record the first occurrence of each key
      if (!keyMap.has(key)) {
        keyMap.set(key, {
          page,
          value: nvramData[key]
        });
      }
    }
  }

  return keyMap;
}

/**
 * Compare two nvram data sets
 */
function compareNvram(oldData: PageData, newData: PageData): ComparisonResult {
  const oldKeyMap = buildUniqueKeyMap(oldData);
  const newKeyMap = buildUniqueKeyMap(newData);

  const result: ComparisonResult = {
    different: [],
    added: [],
    removed: [],
    same: 0
  };

  // Find different and same keys
  for (const [key, oldLocation] of oldKeyMap) {
    const newLocation = newKeyMap.get(key);

    if (!newLocation) {
      // Key was removed
      result.removed.push({
        key,
        page: oldLocation.page,
        value: oldLocation.value
      });
    } else if (oldLocation.value !== newLocation.value) {
      // Value different
      result.different.push({
        key,
        page: oldLocation.page,
        oldValue: oldLocation.value,
        newValue: newLocation.value
      });
    } else {
      // Same
      result.same++;
    }
  }

  // Find added keys
  for (const [key, newLocation] of newKeyMap) {
    if (!oldKeyMap.has(key)) {
      result.added.push({
        key,
        page: newLocation.page,
        value: newLocation.value
      });
    }
  }

  // Sort results by page, then key for readability
  const sortFn = (a: any, b: any) => {
    if (a.page !== b.page) return a.page.localeCompare(b.page);
    return a.key.localeCompare(b.key);
  };

  result.different.sort(sortFn);
  result.added.sort(sortFn);
  result.removed.sort(sortFn);

  return result;
}

/**
 * Format comparison results as human-readable text
 */
function formatResults(result: ComparisonResult, oldFile: string, newFile: string, oldName: string, newName: string): string {
  const lines: string[] = [];

  lines.push('='.repeat(80));
  lines.push('NVRAM Configuration Comparison');
  lines.push('='.repeat(80));
  lines.push('');
  lines.push(`${oldName}: ${oldFile}`);
  lines.push(`${newName}: ${newFile}`);
  lines.push('');
  lines.push('Summary:');
  lines.push(`  Different: ${result.different.length}`);
  lines.push(`  Added:   ${result.added.length}`);
  lines.push(`  Removed: ${result.removed.length}`);
  lines.push(`  Same: ${result.same}`);
  lines.push('');

  if (result.different.length > 0) {
    lines.push('='.repeat(80));
    lines.push('DIFFERENT VALUES');
    lines.push('='.repeat(80));

    // Group differences by page
    const differencesByPage = new Map<string, typeof result.different>();
    for (const item of result.different) {
      if (!differencesByPage.has(item.page)) {
        differencesByPage.set(item.page, []);
      }
      differencesByPage.get(item.page)!.push(item);
    }

    for (const [page, items] of differencesByPage) {
      lines.push('');
      lines.push(`Page: ${page}`);
      for (const item of items) {
        lines.push(`  ${item.key}`);
        lines.push(`    ${oldName}: ${item.oldValue}`);
        lines.push(`    ${newName}: ${item.newValue}`);
      }
    }
    lines.push('');
  }

  if (result.added.length > 0) {
    lines.push('='.repeat(80));
    lines.push('ADDED VALUES');
    lines.push('='.repeat(80));

    // Group additions by page
    const addedByPage = new Map<string, typeof result.added>();
    for (const item of result.added) {
      if (!addedByPage.has(item.page)) {
        addedByPage.set(item.page, []);
      }
      addedByPage.get(item.page)!.push(item);
    }

    for (const [page, items] of addedByPage) {
      lines.push('');
      lines.push(`Page: ${page}`);
      for (const item of items) {
        lines.push(`  ${item.key}`);
        lines.push(`    ${newName}: ${item.value}`);
      }
    }
    lines.push('');
  }

  if (result.removed.length > 0) {
    lines.push('='.repeat(80));
    lines.push('REMOVED VALUES');
    lines.push('='.repeat(80));

    // Group removals by page
    const removedByPage = new Map<string, typeof result.removed>();
    for (const item of result.removed) {
      if (!removedByPage.has(item.page)) {
        removedByPage.set(item.page, []);
      }
      removedByPage.get(item.page)!.push(item);
    }

    for (const [page, items] of removedByPage) {
      lines.push('');
      lines.push(`Page: ${page}`);
      for (const item of items) {
        lines.push(`  ${item.key}`);
        lines.push(`    ${oldName}: ${item.value}`);
      }
    }
    lines.push('');
  }

  if (result.different.length === 0 && result.added.length === 0 && result.removed.length === 0) {
    lines.push('No differences found - configurations are identical!');
    lines.push('');
  }

  return lines.join('\n');
}

interface DiffItem {
  key: string;
  page: string;
  type: 'different' | 'added' | 'removed';
  oldValue?: any;
  newValue?: any;
  value?: any;
}

interface PropertyDescriptor {
  descriptor: NvramProperty<any> | PatternedNvramProperty<any, any>;
  params?: Record<string, any>;
  isPattern: boolean;
}

/**
 * Color helpers using Bun's native color API
 */
const colors = {
  red: (text: string) => {
    const code = Bun.color('red', 'ansi');
    const reset = '\x1b[0m';
    return code ? `${code}${text}${reset}` : text;
  },
  green: (text: string) => {
    const code = Bun.color('green', 'ansi');
    const reset = '\x1b[0m';
    return code ? `${code}${text}${reset}` : text;
  },
  yellow: (text: string) => {
    const code = Bun.color('yellow', 'ansi');
    const reset = '\x1b[0m';
    return code ? `${code}${text}${reset}` : text;
  },
  cyan: (text: string) => {
    const code = Bun.color('cyan', 'ansi');
    const reset = '\x1b[0m';
    return code ? `${code}${text}${reset}` : text;
  },
  dim: (text: string) => {
    return `\x1b[2m${text}\x1b[0m`;
  }
};

/**
 * Format a value in a compact, readable way for display
 */
function formatStructuredValue(value: any, indent: number = 0): string {
  const indentStr = '  '.repeat(indent);

  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';

    // Check if it's a simple array (no objects)
    const hasObjects = value.some(v => typeof v === 'object' && v !== null);

    if (!hasObjects) {
      // Simple inline format
      return '[' + value.map(v => formatStructuredValue(v, 0)).join(', ') + ']';
    }

    // Complex array with objects - format each on a new line
    const items = value.map(v => {
      if (typeof v === 'object' && v !== null) {
        return indentStr + '  ' + formatStructuredValue(v, indent + 1);
      }
      return indentStr + '  ' + formatStructuredValue(v, 0);
    });
    return '[\n' + items.join(',\n') + '\n' + indentStr + ']';
  }

  // Handle objects
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';

    // Format as {key=value, key=value}
    const pairs = keys.map(k => {
      const v = value[k];
      const formattedValue = typeof v === 'object' && v !== null
        ? formatStructuredValue(v, indent + 1)
        : formatStructuredValue(v, 0);
      return `${k}=${formattedValue}`;
    });

    // If it's short enough, keep it inline
    const inline = '{' + pairs.join(', ') + '}';
    if (inline.length <= 60 && !inline.includes('\n')) {
      return inline;
    }

    // Otherwise, format multiline
    return '{\n' + pairs.map(p => indentStr + '  ' + p).join(',\n') + '\n' + indentStr + '}';
  }

  return String(value);
}

/**
 * Find the property descriptor for a given NVRAM key
 */
function findPropertyDescriptor(key: string): PropertyDescriptor | null {
  const catalogEntries = Object.values(nvramCatalog);

  for (const entry of catalogEntries) {
    // Check if it's a regular NvramProperty with a fixed key
    if ('key' in entry && entry.key === key) {
      return {
        descriptor: entry,
        isPattern: false
      };
    }

    // Check if it's a PatternedNvramProperty with a regex
    if ('regex' in entry && 'getKey' in entry) {
      const match = key.match(entry.regex);
      if (match) {
        // Extract parameters from the regex match
        const params: Record<string, any> = {};
        const paramNames = Object.keys(entry.parameters);

        for (let i = 0; i < paramNames.length; i++) {
          const paramName = paramNames[i]!;
          const paramDef = entry.parameters[paramName];
          const matchValue = match[i + 1];

          if (matchValue !== undefined) {
            params[paramName] = paramDef.type === 'integer' || paramDef.type === 'number'
              ? parseInt(matchValue, 10)
              : matchValue;
          }
        }

        return {
          descriptor: entry,
          params,
          isPattern: true
        };
      }
    }
  }

  return null;
}

/**
 * Format a raw NVRAM value to its UI representation
 */
function formatValue(rawValue: any, descriptor: NvramProperty<any> | PatternedNvramProperty<any, any>): string {
  // Use transform.toUi if available
  if (descriptor.transform && descriptor.transform.toUi) {
    try {
      const uiValue = descriptor.transform.toUi(String(rawValue));

      // For enum types, look up the label
      if (descriptor.type === 'enum' && descriptor.ui?.options) {
        const option = descriptor.ui.options.find(opt => opt.value === uiValue);
        if (option) {
          return `${option.label} (${uiValue})`;
        }
      }

      // For booleans, show Yes/No
      if (descriptor.type === 'boolean') {
        return uiValue ? 'Yes' : 'No';
      }

      // For structured types (objects/arrays), format nicely
      if (typeof uiValue === 'object' && uiValue !== null) {
        return formatStructuredValue(uiValue);
      }

      return String(uiValue);
    } catch (e) {
      // If transformation fails, fall back to raw value
    }
  }

  // For enum types without transform, look up the label directly
  if (descriptor.type === 'enum' && descriptor.ui?.options) {
    const option = descriptor.ui.options.find(opt => opt.value === rawValue);
    if (option) {
      return `${option.label} (${rawValue})`;
    }
  }

  // For structured types without transform, format nicely
  if (typeof rawValue === 'object' && rawValue !== null) {
    return formatStructuredValue(rawValue);
  }

  return String(rawValue);
}

/**
 * Build a description string for a diff item
 */
function buildDescription(
  diff: DiffItem,
  propInfo: PropertyDescriptor | null,
  oldName: string,
  newName: string
): { name: string; description: string; warning?: string } {
  let name = '';
  let description = '';
  let warning: string | undefined;

  const descriptor = propInfo?.descriptor;
  const propDescription = descriptor?.description;

  if (diff.type === 'different') {
    name = `  ${diff.key}`;

    if (descriptor) {
      const oldFormatted = formatValue(diff.oldValue, descriptor);
      const newFormatted = formatValue(diff.newValue, descriptor);

      // Multiline colored diff - only colorize values
      const lines: string[] = [];

      // Old value (only the value is red)
      const oldLines = oldFormatted.split('\n');
      lines.push(`- ${oldName}: ${colors.red(oldLines[0])}`);
      for (let i = 1; i < oldLines.length; i++) {
        lines.push(`  ${colors.red(oldLines[i])}`);
      }

      // New value (only the value is green)
      const newLines = newFormatted.split('\n');
      lines.push(`+ ${newName}: ${colors.green(newLines[0])}`);
      for (let i = 1; i < newLines.length; i++) {
        lines.push(`  ${colors.green(newLines[i])}`);
      }

      description = lines.join('\n');

      if (propDescription) {
        description += '\n' + colors.cyan(`  ℹ ${propDescription}`);
      }
    } else {
      // Fallback for items without descriptors
      description = `- ${oldName}: ${colors.red('"' + diff.oldValue + '"')}` + '\n' +
                   `+ ${newName}: ${colors.green('"' + diff.newValue + '"')}`;
    }
  } else if (diff.type === 'added') {
    name = `  ${diff.key} ${colors.green('[NEW]')}`;

    if (descriptor) {
      const formatted = formatValue(diff.value, descriptor);

      // Format as added (only the value is green)
      const lines = formatted.split('\n');
      const descLines: string[] = [];
      descLines.push(`+ ${newName}: ${colors.green(lines[0])}`);
      for (let i = 1; i < lines.length; i++) {
        descLines.push(`  ${colors.green(lines[i])}`);
      }

      description = descLines.join('\n');

      if (propDescription) {
        description += '\n' + colors.cyan(`  ℹ ${propDescription}`);
      }
    } else {
      description = `+ ${newName}: ${colors.green('"' + diff.value + '"')}`;
    }
  } else {
    name = `  ${diff.key} ${colors.red('[REMOVE]')}`;

    if (descriptor) {
      const formatted = formatValue(diff.value, descriptor);

      // Format as removed (only the value is red)
      const lines = formatted.split('\n');
      const descLines: string[] = [];
      descLines.push(`- ${oldName}: ${colors.red(lines[0])}`);
      for (let i = 1; i < lines.length; i++) {
        descLines.push(`  ${colors.red(lines[i])}`);
      }

      description = descLines.join('\n');

      if (propDescription) {
        description += '\n' + colors.cyan(`  ℹ ${propDescription}`);
      }
    } else {
      description = `- ${oldName}: ${colors.red('"' + diff.value + '"')}`;
    }
  }

  return { name, description, warning };
}

/**
 * Check for dependency violations in the selected changes
 */
function checkDependencies(
  selectedDiffs: DiffItem[],
  oldData: PageData,
  newData: PageData
): Map<string, string[]> {
  const warnings = new Map<string, string[]>();

  // Build a map of what the final state would be after applying changes
  const finalState: Record<string, string> = {};

  // Start with old data (current state)
  const oldKeyMap = buildUniqueKeyMap(oldData);
  for (const [key, location] of oldKeyMap) {
    finalState[key] = String(location.value);
  }

  // Apply selected changes
  for (const diff of selectedDiffs) {
    if (diff.type === 'removed') {
      delete finalState[diff.key];
    } else {
      const value = diff.type === 'different' ? diff.newValue : diff.value;
      finalState[diff.key] = String(value);
    }
  }

  // Check each selected change for dependency violations
  for (const diff of selectedDiffs) {
    const propInfo = findPropertyDescriptor(diff.key);
    if (!propInfo || !propInfo.descriptor.ui?.state?.dependsOn) continue;

    const { dependsOn, evaluator } = propInfo.descriptor.ui.state;
    const diffWarnings: string[] = [];

    // Check if all dependencies are satisfied
    for (const depKey of dependsOn) {
      // Handle pattern substitution in dependency keys (e.g., "lan{bridgeIndex}_ifname")
      let actualDepKey = depKey;
      if (propInfo.params && depKey.includes('{')) {
        for (const [paramName, paramValue] of Object.entries(propInfo.params)) {
          actualDepKey = actualDepKey.replace(`{${paramName}}`, String(paramValue));
        }
      }

      if (!(actualDepKey in finalState)) {
        diffWarnings.push(`⚠ Depends on "${actualDepKey}" which is not set`);
      }
    }

    // Try to evaluate the state
    try {
      const state = evaluator(finalState);
      if (state === 'disabled' || state === 'hidden') {
        diffWarnings.push(`⚠ This setting may be ${state} based on other settings`);
      }
    } catch (e) {
      // Evaluator might fail if dependencies are missing
    }

    if (diffWarnings.length > 0) {
      warnings.set(diff.key, diffWarnings);
    }
  }

  return warnings;
}

/**
 * Run interactive mode to select which differences to apply
 */
async function runInteractive(result: ComparisonResult, oldName: string, newName: string, oldData: PageData, newData: PageData): Promise<void> {
  const allDiffs: DiffItem[] = [];

  // Collect all differences
  for (const item of result.different) {
    allDiffs.push({
      key: item.key,
      page: item.page,
      type: 'different',
      oldValue: item.oldValue,
      newValue: item.newValue
    });
  }

  for (const item of result.added) {
    allDiffs.push({
      key: item.key,
      page: item.page,
      type: 'added',
      value: item.value
    });
  }

  for (const item of result.removed) {
    allDiffs.push({
      key: item.key,
      page: item.page,
      type: 'removed',
      value: item.value
    });
  }

  if (allDiffs.length === 0) {
    console.log('No differences found - configurations are identical!');
    return;
  }

  // Group by page for display
  const diffsByPage = new Map<string, DiffItem[]>();
  for (const diff of allDiffs) {
    if (!diffsByPage.has(diff.page)) {
      diffsByPage.set(diff.page, []);
    }
    diffsByPage.get(diff.page)!.push(diff);
  }

  // Create choices for checkbox
  const choices: Array<{
    name: string;
    value: DiffItem;
    description?: string;
  }> = [];

  for (const [page, diffs] of diffsByPage) {
    // Add a separator for the page
    choices.push({
      name: `─── ${page} ───`,
      value: { key: '', page, type: 'different' } as DiffItem,
      description: ''
    });

    for (const diff of diffs) {
      // Find property descriptor for rich information
      const propInfo = findPropertyDescriptor(diff.key);
      const { name, description } = buildDescription(diff, propInfo, oldName, newName);

      choices.push({ name, value: diff, description });
    }
  }

  // Filter out the separator items (ones with empty keys)
  const selectableChoices = choices.filter(c => c.value.key !== '');

  console.log('\n');
  console.log('Select the changes you want to apply:');
  console.log('(Use arrow keys to move, space to select/deselect, Enter to confirm)');
  console.log('');

  const selected = await checkbox({
    message: 'Select changes to apply',
    choices: choices.map((c, idx) => {
      // Mark separator items as disabled so they can't be selected
      if (c.value.key === '') {
        return {
          name: c.name,
          value: idx,
          disabled: true
        };
      }
      return {
        name: c.name,
        value: idx,
        description: c.description
      };
    }),
    pageSize: 20
  });

  // Map selected indices back to diff items
  const selectedDiffs = selected
    .map(idx => choices[idx]!.value)
    .filter(diff => diff.key !== ''); // Filter out any separators

  if (selectedDiffs.length === 0) {
    console.log('No changes selected.');
    return;
  }

  console.log(`\n${selectedDiffs.length} change(s) selected.\n`);

  // Check for dependency warnings
  const warnings = checkDependencies(selectedDiffs, oldData, newData);
  if (warnings.size > 0) {
    console.log(colors.yellow('⚠️  Dependency warnings:') + '\n');
    for (const [key, keyWarnings] of warnings) {
      console.log(colors.cyan(`  ${key}:`));
      for (const warning of keyWarnings) {
        console.log(colors.yellow(`    ${warning}`));
      }
    }
    console.log('');

    const proceed = await confirm({
      message: 'Continue despite warnings?',
      default: false
    });

    if (!proceed) {
      console.log('Cancelled.');
      return;
    }
    console.log('');
  }

  // Generate nvram set commands
  const commands: string[] = [];

  for (const diff of selectedDiffs) {
    if (diff.type === 'different' || diff.type === 'added') {
      const value = diff.type === 'different' ? diff.newValue : diff.value;
      commands.push(`nvram set ${diff.key}="${value}"`);
    } else if (diff.type === 'removed') {
      // For removed values, we unset them
      commands.push(`nvram unset ${diff.key}`);
    }
  }

  // Add commit command
  commands.push('nvram commit');

  console.log('Copy and paste these commands into your router:\n');
  console.log('─'.repeat(80));
  console.log(commands.join('\n'));
  console.log('─'.repeat(80));
  console.log('');

  // Optionally save to file
  const shouldSave = await confirm({
    message: 'Save commands to file?',
    default: true
  });

  if (shouldSave) {
    const filename = 'nvram-commands.sh';
    await writeFile(filename, '#!/bin/sh\n\n' + commands.join('\n') + '\n', 'utf-8');
    console.log(`✓ Commands saved to ${filename}`);
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  // Parse flags
  const interactiveFlag = args.includes('--interactive') || args.includes('-i');
  const fileArgs = args.filter(arg => !arg.startsWith('--') && !arg.startsWith('-'));

  if (fileArgs.length < 2) {
    console.error('Usage: bun compare-nvram.ts <old-json> <new-json> [output-file] [--interactive]');
    console.error('');
    console.error('Examples:');
    console.error('  bun compare-nvram.ts config1/nvram-data.json config2/nvram-data.json');
    console.error('  bun compare-nvram.ts old.json new.json diff-report.txt');
    console.error('  bun compare-nvram.ts old.json new.json --interactive');
    console.error('');
    console.error('Options:');
    console.error('  --interactive, -i    Interactive mode to select changes and generate nvram commands');
    process.exit(1);
  }

  const oldFile = fileArgs[0]!;
  const newFile = fileArgs[1]!;
  const outputFile = interactiveFlag ? undefined : fileArgs[2];

  try {
    // Load both JSON files
    console.log(`Loading ${oldFile}...`);
    const oldContent = await readFile(oldFile, 'utf-8');
    const oldData: PageData = JSON.parse(oldContent);

    console.log(`Loading ${newFile}...`);
    const newContent = await readFile(newFile, 'utf-8');
    const newData: PageData = JSON.parse(newContent);

    // Perform comparison
    console.log('Comparing configurations...');
    const result = compareNvram(oldData, newData);

    // Build unique key counts for info
    const oldUniqueKeys = buildUniqueKeyMap(oldData).size;
    const newUniqueKeys = buildUniqueKeyMap(newData).size;

    // Extract directory names
    const oldDirName = basename(dirname(oldFile));
    const newDirName = basename(dirname(newFile));

    console.log('');
    console.log(`${oldDirName}: ${Object.keys(oldData).length} pages, ${oldUniqueKeys} unique keys`);
    console.log(`${newDirName}: ${Object.keys(newData).length} pages, ${newUniqueKeys} unique keys`);
    console.log('');

    // Check for differences
    const hasDifferences = result.different.length > 0 ||
                          result.added.length > 0 ||
                          result.removed.length > 0;

    if (interactiveFlag) {
      // Run interactive mode
      await runInteractive(result, oldDirName, newDirName, oldData, newData);
    } else {
      // Format results
      const report = formatResults(result, oldFile, newFile, oldDirName, newDirName);

      // Output results
      if (outputFile) {
        await writeFile(outputFile, report, 'utf-8');
        console.log(`✓ Comparison report written to: ${outputFile}`);
      } else {
        console.log(report);
      }
    }

    // Exit with code 1 if there are differences, 0 if identical
    process.exit(hasDifferences ? 1 : 0);

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
    process.exit(2);
  }
}

main();
