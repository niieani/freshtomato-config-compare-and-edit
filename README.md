# 🍅 FreshTomato Config Compare and Edit NVRAM

Interactive browser-based tool for inspecting, comparing, and editing FreshTomato router backups (NVRAM).
Runs fully locally, in your browser, so your config files never leave your computer.
Use it to create a new config, or even just to preview your settings and apply them manually via the Web UI.

## Usage

- **Primary upload** – Drag a FreshTomato `.cfg` file into the left drop-zone to decode it. The UI hydrates every field with metadata, grouping settings by their firmware page.
- **Comparison upload** – Drop a second `.cfg` to surface different, added, and removed keys. Filter by change type, search across labels and descriptions, or jump between pages from the sidebar.
- **Per-field control** – For each key choose _Use Left_, _Use Right_, _Remove_, or customise the value directly. Booleans, enumerations, and numbers render with specialised controls; unknown keys fall back to raw editing.
- **Exports** – Preview pending edits, generate a curated `.cfg` (HDR1/HDR2) using `encodeCfg`, or copy a CLI script with `nvram set/unset` commands ready for SSH sessions.
- **Custom keys** – Add adhoc entries that aren’t in the catalog; they appear under “Uncatalogued Keys” and can be edited or removed like any other field.

## Development

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
