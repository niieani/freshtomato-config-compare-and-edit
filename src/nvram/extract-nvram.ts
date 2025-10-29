#!/usr/bin/env bun

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, basename } from 'path';

interface NvramData {
  [key: string]: any;
}

interface PageData {
  [pageName: string]: NvramData;
}

/**
 * Extracts nvram object from HTML content
 */
function extractNvram(html: string): NvramData | null {
  // Match nvram = { ... }; pattern, handling multiline
  const nvramRegex = /nvram\s*=\s*\{([^}]*)\}/s;
  const match = html.match(nvramRegex);

  if (!match || !match[1]) {
    return null;
  }

  // Extract the content between braces
  const nvramContent = match[1];

  // Parse the JavaScript object notation
  const nvramData: NvramData = {};

  // Match key-value pairs: 'key': 'value' or "key": "value"
  const keyValueRegex = /['"]([^'"]+)['"]\s*:\s*['"]([^'"]*)['"]/g;

  let kvMatch;
  while ((kvMatch = keyValueRegex.exec(nvramContent)) !== null) {
    const key = kvMatch[1];
    const value = kvMatch[2];
    if (key) {
      nvramData[key] = value || '';
    }
  }

  return Object.keys(nvramData).length > 0 ? nvramData : null;
}

/**
 * Main function to process HTML files and extract nvram data
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: bun extract-nvram.ts <directory>');
    process.exit(1);
  }

  const directory = args[0]!;

  try {
    // Read all files in the directory
    const files = await readdir(directory);
    const htmlFiles = files.filter(f => f.endsWith('.html') || f.endsWith('.htm'));

    if (htmlFiles.length === 0) {
      console.warn(`No HTML files found in ${directory}`);
      process.exit(0);
    }

    console.log(`Found ${htmlFiles.length} HTML file(s) to process`);

    const pageData: PageData = {};
    let processedCount = 0;

    // Process each HTML file
    for (const file of htmlFiles) {
      const filePath = join(directory, file);
      const content = await readFile(filePath, 'utf-8');

      const nvramData = extractNvram(content);

      if (nvramData) {
        // Use filename without extension as page name
        const pageName = basename(file, basename(file).includes('.') ? `.${file.split('.').pop()}` : '');
        pageData[pageName] = nvramData;
        processedCount++;
        console.log(`✓ Extracted nvram from ${file} (${Object.keys(nvramData).length} keys)`);
      } else {
        console.log(`⨯ No nvram data found in ${file}`);
      }
    }

    // Write the output JSON file
    const outputPath = join(directory, 'nvram-data.json');
    await writeFile(outputPath, JSON.stringify(pageData, null, 2), 'utf-8');

    console.log(`\n✓ Successfully extracted nvram data from ${processedCount}/${htmlFiles.length} files`);
    console.log(`✓ Output written to: ${outputPath}`);

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
    process.exit(1);
  }
}

main();
