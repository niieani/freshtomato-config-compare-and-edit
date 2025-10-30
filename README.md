# FreshTomato NVRAM Workspace

Interactive browser-based tool for inspecting, comparing, and editing FreshTomato router backups. The app consumes the existing `src/nvram` catalog, rendering every documented page with search, diff, and export capabilities.

## Quick Start

1. Install dependencies

   ```bash
   bun install
   ```

2. Run the development server with hot reloading

   ```bash
   bun run dev
   ```

   The server starts at `http://localhost:3000` by default.

3. Create a production bundle

   ```bash
   bun run build
   ```

4. Serve the built assets (optional)

   ```bash
   bun run start
   ```

## Using the Workspace

- **Primary upload** – Drag a FreshTomato `.cfg` file into the left drop-zone to decode it via `nvram-cfg.ts`. The UI hydrates every field with metadata, grouping settings by their firmware page.
- **Comparison upload** – Drop a second `.cfg` to surface different, added, and removed keys. Filter by change type, search across labels and descriptions, or jump between pages from the sidebar.
- **Per-field control** – For each key choose _Use Left_, _Use Right_, _Remove_, or customise the value directly. Booleans, enumerations, and numbers render with specialised controls; unknown keys fall back to raw editing.
- **Exports** – Preview pending edits, generate a curated `.cfg` (HDR1/HDR2) using `encodeCfg`, or copy a CLI script with `nvram set/unset` commands ready for SSH sessions.
- **Custom keys** – Add adhoc entries that aren’t in the catalog; they appear under “Uncatalogued Keys” and can be edited or removed like any other field.

## Related CLI Utilities

The original Bun CLI tools remain available under `src/nvram/` for fetching, extracting, and comparing NVRAM snapshots. The web app reuses the same catalog modules, so improvements in either surface benefit both experiences.
