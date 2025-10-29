#!/usr/bin/env bun

import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { password, input } from '@inquirer/prompts';

interface FetchOptions {
  base: string;
  outdir?: string;
  username: string;
  password: string;
}

const PAGES = [
  // Status
  'index.asp', 'status-overview.asp', 'status-devices.asp', 'status-webmon.asp', 'status-log.asp',
  // Bandwidth
  'bwm-realtime.asp', 'bwm-24.asp', 'bwm-daily.asp', 'bwm-weekly.asp', 'bwm-monthly.asp',
  // IP Traffic
  'ipt-realtime.asp', 'ipt-24.asp', 'ipt-graphs.asp', 'ipt-details.asp', 'ipt-daily.asp', 'ipt-monthly.asp',
  // Tools
  'tools-ping.asp', 'tools-trace.asp', 'tools-shell.asp', 'tools-survey.asp',
  'tools-qr.asp?wl=0', 'tools-qr.asp?wl=1', 'tools-qr.asp?wl=0.1', 'tools-qr.asp?wl=1.1',
  'tools-iperf.asp', 'tools-wol.asp',
  // Basic
  'basic-network.asp', 'basic-ipv6.asp', 'basic-ident.asp', 'basic-time.asp',
  'basic-ddns.asp', 'basic-static.asp', 'basic-wfilter.asp',
  // Advanced
  'advanced-ctnf.asp', 'advanced-dhcpdns.asp', 'advanced-firewall.asp', 'advanced-adblock.asp',
  'advanced-mac.asp', 'advanced-misc.asp', 'advanced-routing.asp', 'advanced-pbr.asp',
  'advanced-tor.asp', 'advanced-vlan.asp', 'advanced-access.asp', 'advanced-wlanvifs.asp',
  'advanced-wireless.asp',
  // Port Forwarding
  'forward-basic.asp', 'forward-basic-ipv6.asp', 'forward-dmz.asp', 'forward-triggered.asp',
  'forward-upnp.asp',
  // QoS
  'qos-settings.asp', 'qos-classify.asp', 'qos-graphs.asp', 'qos-detailed.asp', 'qos-ctrate.asp',
  // Misc
  'restrict.asp', 'bwlimit.asp', 'splashd.asp',
  // Web Server
  'web-nginx.asp', 'web-mysql.asp',
  // USB/NAS
  'nas-usb.asp', 'nas-ftp.asp', 'nas-samba.asp', 'nas-media.asp', 'nas-ups.asp', 'nas-bittorrent.asp',
  // VPN
  'vpn-server.asp', 'vpn-client.asp', 'vpn-pptp-server.asp', 'vpn-pptp-online.asp',
  'vpn-pptp.asp', 'vpn-wireguard.asp', 'vpn-tinc.asp',
  // Admin
  'admin-access.asp', 'admin-tomatoanon.asp', 'admin-bwm.asp', 'admin-iptraffic.asp',
  'admin-buttons.asp', 'admin-cifs.asp', 'admin-config.asp', 'admin-debug.asp',
  'admin-jffs2.asp', 'admin-nfs.asp', 'admin-snmp.asp', 'admin-log.asp',
  'admin-sched.asp', 'admin-scripts.asp', 'admin-upgrade.asp',
  // About
  'about.asp'
];

/**
 * Fetch a page with authentication
 */
