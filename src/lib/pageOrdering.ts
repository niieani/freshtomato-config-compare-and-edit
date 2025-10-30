export interface PreferredPage {
  id: string;
  label: string;
}

export interface PreferredGroup {
  key: string;
  label: string;
  pages: PreferredPage[];
}

export interface PageDisplayMeta {
  pageId: string;
  pageLabel: string;
  groupKey: string;
  groupLabel: string;
  groupOrder: number;
  pageOrder: number;
}

export const UNCATALOGUED_GROUP_KEY = "uncatalogued";
export const UNCATALOGUED_GROUP_LABEL = "Uncatalogued";
export const UNCATALOGUED_GROUP_ORDER = Number.POSITIVE_INFINITY;

export const PREFERRED_MENU_STRUCTURE: readonly PreferredGroup[] = [
  {
    key: "status",
    label: "Status",
    pages: [
      { id: "status-devices.asp", label: "Device List" },
      { id: "status-webmon.asp", label: "Web Usage" },
      { id: "status-log.asp", label: "Logs" },
    ],
  },
  {
    key: "bandwidth",
    label: "Bandwidth",
    pages: [
      { id: "bwm-realtime.asp", label: "Real-Time" },
      { id: "bwm-24.asp", label: "Last 24 Hours" },
      { id: "bwm-daily.asp", label: "Daily" },
      { id: "bwm-weekly.asp", label: "Weekly" },
      { id: "bwm-monthly.asp", label: "Monthly" },
    ],
  },
  {
    key: "ip-traffic",
    label: "IP Traffic",
    pages: [
      { id: "ipt-realtime.asp", label: "Real-Time" },
      { id: "ipt-24.asp", label: "Last 24 Hours" },
      { id: "ipt-graphs.asp", label: "View Graphs" },
      { id: "ipt-details.asp", label: "Transfer Rates" },
      { id: "ipt-daily.asp", label: "Daily" },
      { id: "ipt-monthly.asp", label: "Monthly" },
    ],
  },
  {
    key: "tools",
    label: "Tools",
    pages: [
      { id: "tools-ping.asp", label: "Ping" },
      { id: "tools-trace.asp", label: "Traceroute" },
      { id: "tools-shell.asp", label: "System Commands" },
      { id: "tools-survey.asp", label: "Wireless Survey" },
      { id: "tools-qr.asp", label: "WiFi QR Codes" },
      { id: "tools-iperf.asp", label: "iPerf" },
      { id: "tools-wol.asp", label: "Wake on LAN" },
    ],
  },
  {
    key: "basic",
    label: "Basic",
    pages: [
      { id: "basic-network.asp", label: "Network" },
      { id: "basic-ipv6.asp", label: "IPv6" },
      { id: "basic-ident.asp", label: "Identification" },
      { id: "basic-time.asp", label: "Time" },
      { id: "basic-ddns.asp", label: "DDNS" },
      { id: "basic-static.asp", label: "DHCP Reservation" },
      { id: "basic-wfilter.asp", label: "Wireless Filter" },
    ],
  },
  {
    key: "advanced",
    label: "Advanced",
    pages: [
      { id: "advanced-ctnf.asp", label: "Conntrack/Netfilter" },
      { id: "advanced-dhcpdns.asp", label: "DHCP/DNS/TFTP" },
      { id: "advanced-firewall.asp", label: "Firewall" },
      { id: "advanced-adblock.asp", label: "Adblock" },
      { id: "advanced-mac.asp", label: "MAC Address" },
      { id: "advanced-misc.asp", label: "Miscellaneous" },
      { id: "advanced-routing.asp", label: "Routing" },
      { id: "advanced-pbr.asp", label: "MultiWAN Routing" },
      { id: "advanced-tor.asp", label: "TOR Project" },
      { id: "advanced-vlan.asp", label: "VLAN" },
      { id: "advanced-access.asp", label: "LAN Access" },
      { id: "advanced-wlanvifs.asp", label: "Virtual Wireless" },
      { id: "advanced-wireless.asp", label: "Wireless" },
    ],
  },
  {
    key: "port-forwarding",
    label: "Port Forwarding",
    pages: [
      { id: "forward-basic.asp", label: "Basic" },
      { id: "forward-basic-ipv6.asp", label: "Basic IPv6" },
      { id: "forward-dmz.asp", label: "DMZ" },
      { id: "forward-triggered.asp", label: "Triggered" },
      { id: "forward-upnp.asp", label: "UPnP IGD & PCP" },
    ],
  },
  {
    key: "qos",
    label: "QoS",
    pages: [
      { id: "qos-settings.asp", label: "Basic Settings" },
      { id: "qos-classify.asp", label: "Classification" },
      { id: "qos-graphs.asp", label: "View Graphs" },
      { id: "qos-detailed.asp", label: "View Details" },
      { id: "qos-ctrate.asp", label: "Transfer Rates" },
    ],
  },
  {
    key: "misc",
    label: "Misc",
    pages: [
      { id: "restrict.asp", label: "Access Restriction" },
      { id: "bwlimit.asp", label: "Bandwidth Limiter" },
      { id: "splashd.asp", label: "Captive Portal" },
    ],
  },
  {
    key: "web-server",
    label: "Web Server",
    pages: [
      { id: "web-nginx.asp", label: "Nginx & PHP" },
      { id: "web-mysql.asp", label: "MySQL Server" },
    ],
  },
  {
    key: "usb-nas",
    label: "USB and NAS",
    pages: [
      { id: "nas-usb.asp", label: "USB Support" },
      { id: "nas-ftp.asp", label: "FTP Server" },
      { id: "nas-samba.asp", label: "File Sharing" },
      { id: "nas-media.asp", label: "Media Server" },
      { id: "nas-ups.asp", label: "UPS Monitor" },
      { id: "nas-bittorrent.asp", label: "BitTorrent Client" },
    ],
  },
  {
    key: "vpn",
    label: "VPN",
    pages: [
      { id: "vpn-server.asp", label: "OpenVPN Server" },
      { id: "vpn-client.asp", label: "OpenVPN Client" },
      { id: "vpn-pptp-server.asp", label: "PPTP Server" },
      { id: "vpn-pptp-online.asp", label: "PPTP Online" },
      { id: "vpn-pptp.asp", label: "PPTP Client" },
      { id: "vpn-wireguard.asp", label: "Wireguard" },
      { id: "vpn-tinc.asp", label: "Tinc" },
    ],
  },
  {
    key: "administration",
    label: "Administration",
    pages: [
      { id: "admin-access.asp", label: "Admin Access" },
      { id: "admin-tomatoanon.asp", label: "TomatoAnon" },
      { id: "admin-bwm.asp", label: "Bandwidth Monitoring" },
      { id: "admin-iptraffic.asp", label: "IP Traffic Monitoring" },
      { id: "admin-buttons.asp", label: "Buttons/LED" },
      { id: "admin-cifs.asp", label: "CIFS Client" },
      { id: "admin-config.asp", label: "Configuration" },
      { id: "admin-debug.asp", label: "Debugging" },
      { id: "admin-jffs2.asp", label: "JFFS" },
      { id: "admin-nfs.asp", label: "NFS Server" },
      { id: "admin-snmp.asp", label: "SNMP" },
      { id: "admin-log.asp", label: "Logging" },
      { id: "admin-sched.asp", label: "Scheduler" },
      { id: "admin-scripts.asp", label: "Scripts" },
      { id: "admin-upgrade.asp", label: "Upgrade" },
    ],
  },
];

const pageMetaMap = new Map<string, PageDisplayMeta>();
const groupMetaMap = new Map<string, { label: string; order: number }>();

PREFERRED_MENU_STRUCTURE.forEach((group, groupIndex) => {
  groupMetaMap.set(group.key, { label: group.label, order: groupIndex });
  group.pages.forEach((page, pageIndex) => {
    pageMetaMap.set(page.id, {
      pageId: page.id,
      pageLabel: page.label,
      groupKey: group.key,
      groupLabel: group.label,
      groupOrder: groupIndex,
      pageOrder: pageIndex,
    });
  });
});

export function getPageDisplayMeta(pageId: string): PageDisplayMeta | undefined {
  return pageMetaMap.get(pageId);
}

export function getGroupDisplayMeta(
  groupKey: string,
): { label: string; order: number } | undefined {
  return groupMetaMap.get(groupKey);
}
