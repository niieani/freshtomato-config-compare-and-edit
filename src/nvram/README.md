# Fresh Tomato Router Backup & Configuration Tools

A suite of TypeScript tools for backing up, extracting, and comparing Fresh Tomato router configurations. Built with Bun for fast, reliable router configuration management.

## Features

- 📥 **Fetch** all router configuration pages with automatic versioning
- 🔍 **Extract** nvram settings from HTML dumps into structured JSON
- 🔄 **Compare** configurations between routers or snapshots
- ✨ **Interactive mode** to selectively apply configuration changes
- 🤖 **Auto-generates** nvram commands for easy migration

## Prerequisites

- [Bun](https://bun.sh) runtime installed
- Fresh Tomato router with HTTP/HTTPS access
- Router credentials (username/password)

## Installation

```bash
# Clone or download this repository
cd router-backup

# Install dependencies
bun install
```

## Tools Overview

### 1. `fetch.ts` - Fetch Router Configuration

Connects to your Fresh Tomato router and downloads all configuration pages. Automatically detects the router version and model, creating timestamped backups.

**Usage:**

```bash
# Basic usage (uses default http://192.168.1.1)
bun fetch.ts

# Specify custom router IP
bun fetch.ts --base http://192.168.2.1

# Custom output directory (skips auto-naming)
bun fetch.ts --base http://192.168.2.1 --outdir my-backup
```

**What it does:**
- Prompts for username/password interactively
- Fetches overview page to detect router version and model
- Downloads all 90+ configuration pages
- Creates directory like: `freshtomato-2025.3-on-netgear-r7000-202510261119`

**Example:**

```bash
$ bun fetch.ts

Fresh Tomato Configuration Fetcher

? Username: root
? Password: ********

Fetching from: http://192.168.1.1

Fetching router version info...
Version: 2025.3 on Netgear R7000
Output directory: freshtomato-2025.3-on-netgear-r7000-202510261119

Fetching 90 pages...
..................................................................................

✓ Successfully saved 90/90 pages to freshtomato-2025.3-on-netgear-r7000-202510261119/
```

### 2. `extract-nvram.ts` - Extract Configuration Data

Parses HTML dumps and extracts nvram (non-volatile RAM) settings into a structured JSON file. Each page contains a JavaScript object with configuration values that this tool extracts and organizes.

**Usage:**

```bash
# Extract from a directory containing HTML files
bun extract-nvram.ts <directory>

# Example
bun extract-nvram.ts freshtomato-2025.3-on-netgear-r7000-202510261119
```

**Output:**

Creates `nvram-data.json` in the specified directory with all settings grouped by page:

```json
{
  "basic-network.asp": {
    "lan_ipaddr": "192.168.1.1",
    "wan_proto": "dhcp",
    "router_name": "FreshTomato"
  },
  "admin-access.asp": {
    "http_username": "root",
    "web_wl_filter": "0"
  }
}
```

**Features:**
- Automatically deduplicates keys (uses first occurrence)
- Handles 90+ configuration pages
- Shows progress and statistics

### 3. `compare-nvram.ts` - Compare Configurations

Compares two nvram configuration dumps to identify differences. Perfect for documenting changes, migrating settings between routers, or troubleshooting configuration drift.

**Basic Usage:**

```bash
# Generate text report
bun compare-nvram.ts <old-config>/nvram-data.json <new-config>/nvram-data.json

# Save report to file
bun compare-nvram.ts old.json new.json comparison-report.txt
```

**Interactive Mode:**

```bash
# Launch interactive TUI to select changes
bun compare-nvram.ts <old-config>/nvram-data.json <new-config>/nvram-data.json --interactive
# or
bun compare-nvram.ts old.json new.json -i
```

**Example Comparison:**

```bash
$ bun compare-nvram.ts defaults/nvram-data.json production/nvram-data.json

Loading defaults/nvram-data.json...
Loading production/nvram-data.json...
Comparing configurations...

defaults: 88 pages, 1455 unique keys
production: 88 pages, 1605 unique keys

================================================================================
NVRAM Configuration Comparison
================================================================================

defaults: defaults/nvram-data.json
production: production/nvram-data.json

Summary:
  Changed: 94
  Added:   193
  Removed: 43
  Unchanged: 1318

### 4. `nvram-cfg.ts` - Encode/Decode Router Backup Files

Routers also expose a binary backup file (usually named like `FreshTomato_<version>~<model>.cfg`) that contains the full NVRAM dump. The new `nvram-cfg.ts` module provides a browser-friendly way to convert those files into JSON and to build new `.cfg` payloads.

```ts
import { decodeCfg, encodeCfg } from './nvram-cfg';

const bytes = await Bun.file('FreshTomato_2025_3~m30A0B0~Netgear_R7000~20251029.cfg').arrayBuffer();
const { entries } = decodeCfg(bytes);

console.log(entries.wan_ppp_mru); // -> "1500"

// Modify settings and rebuild an HDR2 cfg file.
entries.wan_hostname = 'lab-router';
const cfg = encodeCfg(entries);
await Bun.write('lab-router.cfg', cfg);
```

Key details:
- Works in browsers and Bun/Node (no fs/zlib dependencies).
- Supports both legacy `HDR1` and modern `HDR2` container headers.
- Mirrors the Broadcom nvram obfuscation and padding rules so generated files can be restored via the firmware UI.

================================================================================
CHANGED VALUES
================================================================================

Page: admin-access.asp
  lan_ipaddr
    defaults: 192.168.2.1
    production: 192.168.1.1
  ipv6_service
    defaults:
    production: native-pd
```

**Interactive Mode Features:**

When using `--interactive` flag:

1. Shows all differences in a checkbox list
2. Navigate with arrow keys, select with space bar
3. Press Enter to confirm selection
4. Generates ready-to-paste nvram commands:

```bash
nvram set lan_ipaddr="192.168.1.1"
nvram set ipv6_service="native-pd"
nvram set http_username="root"
nvram commit
```

5. Optionally saves commands to `nvram-commands.sh`

## Common Workflows

### Backup a Router

```bash
# 1. Fetch current configuration
bun fetch.ts --base http://192.168.1.1

# 2. Extract nvram data
bun extract-nvram.ts freshtomato-2025.3-on-netgear-r7000-202510261119

# 3. Done! You now have both HTML and JSON backups
```

### Migrate Settings to a New Router

```bash
# 1. Backup old router
bun fetch.ts --base http://192.168.1.1
bun extract-nvram.ts freshtomato-old-router-202510261100

# 2. Backup new router (factory defaults)
bun fetch.ts --base http://192.168.2.1
bun extract-nvram.ts freshtomato-new-router-202510261115

# 3. Compare and select settings to migrate
bun compare-nvram.ts \
  freshtomato-new-router-202510261115/nvram-data.json \
  freshtomato-old-router-202510261100/nvram-data.json \
  --interactive

# 4. Copy & paste generated commands into new router's SSH/telnet session
```

### Document Configuration Changes

```bash
# 1. Backup before changes
bun fetch.ts --base http://192.168.1.1
bun extract-nvram.ts freshtomato-before-202510261000

# 2. Make changes via web interface

# 3. Backup after changes
bun fetch.ts --base http://192.168.1.1
bun extract-nvram.ts freshtomato-after-202510261030

# 4. Generate change report
bun compare-nvram.ts \
  freshtomato-before-202510261000/nvram-data.json \
  freshtomato-after-202510261030/nvram-data.json \
  changes-report.txt
```

### Compare Default vs Configured Router

```bash
# Useful for documenting all custom settings
bun compare-nvram.ts \
  freshtomato-factory-defaults/nvram-data.json \
  freshtomato-production/nvram-data.json \
  my-customizations.txt
```

### 4. `build-field-reference.ts` – Generate Field Reference & Coverage Reports

Executes FreshTomato HTML pages and captures `createFieldTable()` calls to build `field-reference.json`. Two execution paths are available:

- **Lightweight executor** (default) – fast, but isolated per-script execution can miss fields that rely on shared globals.
- **DOM executor** (`--use-dom-executor`) – launches a full `happy-dom` window per page so globals persist across scripts. This captures significantly more fields and enables richer tracing.

**Usage:**

```bash
# Classic execution
bun build-field-reference.ts <dump-directory>

# Enable DOM executor (Option C)
bun build-field-reference.ts --use-dom-executor <dump-directory>

# Record nvram proxy accesses while building (writes nvram-access-log.json)
bun build-field-reference.ts --use-dom-executor --trace-nvram <dump-directory>

# Run DOM executor and compare baseline output (writes field-reference-baseline.json)
bun build-field-reference.ts --use-dom-executor --compare-baseline <dump-directory>
```

**Highlights:**
- DOM executor stubs required Tomato globals (e.g., `TomatoGrid`, `TomatoRefresh`, `navi`) inside a shared window context.
- Inline scripts are wrapped with instrumentation that assigns the current script name, hooks `createFieldTable`, and logs script errors without aborting the run.
- `--trace-nvram` keeps the existing proxy instrumentation so nvram reads/writes (including dynamic string keys) are recorded alongside the expanded field list.
- `--compare-baseline` rebuilds the legacy executor output, saves it to `field-reference-baseline.json`, and prints net static field gains so regressions are obvious.
- Timeout guards prevent runaway async tasks (`happyDOM.waitUntilComplete()` is bounded); slow pages are noted with a warning.

The resulting `field-reference.json` now contains ≥1500 static definitions when run with the DOM executor on current dumps, greatly improving coverage for IPv6, Samba, VPN, and other dynamic panels.

## Command Reference

### fetch.ts Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--base URL` | `-b` | Router base URL | `http://192.168.1.1` |
| `--outdir DIR` | `-o` | Output directory | Auto-generated |
| `--help` | `-h` | Show help | - |

### extract-nvram.ts Arguments

```bash
bun extract-nvram.ts <directory>
```

- `<directory>` - Directory containing HTML files from fetch.ts

### compare-nvram.ts Options

```bash
bun compare-nvram.ts <old-json> <new-json> [output-file] [--interactive]
```

| Argument | Description | Required |
|----------|-------------|----------|
| `<old-json>` | First nvram-data.json file | Yes |
| `<new-json>` | Second nvram-data.json file | Yes |
| `[output-file]` | Save report to file | No |
| `--interactive` or `-i` | Interactive mode | No |

### build-field-reference.ts Options

```bash
bun build-field-reference.ts [--trace-nvram] [--use-dom-executor] [--compare-baseline] <dump-directory>
```

| Option | Description | Notes |
|--------|-------------|-------|
| `--trace-nvram` | Wraps the per-page `nvram` object in a proxy and logs get/set events to `nvram-access-log.json`. | Works with both executors. |
| `--use-dom-executor` | Enables Option C full `happy-dom` window execution so all scripts share the same global context. | Recommended for maximal coverage. |
| `--compare-baseline` | (When paired with `--use-dom-executor`) regenerates the legacy output for comparison and writes `field-reference-baseline.json`. | Prints static-field deltas. |
| `<dump-directory>` | Directory containing HTML/asset dumps from `fetch.ts`. | Required. |

## File Structure

After running the tools, you'll have:

```
router-backup/
├── fetch.ts                                      # Fetch tool
├── extract-nvram.ts                              # Extract tool
├── compare-nvram.ts                              # Compare tool
├── freshtomato-2025.3-on-netgear-r7000-202510261119/
│   ├── index.asp.html                           # 90+ HTML files
│   ├── basic-network.asp.html
│   ├── admin-access.asp.html
│   ├── ...
│   └── nvram-data.json                          # Extracted config
├── comparison-report.txt                         # Comparison output
└── nvram-commands.sh                            # Generated commands
```

## Tips & Best Practices

### Regular Backups

Schedule regular backups to track configuration drift:

```bash
# Weekly backup
0 2 * * 0 cd /path/to/router-backup && bun fetch.ts --base http://192.168.1.1
```

### Version Control

Store backups in git for change tracking:

```bash
git init
git add freshtomato-*/nvram-data.json
git commit -m "Weekly router backup $(date +%Y-%m-%d)"
```

### Security Notes

- **Never commit passwords** to version control
- The fetch tools prompt for credentials interactively
- HTML dumps may contain sensitive data (WiFi passwords, VPN keys, etc.)
- Store backups securely and encrypt if necessary

### Troubleshooting

**Connection failures:**
- Verify router IP and HTTP/HTTPS access
- Check firewall rules
- Ensure HTTP admin access is enabled on router

**Missing version info:**
- Router may have custom theme
- Tool will use fallback directory name
- You can specify `--outdir` to override

**Authentication errors:**
- Verify username/password
- Some routers may require HTTPS
- Try `--base https://192.168.1.1`

## Advanced Usage

### Filtering Comparisons

Edit `compare-nvram.ts` to exclude certain keys or pages:

```typescript
// Skip volatile/dynamic values
const SKIP_KEYS = ['http_id', 'uptime', 'wl_radio'];
```

### Custom Page Lists

Edit `fetch.ts` PAGES array to fetch only specific pages:

```typescript
const PAGES = [
  'basic-network.asp',
  'advanced-wireless.asp',
  // ... your pages
];
```

### Batch Processing

Process multiple routers:

```bash
for ip in 192.168.1.1 192.168.2.1 192.168.3.1; do
  bun fetch.ts --base http://$ip
done
```

## Contributing

Contributions welcome! Areas for improvement:

- Support for other Tomato variants (Tomato, AdvancedTomato, etc.)
- Web-based comparison UI
- Encrypted backup support
- Configuration templates

## License

MIT License - feel free to use and modify for your needs.

## Author

Created for managing Fresh Tomato router configurations with modern tooling.