async function fetchPage(url: string, username: string, password: string): Promise<string> {
  const auth = 'Basic ' + btoa(`${username}:${password}`);

  const response = await fetch(url, {
    headers: {
      'Authorization': auth
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.text();
}

/**
 * Extract version info from the overview page
 * Example: <div class="version">Version 2025.3 on Netgear R7000</div>
 */
function extractVersion(html: string): string | null {
  const versionRegex = /<div class="version">Version\s+([^<]+)<\/div>/i;
  const match = html.match(versionRegex);

  if (match && match[1]) {
    return match[1].trim();
  }

  return null;
}

/**
 * Convert version string to directory-safe format
 * "2025.3 on Netgear R7000" -> "2025.3-on-netgear-r7000"
 */
function sanitizeVersion(version: string): string {
  return version
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.-]/g, '');
}

/**
 * Generate timestamp in format: YYYYMMDDHHMM
 */
function getTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}${hour}${minute}`;
}

/**
 * Sanitize filename for pages with query strings
 */
function sanitizeFilename(page: string): string {
  return page
    .replace(/\//g, '_')
    .replace(/\?/g, '_')
    .replace(/&/g, '_');
}

/**
 * Extract script and CSS URLs from HTML
 */
function extractAssetUrls(html: string): Set<string> {
  const urls = new Set<string>();

  // Match <script src="...">
  const scriptRegex = /<script\s+src="([^"]+)"/gi;
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    urls.add(match[1]!);
  }

  // Match <link rel="stylesheet" href="...">
  const linkRegex = /<link\s+[^>]*href="([^"]+)"[^>]*>/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    // Only include CSS files
    if (match[0]!.includes('stylesheet') || match[1]!.endsWith('.css')) {
      urls.add(match[1]!);
    }
  }

  return urls;
}

/**
 * Main fetch function
 */
async function fetchRouter(options: FetchOptions): Promise<void> {
  const { base, username, password } = options;
  let { outdir } = options;

  console.log(`Fetching from: ${base}`);
  console.log('');

  // Fetch the overview page first to get version info
  console.log('Fetching router version info...');
  let overviewHtml: string;

  try {
    overviewHtml = await fetchPage(base, username, password);
  } catch (error) {
    throw new Error(`Failed to fetch overview page: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Extract version
  const versionString = extractVersion(overviewHtml);

  if (!versionString) {
    console.warn('Warning: Could not extract version info from overview page');
    console.warn('Using default directory name');
  }

  // Generate output directory name if not provided
  if (!outdir) {
    const timestamp = getTimestamp();

    if (versionString) {
      const sanitizedVersion = sanitizeVersion(versionString);
      outdir = `freshtomato-${sanitizedVersion}-${timestamp}`;
    } else {
      outdir = `freshtomato-unknown-${timestamp}`;
    }
  }

  console.log(`Version: ${versionString || 'Unknown'}`);
  console.log(`Output directory: ${outdir}`);
  console.log('');

  // Create output directory
  await mkdir(outdir, { recursive: true });

  // Fetch all pages and collect asset URLs
  console.log(`Fetching ${PAGES.length} pages...`);

  let successCount = 0;
  let failCount = 0;
  const allAssetUrls = new Set<string>();

  for (const page of PAGES) {
    const url = `${base}/${page}`;
    const filename = sanitizeFilename(page) + ".html";
    const filepath = join(outdir, filename);

    try {
      const html = await fetchPage(url, username, password);
      await writeFile(filepath, html, "utf-8");

      // Extract asset URLs from this page
      const assetUrls = extractAssetUrls(html);
      for (const assetUrl of assetUrls) {
        allAssetUrls.add(assetUrl);
      }

      process.stdout.write(".");
      successCount++;
    } catch (error) {
      process.stdout.write("x");
      failCount++;
      console.error(
        `\nFailed to fetch ${page}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  console.log("\n");
  console.log(
    `✓ Successfully saved ${successCount}/${PAGES.length} pages to ${outdir}/`,
  );

  if (failCount > 0) {
    console.log(`⨯ Failed to fetch ${failCount} page(s)`);
  }

  // Fetch all assets
  if (allAssetUrls.size > 0) {
    console.log("");
    console.log(`Fetching ${allAssetUrls.size} asset files (JS/CSS)...`);

    let assetSuccessCount = 0;
    let assetFailCount = 0;

    for (const assetUrl of allAssetUrls) {
      // Remove query string for filename
      const urlWithoutQuery = assetUrl.split("?")[0]!;
      const filename = urlWithoutQuery.split("/").pop() || "unknown";
      const filepath = join(outdir, filename);

      // Build full URL
      const fullUrl = `${base}/${assetUrl}`;

      try {
        const content = await fetchPage(fullUrl, username, password);
        await writeFile(filepath, content, "utf-8");
        process.stdout.write(".");
        assetSuccessCount++;
      } catch (error) {
        process.stdout.write("x");
        assetFailCount++;
        // Don't print errors for each failed asset, just count them
      }
    }

    console.log("\n");
    console.log(
      `✓ Successfully saved ${assetSuccessCount}/${allAssetUrls.size} assets to ${outdir}/`,
    );

    if (assetFailCount > 0) {
      console.log(`⨯ Failed to fetch ${assetFailCount} asset(s)`);
    }
  }
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let base = 'http://192.168.1.1';
  let outdir: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: bun fetch.ts [OPTIONS]');
      console.log('');
      console.log('Fetch all Fresh Tomato router configuration pages');
      console.log('');
      console.log('Options:');
      console.log('  -b, --base URL     Base URL of router (default: http://192.168.1.1)');
      console.log('  -o, --outdir DIR   Output directory (default: auto-generated from version + timestamp)');
      console.log('  -h, --help         Show this help message');
      console.log('');
      console.log('Examples:');
      console.log('  bun fetch.ts');
      console.log('  bun fetch.ts --base http://192.168.2.1');
      console.log('  bun fetch.ts --base http://192.168.2.1 --outdir my-backup');
      process.exit(0);
    } else if (arg === '--base' || arg === '-b') {
      const nextArg = args[++i];
      if (!nextArg) {
        console.error('--base requires a value');
        process.exit(1);
      }
      base = nextArg;
    } else if (arg === '--outdir' || arg === '-o') {
      const nextArg = args[++i];
      if (!nextArg) {
        console.error('--outdir requires a value');
        process.exit(1);
      }
      outdir = nextArg;
    } else {
      console.error(`Unknown option: ${arg}`);
      console.error('Use --help for usage information');
      process.exit(1);
    }
  }

  // Prompt for credentials
  console.log('Fresh Tomato Configuration Fetcher');
  console.log('');

  const username = await input({
    message: 'Username:',
    default: 'root'
  });

  const pass = await password({
    message: 'Password:',
    mask: '*'
  });

  console.log('');

  try {
    await fetchRouter({
      base,
      outdir,
      username,
      password: pass
    });
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main();
