import {
  type NvramProperty,
  type PatternedNvramProperty,
  type ValueTransformer,
  type NvramValue,
  type Validator,
  booleanTransformer,
  netmaskValidator,
  pathValidator,
  portValidator,
  rangeValidator,
  buttonActionValidator,
} from "./nvram-catalog-types";

// --- NVRAM Catalog ---

export const country_code: PatternedNvramProperty<{ id: 0 | 1 | 2 }, string> = {
  getKey: (params) => `${params.id}:ccode`,
  regex: /^([0-2]):ccode$/,
  parameters: {
    id: {
      type: "integer",
      description: "Wireless interface index (e.g., 0, 1, 2)",
      range: [0, 2],
    },
  },
  description:
    "Specifies the wireless country code for regulatory compliance, affecting available channels and power levels.",
  page: "advanced-wireless.asp",
  type: "enum",
  ui: {
    label: "Country / Region",
    options: [
      // from: `wl_countries`
      { value: "#a", label: "#a (debug)" },
      { value: "#n", label: "#n" },
      { value: "#r", label: "#r (debug)" },
      { value: "0A", label: "0A" },
      { value: "0B", label: "0B" },
      { value: "0C", label: "0C" },
      { value: "AC", label: "AC" },
      { value: "AD", label: "AD" },
      { value: "AE", label: "U.AR. EMIRATES" },
      { value: "AF", label: "AFGHANISTAN" },
      { value: "AG", label: "AG" },
      { value: "AI", label: "AI" },
      { value: "AL", label: "ALBANIA" },
      { value: "AM", label: "AM" },
      { value: "AN", label: "AN" },
      { value: "AO", label: "AO" },
      { value: "AQ", label: "AQ" },
      { value: "AR", label: "ARGENTINA" },
      { value: "AS", label: "AS" },
      { value: "AT", label: "AUSTRIA" },
      { value: "AU", label: "AUSTRALIA" },
      { value: "AW", label: "AW" },
      { value: "AX", label: "AX" },
      { value: "AZ", label: "AZ" },
      { value: "BA", label: "BA" },
      { value: "BB", label: "BB" },
      { value: "BD", label: "BD" },
      { value: "BE", label: "BELGIUM" },
      { value: "BF", label: "BF" },
      { value: "BG", label: "BULGARIA" },
      { value: "BH", label: "BAHRAIN" },
      { value: "BI", label: "BI" },
      { value: "BJ", label: "BJ" },
      { value: "BL", label: "BL" },
      { value: "BM", label: "BM" },
      { value: "BN", label: "BN" },
      { value: "BO", label: "BO" },
      { value: "BR", label: "BRAZIL" },
      { value: "BS", label: "BS" },
      { value: "BT", label: "BT" },
      { value: "BV", label: "BV" },
      { value: "BW", label: "BW" },
      { value: "BY", label: "BY" },
      { value: "BZ", label: "BZ" },
      { value: "CA", label: "CANADA" },
      { value: "CC", label: "CC" },
      { value: "CD", label: "CD" },
      { value: "CF", label: "CF" },
      { value: "CG", label: "CONGO" },
      { value: "CH", label: "SWITZERLAND" },
      { value: "CI", label: "CI" },
      { value: "CK", label: "CK" },
      { value: "CL", label: "CHILE" },
      { value: "CM", label: "CM" },
      { value: "CN", label: "CHINA" },
      { value: "CO", label: "COLOMBIA" },
      { value: "CP", label: "CP" },
      { value: "CR", label: "CR" },
      { value: "CU", label: "CUBA" },
      { value: "CV", label: "CV" },
      { value: "CX", label: "CX" },
      { value: "CY", label: "CY" },
      { value: "CZ", label: "CZECH REPUBLIC" },
      { value: "DE", label: "GERMANY" },
      { value: "DJ", label: "DJ" },
      { value: "DK", label: "DENMARK" },
      { value: "DM", label: "DM" },
      { value: "DO", label: "DOMINICAN REP." },
      { value: "DZ", label: "ALGERIA" },
      { value: "E0", label: "E0" },
      { value: "EC", label: "ECUADOR" },
      { value: "EE", label: "ESTONIA" },
      { value: "EG", label: "EGYPT" },
      { value: "EH", label: "EH" },
      { value: "ER", label: "ER" },
      { value: "ES", label: "SPAIN" },
      { value: "ET", label: "ETHIOPIA" },
      { value: "EU", label: "EUROPE" },
      { value: "FI", label: "FINLAND" },
      { value: "FJ", label: "FJ" },
      { value: "FK", label: "FK" },
      { value: "FM", label: "MICRONESIA" },
      { value: "FO", label: "FO" },
      { value: "FR", label: "FRANCE" },
      { value: "GA", label: "GA" },
      { value: "GB", label: "GREAT BRITAIN" },
      { value: "GD", label: "GD" },
      { value: "GE", label: "GE" },
      { value: "GF", label: "GF" },
      { value: "GG", label: "GG" },
      { value: "GH", label: "GH" },
      { value: "GI", label: "GI" },
      { value: "GL", label: "GREENLAND" },
      { value: "GM", label: "GM" },
      { value: "GN", label: "GN" },
      { value: "GP", label: "GP" },
      { value: "GQ", label: "GQ" },
      { value: "GR", label: "GREECE" },
      { value: "GS", label: "GS" },
      { value: "GT", label: "GUATEMALA" },
      { value: "GU", label: "GUAM" },
      { value: "GW", label: "GW" },
      { value: "GY", label: "GY" },
      { value: "HK", label: "HONG KONG" },
      { value: "HM", label: "HM" },
      { value: "HN", label: "HONDURAS" },
      { value: "HR", label: "CROATIA" },
      { value: "HT", label: "HAITI" },
      { value: "HU", label: "HUNGARY" },
      { value: "ID", label: "INDONESIA" },
      { value: "IE", label: "IRELAND" },
      { value: "IL", label: "ISRAEL" },
      { value: "IM", label: "IM" },
      { value: "IN", label: "INDIA" },
      { value: "IO", label: "IO" },
      { value: "IQ", label: "IRAQ" },
      { value: "IR", label: "IRAN" },
      { value: "IS", label: "ICELAND" },
      { value: "IT", label: "ITALY" },
      { value: "J0", label: "J0" },
      { value: "JE", label: "JE" },
      { value: "JM", label: "JAMAICA" },
      { value: "JO", label: "JO" },
      { value: "JP", label: "JAPAN" },
      { value: "KE", label: "KE" },
      { value: "KG", label: "KG" },
      { value: "KH", label: "KH" },
      { value: "KI", label: "KI" },
      { value: "KM", label: "KM" },
      { value: "KN", label: "KN" },
      { value: "KP", label: "KOREA1" },
      { value: "KR", label: "KOREA2" },
      { value: "KW", label: "KUWAIT" },
      { value: "KY", label: "KY" },
      { value: "KZ", label: "KZ" },
      { value: "LA", label: "LA" },
      { value: "LB", label: "LB" },
      { value: "LC", label: "LC" },
      { value: "LI", label: "LIECHTENSTEIN" },
      { value: "LK", label: "SRI LANKA" },
      { value: "LR", label: "LR" },
      { value: "LS", label: "LS" },
      { value: "LT", label: "LITHUANIA" },
      { value: "LU", label: "LUXEMBOURG" },
      { value: "LV", label: "LV" },
      { value: "LY", label: "LY" },
      { value: "MA", label: "MOROCCO" },
      { value: "MC", label: "MC" },
      { value: "MD", label: "MOLDOVA" },
      { value: "ME", label: "MONTENEGRO" },
      { value: "MF", label: "MF" },
      { value: "MG", label: "MADAGASCAR" },
      { value: "MH", label: "MH" },
      { value: "MK", label: "MACEDONIA" },
      { value: "ML", label: "ML" },
      { value: "MM", label: "MM" },
      { value: "MN", label: "MONGOLIA" },
      { value: "MO", label: "MACAO" },
      { value: "MP", label: "MP" },
      { value: "MQ", label: "MQ" },
      { value: "MR", label: "MR" },
      { value: "MS", label: "MS" },
      { value: "MT", label: "MT" },
      { value: "MU", label: "MU" },
      { value: "MV", label: "MV" },
      { value: "MW", label: "MALAWI" },
      { value: "MX", label: "MEXICO" },
      { value: "MY", label: "MALAYSIA" },
      { value: "MZ", label: "MZ" },
      { value: "NA", label: "NAMIBIA" },
      { value: "NC", label: "NC" },
      { value: "NE", label: "NE" },
      { value: "NF", label: "NF" },
      { value: "NG", label: "NIGERIA" },
      { value: "NI", label: "NI" },
      { value: "NL", label: "NETHERLANDS" },
      { value: "NO", label: "NORWAY" },
      { value: "NP", label: "NEPAL" },
      { value: "NR", label: "NAURU" },
      { value: "NU", label: "NU" },
      { value: "NZ", label: "NEW ZEALAND" },
      { value: "OM", label: "OMAN" },
      { value: "PA", label: "PANAMA" },
      { value: "PE", label: "PERU" },
      { value: "PF", label: "PF" },
      { value: "PG", label: "PG" },
      { value: "PH", label: "PHILIPPINES" },
      { value: "PK", label: "PAKISTAN" },
      { value: "PL", label: "POLAND" },
      { value: "PM", label: "PM" },
      { value: "PN", label: "PITCAIRN" },
      { value: "PR", label: "PUERTO RICO" },
      { value: "PS", label: "PALESTINIAN" },
      { value: "PT", label: "PORTUGAL" },
      { value: "PW", label: "PALAU" },
      { value: "PY", label: "PARAGUAY" },
      { value: "Q1", label: "Q1" },
      { value: "Q2", label: "Q2" },
      { value: "QA", label: "QATAR" },
      { value: "RE", label: "RE" },
      { value: "RO", label: "ROMANIA" },
      { value: "RS", label: "SERBIA" },
      { value: "RU", label: "RUSSIA" },
      { value: "RW", label: "RWANDA" },
      { value: "SA", label: "SAUDI ARABIA" },
      { value: "SB", label: "SB" },
      { value: "SC", label: "SEYCHELLES" },
      { value: "SD", label: "SUDAN" },
      { value: "SE", label: "SWEDEN" },
      { value: "SG", label: "SINGAPORE" },
      { value: "SH", label: "SH" },
      { value: "SI", label: "SLOVENIA" },
      { value: "SJ", label: "SJ" },
      { value: "SK", label: "SLOVAKIA" },
      { value: "SL", label: "SIERRA LEONE" },
      { value: "SM", label: "SAN MARINO" },
      { value: "SN", label: "SENEGAL" },
      { value: "SO", label: "SOMALIA" },
      { value: "SR", label: "SR" },
      { value: "ST", label: "ST" },
      { value: "SV", label: "SV" },
      { value: "SY", label: "SYRIAN" },
      { value: "SZ", label: "SZ" },
      { value: "TA", label: "TA" },
      { value: "TC", label: "TURKS" },
      { value: "TD", label: "TD" },
      { value: "TF", label: "TF" },
      { value: "TG", label: "TG" },
      { value: "TH", label: "THAILAND" },
      { value: "TJ", label: "TJ" },
      { value: "TK", label: "TK" },
      { value: "TL", label: "TL" },
      { value: "TM", label: "TURKMENISTAN" },
      { value: "TN", label: "TUNISIA" },
      { value: "TO", label: "TO" },
      { value: "TR", label: "TURKEY" },
      { value: "TT", label: "TT" },
      { value: "TV", label: "TUVALU" },
      { value: "TW", label: "TAIWAN" },
      { value: "TZ", label: "TZ" },
      { value: "UA", label: "UKRAINE" },
      { value: "UG", label: "UGANDA" },
      { value: "UM", label: "UM" },
      { value: "US", label: "USA" },
      { value: "UY", label: "URUGUAY" },
      { value: "UZ", label: "UZBEKISTAN" },
      { value: "VA", label: "VATICAN CITY" },
      { value: "VC", label: "VC" },
      { value: "VE", label: "VENEZUELA" },
      { value: "VG", label: "VG" },
      { value: "VI", label: "VI" },
      { value: "VN", label: "VN" },
      { value: "VU", label: "VU" },
      { value: "WF", label: "WF" },
      { value: "WS", label: "WS" },
      { value: "X0", label: "X0" },
      { value: "X1", label: "X1" },
      { value: "X2", label: "X2" },
      { value: "X3", label: "X3" },
      { value: "XA", label: "XA" },
      { value: "XB", label: "XB" },
      { value: "XR", label: "XR" },
      { value: "XS", label: "XS" },
      { value: "XT", label: "XT" },
      { value: "XU", label: "XU" },
      { value: "XV", label: "XV" },
      { value: "XW", label: "XW" },
      { value: "XX", label: "XX" },
      { value: "XY", label: "XY" },
      { value: "XZ", label: "XZ" },
      { value: "Y1", label: "Y1" },
      { value: "Y2", label: "Y2" },
      { value: "Y3", label: "Y3" },
      { value: "Y4", label: "Y4" },
      { value: "Y5", label: "Y5" },
      { value: "Y6", label: "Y6" },
      { value: "Y7", label: "Y7" },
      { value: "YE", label: "YEMEN" },
      { value: "YT", label: "YT" },
      { value: "Z1", label: "Z1" },
      { value: "Z2", label: "Z2" },
      { value: "Z3", label: "Z3" },
      { value: "Z4", label: "Z4" },
      { value: "Z5", label: "Z5" },
      { value: "Z6", label: "Z6" },
      { value: "Z7", label: "Z7" },
      { value: "Z8", label: "Z8" },
      { value: "Z9", label: "Z9" },
      { value: "ZA", label: "SOUTH AFRICA" },
      { value: "ZM", label: "ZAMBIA" },
      { value: "ZW", label: "ZIMBABWE" },
    ] as ReadonlyArray<NvramOption<string>>,
  },
};

export const country_rev: PatternedNvramProperty<{ id: 0 | 1 | 2 }, number> = {
  getKey: (params) => `${params.id}:regrev`,
  regex: /^([0-2]):regrev$/,
  parameters: {
    id: {
      type: "integer",
      description: "Wireless interface index (e.g., 0, 1, 2)",
      range: [0, 2],
    },
  },
  description:
    "Specifies the wireless country revision number for regulatory compliance.",
  page: "advanced-wireless.asp",
  type: "integer",
  defaultValue: 0,
  validation: (value) => (value >= 0 && value <= 999) || "Valid range: 0 - 999",
  ui: {
    label: "Country Rev",
  },
};

interface AdblockBlacklistEntry {
  enabled: boolean;
  url: string;
  description: string;
}

export const adblock_blacklist: NvramProperty<AdblockBlacklistEntry[]> = {
  key: "adblock_blacklist",
  description:
    "A list of blacklist URLs used by the Adblock feature. Each entry is a composite string.",
  page: "advanced-adblock.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        enabled: { type: "boolean", label: "Enabled", defaultValue: false },
        url: { type: "string", label: "URL", defaultValue: "" },
        description: {
          type: "string",
          label: "Description",
          defaultValue: "",
        },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const parts = v.split("<");
          return {
            enabled: parts[0] === "1",
            url: parts[1] || "",
            description: parts[2] || "",
          };
        }),
    fromUi: (value) =>
      value
        .map((v) => `${v.enabled ? "1" : "0"}<${v.url}<${v.description}`)
        .join(">"),
  },
  ui: {
    label: "Domain blacklist URLs & Group-of-lists",
  },
};

export const adblock_blacklist_custom: NvramProperty<string> = {
  key: "adblock_blacklist_custom",
  description:
    "Custom, user-defined domain blacklist. Can contain individual domains or paths to external files.",
  page: "advanced-adblock.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Domain blacklist custom",
  },
};

export const adblock_enable: NvramProperty<boolean> = {
  key: "adblock_enable",
  description: "Enables or disables the Adblock (DNS filtering) feature.",
  page: "advanced-adblock.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Enable",
  },
};

export const adblock_limit: NvramProperty<string> = {
  key: "adblock_limit",
  description:
    "A hard limit in bytes for the generated dnsmasq.adblock file size to prevent excessive memory usage. An empty value resets it to an automatically calculated limit.",
  page: "advanced-adblock.asp",
  type: "string",
  defaultValue: "",
  validation: (value) =>
    value === "" || /^\d+$/.test(value) || "Value must be a number.",
  ui: {
    label: "Blockfile size limit",
  },
};

export const adblock_logs: NvramProperty<0 | 3 | 4 | 5 | 6 | 7> = {
  key: "adblock_logs",
  description: "Sets the maximum logging level for the Adblock service.",
  page: "advanced-adblock.asp",
  type: "enum",
  defaultValue: 3,
  ui: {
    label: "Max Log Level",
    options: [
      { value: 0, label: "Only Basic" },
      { value: 3, label: "3 Error (default)" },
      { value: 4, label: "4 Warning" },
      { value: 5, label: "5 Notification" },
      { value: 6, label: "6 Info" },
      { value: 7, label: "7 Debug + trace mode" },
    ],
  },
};

export const adblock_path: NvramProperty<string> = {
  key: "adblock_path",
  description:
    "Optional custom path to save potentially large Adblock files on permanent storage (e.g., USB drive). Defaults to /tmp if empty.",
  page: "advanced-adblock.asp",
  type: "string",
  defaultValue: "",
  validation: (value) =>
    !/\/+$/.test(value) || "Path should not have a trailing slash.",
  ui: {
    label: "Custom path (optional)",
  },
};

export const adblock_whitelist: NvramProperty<string> = {
  key: "adblock_whitelist",
  description:
    "Custom, user-defined domain whitelist. Can contain individual domains or paths to external files.",
  page: "advanced-adblock.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Domain whitelist",
  },
};

export const bcmnat_disable: NvramProperty<boolean> = {
  key: "bcmnat_disable",
  description:
    "Internal setting to control Broadcom's NAT acceleration. It is linked to CTF (Cut-Through Forwarding) and disabling it is required for QoS and Bandwidth Limiter to function.",
  page: "advanced-misc.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  // This key is not directly manipulated in the UI, `ctf_disable` is used instead.
};

export const blink_wl: NvramProperty<boolean> = {
  key: "blink_wl",
  description: "Enables blinking for the WiFi LEDs to indicate activity.",
  page: "admin-buttons.asp",
  type: "boolean",
  defaultValue: true,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Enable blink",
    suffix: " <small> (for WiFi)</small>",
  },
};

export const block_wan: NvramProperty<boolean> = {
  key: "block_wan",
  description:
    "Controls whether the router's WAN interface responds to ping (ICMP echo requests). If true (1), pings are blocked.",
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: true,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "WAN interfaces respond to Ping and Traceroute",
    // Note: The UI checkbox is inverted. 'checked' means `block_wan` is '0'.
  },
};

export const block_wan_limit: NvramProperty<boolean> = {
  key: "block_wan_limit",
  description: "Enables rate limiting for ICMP requests from the WAN.",
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: true,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Limit communication to",
  },
};

export const block_wan_limit_icmp: NvramProperty<number> = {
  key: "block_wan_limit_icmp",
  description:
    "Specifies the number of ICMP requests per second allowed from the WAN when rate limiting is enabled.",
  page: "advanced-firewall.asp",
  type: "integer",
  defaultValue: 3,
  validation: (value) =>
    (value >= 1 && value <= 300) || "Valid range: 1 - 300 requests per second",
  ui: {
    state: {
      dependsOn: ["block_wan", "block_wan_limit"],
      evaluator: (values) =>
        values["block_wan"] === "0" && values["block_wan_limit"] === "1"
          ? "enabled"
          : "disabled",
    },
  },
};

export const boardflags: NvramProperty<string> = {
  key: "boardflags",
  description:
    "A read-only hexadecimal value representing hardware capabilities of the router board, used to determine feature support like VLAN.",
  page: "advanced-vlan.asp",
  type: "hex",
};

export const boardtype: NvramProperty<string> = {
  key: "boardtype",
  description:
    "A read-only hexadecimal value identifying the router's board type.",
  page: "advanced-vlan.asp",
  type: "hex",
};

export const bt_auth: NvramProperty<boolean> = {
  key: "bt_auth",
  description:
    "Enables username/password authentication for the BitTorrent client's web GUI.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: true,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Authentication required",
  },
};

export const bt_autoadd: NvramProperty<boolean> = {
  key: "bt_autoadd",
  description:
    "Automatically adds .torrent files found in the download directory to the BitTorrent client.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: true,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Autoadd .torrents",
  },
};

export const bt_binary: NvramProperty<"internal" | "optware" | "custom"> = {
  key: "bt_binary",
  description:
    "Specifies the location of the Transmission (BitTorrent) client binaries.",
  page: "nas-bittorrent.asp",
  type: "enum",
  defaultValue: "internal",
  ui: {
    label: "Transmission binary path",
    options: [
      { value: "internal", label: "Internal (/usr/bin)" },
      { value: "optware", label: "Optware/Entware (/opt/bin)" },
      { value: "custom", label: "Custom" },
    ],
  },
};

export const bt_binary_custom: NvramProperty<string> = {
  key: "bt_binary_custom",
  description:
    "The custom path to the Transmission binaries, used when 'bt_binary' is set to 'custom'.",
  page: "nas-bittorrent.asp",
  type: "string",
  defaultValue: "/path/to/binaries/directory",
  ui: {
    state: {
      dependsOn: ["bt_binary"],
      evaluator: (values) =>
        values["bt_binary"] === "custom" ? "visible" : "hidden",
    },
  },
};

export const bt_blocklist: NvramProperty<boolean> = {
  key: "bt_blocklist",
  description:
    "Enables the use of a peer blocklist to avoid connecting to malicious or unwanted peers.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Blocklist",
  },
};

export const bt_blocklist_url: NvramProperty<string> = {
  key: "bt_blocklist_url",
  description: "The URL from which to download the peer blocklist.",
  page: "nas-bittorrent.asp",
  type: "string",
  defaultValue: "http://list.iblocklist.com/?list=bt_level1",
  ui: {
    state: {
      dependsOn: ["bt_blocklist"],
      evaluator: (values) =>
        values["bt_blocklist"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const bt_check_time: NvramProperty<number> = {
  key: "bt_check_time",
  description:
    "The interval in minutes for the keep-alive check to ensure the Transmission daemon is running. 0 disables the check.",
  page: "nas-bittorrent.asp",
  type: "integer",
  defaultValue: 15,
  validation: (value) =>
    (value >= 0 && value <= 55) || "Valid range: 0 - 55 minutes.",
  ui: {
    label: "Poll Interval",
  },
};

export const bt_custom: NvramProperty<string> = {
  key: "bt_custom",
  description:
    "Custom configuration parameters to be added to Transmission's settings.json file.",
  page: "nas-bittorrent.asp",
  type: "string",
  defaultValue: "",
  validation: (value) => {
    if (value.length > 2048) return "Maximum length is 2048 characters.";
    const forbidden = [
      "rpc-enable",
      "peer-port",
      "speed-limit-down-enabled",
      "speed-limit-up-enabled",
      "speed-limit-down",
      "speed-limit-up",
      "rpc-port",
      "rpc-username",
      "rpc-password",
      "download-dir",
      "incomplete-dir-enabled",
      "watch-dir-enabled",
      "peer-limit-global",
      "peer-limit-per-torrent",
      "upload-slots-per-torrent",
      "dht-enabled",
      "pex-enabled",
      "lpd-enabled",
      "utp-enabled",
      "ratio-limit-enabled",
      "ratio-limit",
      "rpc-authentication-required",
      "blocklist-enabled",
      "blocklist-url",
      "download-queue-enabled",
      "download-queue-size",
      "seed-queue-enabled",
      "seed-queue-size",
      "idle-seeding-limit-enabled",
      "idle-seeding-limit",
      "message-level",
      "rpc-whitelist-enabled",
      "incomplete-dir",
    ];
    for (const key of forbidden) {
      if (new RegExp(`"${key}":`).test(value)) {
        return `The "${key}" option is not allowed here and must be set via the GUI.`;
      }
    }
    return true;
  },
  ui: {
    label: "Custom Configuration",
  },
};

export const bt_dht: NvramProperty<boolean> = {
  key: "bt_dht",
  description: "Enables Distributed Hash Table (DHT) for finding more peers.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "DHT",
  },
};

export const bt_dir: NvramProperty<string> = {
  key: "bt_dir",
  description: "The default directory where completed torrents will be saved.",
  page: "nas-bittorrent.asp",
  type: "string",
  defaultValue: "/mnt",
  validation: (value) =>
    (value.startsWith("/") && !/<|>/.test(value)) ||
    "Must be a valid path starting with /.",
  ui: {
    label: "Download directory",
  },
};

export const bt_dl: NvramProperty<string> = {
  key: "bt_dl",
  description: "The global download speed limit in kB/s.",
  page: "nas-bittorrent.asp",
  type: "string",
  defaultValue: "248",
  validation: (value) => /^\d+$/.test(value) || "Must be a number.",
};

export const bt_dl_enable: NvramProperty<boolean> = {
  key: "bt_dl_enable",
  description: "Enables the global download speed limit.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Download limit",
  },
};

export const bt_dl_queue_enable: NvramProperty<boolean> = {
  key: "bt_dl_queue_enable",
  description:
    "Enables the download queue, limiting the number of torrents that can be downloaded simultaneously.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Downloads queuing",
  },
};

export const bt_dl_queue_size: NvramProperty<number> = {
  key: "bt_dl_queue_size",
  description: "The maximum number of torrents to download simultaneously.",
  page: "nas-bittorrent.asp",
  type: "integer",
  defaultValue: 5,
  validation: (value) => (value >= 1 && value <= 30) || "Valid range: 1 - 30.",
  ui: {
    state: {
      dependsOn: ["bt_dl_queue_enable"],
      evaluator: (values) =>
        values["bt_dl_queue_enable"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const bt_enable: NvramProperty<boolean> = {
  key: "bt_enable",
  description:
    "Enables the BitTorrent client to start automatically on router boot.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Enable on Start",
  },
};

export const bt_incomplete: NvramProperty<boolean> = {
  key: "bt_incomplete",
  description:
    "If enabled, incomplete downloads are stored in a subdirectory named '.incomplete' within the main download directory.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: true,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Use .incomplete/",
  },
};

export const bt_log: NvramProperty<boolean> = {
  key: "bt_log",
  description:
    "Enables logging to a custom file path instead of the system log.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Custom Log File Path",
  },
};

export const bt_log_path: NvramProperty<string> = {
  key: "bt_log_path",
  description: "The directory where the transmission.log file will be stored.",
  page: "nas-bittorrent.asp",
  type: "string",
  defaultValue: "/var/log",
  validation: (value) =>
    (value.startsWith("/") && !/<|>/.test(value)) ||
    "Must be a valid path starting with /.",
  ui: {
    state: {
      dependsOn: ["bt_log"],
      evaluator: (values) =>
        values["bt_log"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const bt_login: NvramProperty<string> = {
  key: "bt_login",
  description: "Username for accessing the Transmission web GUI.",
  page: "nas-bittorrent.asp",
  type: "string",
  defaultValue: "admin",
  validation: (value) => value.trim() !== "" || "Username cannot be empty.",
  ui: {
    label: "Username",
  },
};

export const bt_lpd: NvramProperty<boolean> = {
  key: "bt_lpd",
  description:
    "Enables Local Peer Discovery (LPD) to find peers on the local network.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "LPD",
  },
};

export const bt_message: NvramProperty<"0" | "1" | "2" | "3"> = {
  key: "bt_message",
  description: "Sets the verbosity level of Transmission's logging.",
  page: "nas-bittorrent.asp",
  type: "enum",
  defaultValue: "2",
  ui: {
    label: "Message level",
    options: [
      { value: "0", label: "None" },
      { value: "1", label: "Error" },
      { value: "2", label: "Info" },
      { value: "3", label: "Debug" },
    ],
  },
};

export const bt_password: NvramProperty<string> = {
  key: "bt_password",
  description: "Password for accessing the Transmission web GUI.",
  page: "nas-bittorrent.asp",
  type: "string",
  defaultValue: "admin11",
  validation: (value) => value.trim() !== "" || "Password cannot be empty.",
  ui: {
    label: "Password",
  },
};

export const bt_peer_limit_global: NvramProperty<number> = {
  key: "bt_peer_limit_global",
  description: "The maximum total number of peers across all torrents.",
  page: "nas-bittorrent.asp",
  type: "integer",
  defaultValue: 150,
  validation: (value) =>
    (value >= 10 && value <= 1000) || "Valid range: 10 - 1000.",
  ui: {
    label: "Global peer limit",
  },
};

export const bt_peer_limit_per_torrent: NvramProperty<number> = {
  key: "bt_peer_limit_per_torrent",
  description: "The maximum number of peers for a single torrent.",
  page: "nas-bittorrent.asp",
  type: "integer",
  defaultValue: 30,
  validation: (value) =>
    (value >= 1 && value <= 200) || "Valid range: 1 - 200.",
  ui: {
    label: "Peer limit per torrent",
  },
};

export const bt_pex: NvramProperty<boolean> = {
  key: "bt_pex",
  description: "Enables Peer Exchange (PEX) to find more peers.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "PEX",
  },
};

export const bt_port: NvramProperty<number> = {
  key: "bt_port",
  description: "The incoming TCP port for peer connections.",
  page: "nas-bittorrent.asp",
  type: "integer",
  defaultValue: 51515,
  validation: (value) =>
    (value >= 1 && value <= 65535) || "Must be a valid port number (1-65535).",
  ui: {
    label: "Listening port",
  },
};

export const bt_port_gui: NvramProperty<number> = {
  key: "bt_port_gui",
  description: "The port for accessing the Transmission web GUI.",
  page: "nas-bittorrent.asp",
  type: "integer",
  defaultValue: 9091,
  validation: (value) =>
    (value >= 1 && value <= 65535) || "Must be a valid port number (1-65535).",
  ui: {
    label: "Listening port",
    state: {
      dependsOn: ["bt_rpc_enable"],
      evaluator: (values) =>
        values["bt_rpc_enable"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const bt_ratio: NvramProperty<string> = {
  key: "bt_ratio",
  description: "The share ratio at which seeding will stop for a torrent.",
  page: "nas-bittorrent.asp",
  type: "enum",
  defaultValue: "1.0000",
  ui: {
    options: [
      { value: "0.0000", label: "0.0" },
      { value: "0.1000", label: "0.1" },
      { value: "0.2000", label: "0.2" },
      { value: "0.5000", label: "0.5" },
      { value: "1.0000", label: "1.0" },
      { value: "1.5000", label: "1.5" },
      { value: "2.0000", label: "2.0" },
      { value: "2.5000", label: "2.5" },
      { value: "3.0000", label: "3.0" },
    ],
  },
};

export const bt_ratio_enable: NvramProperty<boolean> = {
  key: "bt_ratio_enable",
  description:
    "Enables stopping torrents when they reach a specific share ratio.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Stop seeding at ratio",
  },
};

export const bt_ratio_idle: NvramProperty<number> = {
  key: "bt_ratio_idle",
  description:
    "The number of minutes a torrent can be idle (no download/upload activity) before seeding is stopped, regardless of ratio.",
  page: "nas-bittorrent.asp",
  type: "integer",
  defaultValue: 30,
  validation: (value) =>
    (value >= 1 && value <= 55) || "Valid range: 1 - 55 minutes.",
  ui: {
    state: {
      dependsOn: ["bt_ratio_idle_enable"],
      evaluator: (values) =>
        values["bt_ratio_idle_enable"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const bt_ratio_idle_enable: NvramProperty<boolean> = {
  key: "bt_ratio_idle_enable",
  description:
    "Enables stopping torrents after they have been idle for a specified time.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Stop seeding if idle for",
  },
};

export const bt_rpc_enable: NvramProperty<boolean> = {
  key: "bt_rpc_enable",
  description: "Enables the Transmission web GUI (RPC interface).",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: true,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Enable",
  },
};

export const bt_rpc_wan: NvramProperty<boolean> = {
  key: "bt_rpc_wan",
  description:
    "Allows the Transmission web GUI to be accessed from the WAN interface.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Allow remote access",
  },
};

export const bt_settings: NvramProperty<
  "down_dir" | "/jffs" | "/cifs1" | "/cifs2" | "/tmp" | "custom"
> = {
  key: "bt_settings",
  description:
    "Specifies where Transmission's configuration files (settings.json) are stored.",
  page: "nas-bittorrent.asp",
  type: "enum",
  defaultValue: "down_dir",
  ui: {
    label: "Save settings location",
    options: [
      { value: "down_dir", label: "In the Download directory (Recommended)" },
      { value: "/jffs", label: "JFFS2" },
      { value: "/cifs1", label: "CIFS 1" },
      { value: "/cifs2", label: "CIFS 2" },
      { value: "/tmp", label: "RAM (Temporary)" },
      { value: "custom", label: "Custom" },
    ],
  },
};

export const bt_settings_custom: NvramProperty<string> = {
  key: "bt_settings_custom",
  description:
    "Custom path for storing Transmission configuration files, used when 'bt_settings' is 'custom'.",
  page: "nas-bittorrent.asp",
  type: "string",
  defaultValue: "/etc/transmission",
  ui: {
    state: {
      dependsOn: ["bt_settings"],
      evaluator: (values) =>
        values["bt_settings"] === "custom" ? "visible" : "hidden",
    },
  },
};

export const bt_sleep: NvramProperty<number> = {
  key: "bt_sleep",
  description:
    "Delay in seconds before starting the Transmission daemon at boot.",
  page: "nas-bittorrent.asp",
  type: "integer",
  defaultValue: 10,
  validation: (value) =>
    (value >= 1 && value <= 60) || "Valid range: 1 - 60 seconds.",
  ui: {
    label: "Delay at startup",
  },
};

export const bt_ul: NvramProperty<string> = {
  key: "bt_ul",
  description: "The global upload speed limit in kB/s.",
  page: "nas-bittorrent.asp",
  type: "string",
  defaultValue: "64",
  validation: (value) => /^\d+$/.test(value) || "Must be a number.",
};

export const bt_ul_enable: NvramProperty<boolean> = {
  key: "bt_ul_enable",
  description: "Enables the global upload speed limit.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Upload limit",
  },
};

export const bt_ul_queue_enable: NvramProperty<boolean> = {
  key: "bt_ul_queue_enable",
  description:
    "Enables the seed queue, limiting the number of torrents that can be seeded simultaneously.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Seeds queuing",
  },
};

export const bt_ul_queue_size: NvramProperty<number> = {
  key: "bt_ul_queue_size",
  description: "The maximum number of torrents to seed simultaneously.",
  page: "nas-bittorrent.asp",
  type: "integer",
  defaultValue: 5,
  validation: (value) => (value >= 1 && value <= 30) || "Valid range: 1 - 30.",
  ui: {
    state: {
      dependsOn: ["bt_ul_queue_enable"],
      evaluator: (values) =>
        values["bt_ul_queue_enable"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const bt_ul_slot_per_torrent: NvramProperty<number> = {
  key: "bt_ul_slot_per_torrent",
  description:
    "The maximum number of upload slots (peers) for a single torrent.",
  page: "nas-bittorrent.asp",
  type: "integer",
  defaultValue: 10,
  validation: (value) => (value >= 1 && value <= 50) || "Valid range: 1 - 50.",
  ui: {
    label: "Upload slots per torrent",
  },
};

export const bt_utp: NvramProperty<boolean> = {
  key: "bt_utp",
  description:
    "Enables the Micro Transport Protocol (µTP) for peer connections.",
  page: "nas-bittorrent.asp",
  type: "boolean",
  defaultValue: true,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "uTP",
  },
};

// (Continuing from the previous TypeScript definitions...)

// --- Bandwidth Limiter (bwlimit.asp) ---

export const bwl_enable: NvramProperty<boolean> = {
  key: "bwl_enable",
  description:
    "Enables or disables the IP/Range Bandwidth Limiter feature. This feature requires CTF (Cut-Through Forwarding) to be disabled.",
  page: "bwlimit.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Enable Limiter",
    state: {
      dependsOn: ["ctf_disable"],
      // The UI shows a warning and disables the checkbox if CTF is enabled (ctf_disable=0)
      evaluator: (values) =>
        values["ctf_disable"] === "0" ? "disabled" : "enabled",
    },
  },
};

interface BwlRule {
  enabled: boolean;
  target: string; // IP, IP Range, or MAC
  downloadRate: number;
  downloadCeil: number;
  uploadRate: number;
  uploadCeil: number;
  priority: "0" | "1" | "2" | "3" | "4";
  tcpLimit: string;
  udpLimit: string;
  description: string;
}

export const bwl_rules: NvramProperty<BwlRule[]> = {
  key: "bwl_rules",
  description:
    "A list of rules for the Bandwidth Limiter. Each rule specifies bandwidth limits and priority for a given IP, IP range, or MAC address.",
  page: "bwlimit.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        enabled: { type: "boolean", label: "Enabled", defaultValue: false },
        target: { type: "string", label: "Target", defaultValue: "" },
        downloadRate: {
          type: "integer",
          label: "Download Rate",
          defaultValue: 0,
        },
        downloadCeil: {
          type: "integer",
          label: "Download Ceiling",
          defaultValue: 0,
        },
        uploadRate: {
          type: "integer",
          label: "Upload Rate",
          defaultValue: 0,
        },
        uploadCeil: {
          type: "integer",
          label: "Upload Ceiling",
          defaultValue: 0,
        },
        priority: { type: "string", label: "Priority", defaultValue: "2" },
        tcpLimit: { type: "string", label: "TCP Limit", defaultValue: "0" },
        udpLimit: { type: "string", label: "UDP Limit", defaultValue: "0" },
        description: {
          type: "string",
          label: "Description",
          defaultValue: "",
        },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const parts = v.split("<");
          return {
            enabled: parts[0] === "1",
            target: parts[1] || "",
            downloadRate: parseInt(parts[2] || "0", 10) || 0,
            downloadCeil: parseInt(parts[3] || "0", 10) || 0,
            uploadRate: parseInt(parts[4] || "0", 10) || 0,
            uploadCeil: parseInt(parts[5] || "0", 10) || 0,
            priority: (parts[6] as "0" | "1" | "2" | "3" | "4") || "2",
            tcpLimit: parts[7] || "0",
            udpLimit: parts[8] || "0",
            description: parts[9] || "",
          };
        }),
    fromUi: (value) =>
      value
        .map((v) =>
          [
            v.enabled ? "1" : "0",
            v.target,
            v.downloadRate,
            v.downloadCeil,
            v.uploadRate,
            v.uploadCeil,
            v.priority,
            v.tcpLimit,
            v.udpLimit,
            v.description,
          ].join("<"),
        )
        .join(">"),
  },
  ui: {
    label: "Bandwidth Limiter Rules",
  },
};

type BridgeParam = { bridgeIndex: 0 | 1 | 2 | 3 };
const bridgeIndexRegex = /^bwl_br([0-3])_enable$/;

export const bwl_bridge_enable: PatternedNvramProperty<BridgeParam, boolean> = {
  getKey: ({ bridgeIndex }) => `bwl_br${bridgeIndex}_enable`,
  regex: /^bwl_br([0-3])_enable$/,
  parameters: {
    bridgeIndex: {
      type: "integer",
      description: "LAN Bridge Index (0-3)",
      range: [0, 3],
    },
  },
  description:
    "Enables the default bandwidth limiting class for unlisted clients on a specific LAN bridge.",
  page: "bwlimit.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Enable",
    state: {
      dependsOn: ["bwl_enable", "lan{bridgeIndex}_ifname"],
      evaluator: (values) =>
        values["bwl_enable"] === "1" && values["lan{bridgeIndex}_ifname"]
          ? "enabled"
          : "disabled",
    },
  },
};

const commonBwlBridgeProps = (
  prop: "dlr" | "dlc" | "ulr" | "ulc",
): PatternedNvramProperty<BridgeParam, number | ""> => ({
  getKey: ({ bridgeIndex }) => `bwl_br${bridgeIndex}_${prop}`,
  regex: new RegExp(`^bwl_br([0-3])_${prop}$`),
  parameters: {
    bridgeIndex: {
      type: "integer",
      description: "LAN Bridge Index (0-3)",
      range: [0, 3],
    },
  },
  description: `Default ${prop.includes("dl") ? "Download" : "Upload"} ${
    prop.endsWith("r") ? "Rate" : "Ceiling"
  } in kbit/s for the bridge.`,
  page: "bwlimit.asp",
  type: "integer",
  defaultValue: "",
  validation: (value) =>
    value === "" ||
    (value >= 1 && value <= 99999999) ||
    `Rate/Ceiling must be between 1 and 99999999 kbit/s.`,
  ui: {
    label: `${prop.includes("dl") ? "Download" : "Upload"} ${
      prop.endsWith("r") ? "rate" : "ceil"
    }`,
    state: {
      dependsOn: ["bwl_enable", "bwl_br{bridgeIndex}_enable"],
      evaluator: (values) =>
        values["bwl_enable"] === "1" &&
        values["bwl_br{bridgeIndex}_enable"] === "1"
          ? "enabled"
          : "disabled",
    },
  },
});

export const bwl_br_dlr = commonBwlBridgeProps("dlr");
export const bwl_br_dlc = commonBwlBridgeProps("dlc");
export const bwl_br_ulr = commonBwlBridgeProps("ulr");
export const bwl_br_ulc = commonBwlBridgeProps("ulc");

export const bwl_br_prio: PatternedNvramProperty<
  BridgeParam,
  "0" | "1" | "2" | "3" | "4"
> = {
  getKey: ({ bridgeIndex }) => `bwl_br${bridgeIndex}_prio`,
  regex: /^bwl_br([0-3])_prio$/,
  parameters: {
    bridgeIndex: {
      type: "integer",
      description: "LAN Bridge Index (0-3)",
      range: [0, 3],
    },
  },
  description: "Default traffic priority for the LAN bridge.",
  page: "bwlimit.asp",
  type: "enum",
  defaultValue: "2",
  ui: {
    label: "Priority",
    options: [
      { value: "0", label: "Highest" },
      { value: "1", label: "High" },
      { value: "2", label: "Normal" },
      { value: "3", label: "Low" },
      { value: "4", label: "Lowest" },
    ],
    state: {
      dependsOn: ["bwl_enable", "bwl_br{bridgeIndex}_enable"],
      evaluator: (values) =>
        values["bwl_enable"] === "1" &&
        values["bwl_br{bridgeIndex}_enable"] === "1"
          ? "enabled"
          : "disabled",
    },
  },
};

export const bwl_br0_tcp: NvramProperty<string> = {
  key: "bwl_br0_tcp",
  description:
    "Default TCP connection limit for unlisted clients on LAN0 (br0).",
  page: "bwlimit.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "TCP Limit",
    options: [
      { value: "0", label: "no limit" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "5", label: "5" },
      { value: "10", label: "10" },
      { value: "20", label: "20" },
      { value: "50", label: "50" },
      { value: "100", label: "100" },
      { value: "200", label: "200" },
      { value: "500", label: "500" },
      { value: "1000", label: "1000" },
    ],
    state: {
      dependsOn: ["bwl_enable", "bwl_br0_enable"],
      evaluator: (values) =>
        values["bwl_enable"] === "1" && values["bwl_br0_enable"] === "1"
          ? "enabled"
          : "disabled",
    },
  },
};

export const bwl_br0_udp: NvramProperty<string> = {
  key: "bwl_br0_udp",
  description:
    "Default UDP packets per second limit for unlisted clients on LAN0 (br0).",
  page: "bwlimit.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "UDP limit",
    options: [
      { value: "0", label: "no limit" },
      { value: "1", label: "1/s" },
      { value: "2", label: "2/s" },
      { value: "5", label: "5/s" },
      { value: "10", label: "10/s" },
      { value: "20", label: "20/s" },
      { value: "50", label: "50/s" },
      { value: "100", label: "100/s" },
    ],
    state: {
      dependsOn: ["bwl_enable", "bwl_br0_enable"],
      evaluator: (values) =>
        values["bwl_enable"] === "1" && values["bwl_br0_enable"] === "1"
          ? "enabled"
          : "disabled",
    },
  },
};

// --- CIFS Client (admin-cifs.asp) ---

interface CifsConfig {
  enabled: boolean;
  unc: string;
  username: string;
  password?: string;
  domain?: string;
  exec?: string;
  netbiosName?: string;
  security?: "" | "ntlmi" | "ntlmv2" | "ntlmv2i" | "nontlm" | "lanman" | "none";
}

export const cifs: PatternedNvramProperty<{ index: 1 | 2 }, CifsConfig> = {
  getKey: (params) => `cifs${params.index}`,
  regex: /^cifs([1-2])$/,
  parameters: {
    index: {
      type: "integer",
      description: "CIFS client mount point index",
      range: [1, 2],
    },
  },
  description:
    "Configuration for a CIFS client mount point. Stored as a composite string.",
  page: "admin-cifs.asp",
  type: "structured-string",
  defaultValue: { enabled: false, unc: "", username: "" },
  structuredSchema: {
    kind: "object",
    fields: {
      enabled: { type: "boolean", label: "Enabled", defaultValue: false },
      unc: { type: "string", label: "UNC Path", defaultValue: "" },
      username: { type: "string", label: "Username", defaultValue: "" },
      password: {
        type: "string",
        label: "Password",
        defaultValue: "",
        optional: true,
      },
      domain: {
        type: "string",
        label: "Domain",
        defaultValue: "",
        optional: true,
      },
      exec: {
        type: "string",
        label: "Mount Script",
        defaultValue: "",
        optional: true,
      },
      netbiosName: {
        type: "string",
        label: "NetBIOS Name",
        defaultValue: "",
        optional: true,
      },
      security: {
        type: "string",
        label: "Security",
        defaultValue: "",
        optional: true,
      },
    },
  },
  transform: {
    toUi: (value) => {
      const parts = value.split("<");
      return {
        enabled: parts[0] === "1",
        unc: parts[1] || "",
        username: parts[2] || "",
        password: parts[3] || "",
        domain: parts[4] || "",
        exec: parts[5] || "",
        netbiosName: parts[6] || "",
        security: (parts[7] as CifsConfig["security"]) || "",
      };
    },
    fromUi: (value) =>
      [
        value.enabled ? "1" : "0",
        value.unc || "",
        value.username || "",
        value.password || "",
        value.domain || "",
        value.exec || "",
        value.netbiosName || "",
        value.security || "",
      ].join("<"),
  },
  validation: (value, allValues) => {
    if (!value.enabled) return true;
    if (!value.username || value.username.length < 1)
      return "Username is required.";
    if (!value.password || value.password.length < 1)
      return "Password is required.";
    if (!/^\\\\.+\\./.test(value.unc)) return "Invalid UNC path.";
    return true;
  },
};

// --- Debugging (admin-debug.asp) ---

export const console_loglevel: NvramProperty<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8> = {
  key: "console_loglevel",
  description:
    "Sets the minimum kernel printk log level. A reboot is required to apply changes.",
  page: "admin-debug.asp",
  type: "enum",
  defaultValue: 1,
  ui: {
    label: "Kernel printk log level",
    options: [
      { value: 1, label: "Emergency" },
      { value: 2, label: "Alert" },
      { value: 3, label: "Critical" },
      { value: 4, label: "Error" },
      { value: 5, label: "Warning" },
      { value: 6, label: "Notice" },
      { value: 7, label: "Info" },
      { value: 8, label: "Debug" },
    ],
  },
};

// --- IP Traffic (admin-iptraffic.asp) ---

export const cstats_all: NvramProperty<boolean> = {
  key: "cstats_all",
  description:
    "Enables auto-discovery of new IP addresses for traffic monitoring.",
  page: "admin-iptraffic.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Enable Auto-Discovery",
  },
};

export const cstats_bak: NvramProperty<boolean> = {
  key: "cstats_bak",
  description: "Creates backups of the IP traffic monitoring data file.",
  page: "admin-iptraffic.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Create Backups",
    state: {
      dependsOn: ["cstats_path"],
      // The UI disables this if the path is RAM or NVRAM. Here we check for non-permanent storage.
      evaluator: (values) =>
        values["cstats_path"] === "" || values["cstats_path"] === "*nvram"
          ? "disabled"
          : "enabled",
    },
  },
};

export const cstats_enable: NvramProperty<boolean> = {
  key: "cstats_enable",
  description: "Enables the IP Traffic Monitoring feature.",
  page: "admin-iptraffic.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Enable",
  },
};

export const cstats_exclude: NvramProperty<string[]> = {
  key: "cstats_exclude",
  description:
    "A comma-separated list of IP addresses to exclude from traffic monitoring.",
  page: "admin-iptraffic.asp",
  type: "list",
  defaultValue: [],
  transform: {
    toUi: (v) => (v ? v.split(",") : []),
    fromUi: (v) => v.join(","),
  },
  ui: {
    label: "Do not monitor these IPs",
  },
};

export const cstats_include: NvramProperty<string[]> = {
  key: "cstats_include",
  description:
    "A comma-separated list of IP addresses to include in traffic monitoring. Also used to enable IP Traffic stats for DHCP reservations.",
  page: "admin-iptraffic.asp", // Also modified on basic-static.asp
  type: "list",
  defaultValue: [],
  transform: {
    toUi: (v) => (v ? v.split(",") : []),
    fromUi: (v) => v.join(","),
  },
  ui: {
    label: "Monitor these IPs",
    state: {
      dependsOn: ["cstats_all"],
      evaluator: (values) =>
        values["cstats_all"] === "1" ? "disabled" : "enabled",
    },
  },
};

export const cstats_labels: NvramProperty<0 | 1 | 2> = {
  key: "cstats_labels",
  description:
    "Controls how hostnames and IP addresses are displayed on IP Traffic graphs.",
  page: "admin-iptraffic.asp",
  type: "enum",
  defaultValue: 0,
  ui: {
    label: "Labels on graphics",
    options: [
      { value: 0, label: "Show known hostnames and IPs" },
      {
        value: 1,
        label: "Prefer to show only known hostnames, otherwise show IPs",
      },
      { value: 2, label: "Show only IPs" },
    ],
  },
};

export const cstats_offset: NvramProperty<number> = {
  key: "cstats_offset",
  description:
    "The day of the month to use as the start for monthly traffic calculations (1-31).",
  page: "admin-iptraffic.asp",
  type: "integer",
  defaultValue: 1,
  validation: (value) => (value >= 1 && value <= 31) || "Valid range: 1 - 31.",
  ui: {
    label: "First Day Of The Month",
  },
};

export const cstats_path: NvramProperty<string> = {
  key: "cstats_path",
  description: "Location to save the IP Traffic history data.",
  page: "admin-iptraffic.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Save History Location",
  },
};

export const cstats_sshut: NvramProperty<boolean> = {
  key: "cstats_sshut",
  description: "If enabled, saves the IP traffic data on router halt/reboot.",
  page: "admin-iptraffic.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Save On Halt",
  },
};

export const cstats_stime: NvramProperty<number> = {
  key: "cstats_stime",
  description:
    "Frequency at which IP traffic data is saved to the specified location.",
  page: "admin-iptraffic.asp",
  type: "enum",
  defaultValue: 24, // Assuming a common default, was empty in source
  ui: {
    label: "Save Frequency",
    options: [
      { value: 1, label: "Every Hour" },
      { value: 2, label: "Every 2 Hours" },
      { value: 3, label: "Every 3 Hours" },
      { value: 4, label: "Every 4 Hours" },
      { value: 5, label: "Every 5 Hours" },
      { value: 6, label: "Every 6 Hours" },
      { value: 9, label: "Every 9 Hours" },
      { value: 12, label: "Every 12 Hours" },
      { value: 24, label: "Every 24 Hours" },
      { value: 48, label: "Every 2 Days" },
      { value: 72, label: "Every 3 Days" },
      { value: 96, label: "Every 4 Days" },
      { value: 120, label: "Every 5 Days" },
      { value: 144, label: "Every 6 Days" },
      { value: 168, label: "Every Week" },
    ],
  },
};

// --- Conntrack / Netfilter (advanced-ctnf.asp) ---

export const ct_hashsize: NvramProperty<number> = {
  key: "ct_hashsize",
  description: "The size of the connection tracking hash table.",
  page: "advanced-ctnf.asp",
  type: "integer",
  defaultValue: 1023,
  validation: (value) =>
    (value >= 127 && value <= 65535) || "Valid range: 127 - 65535.",
  ui: {
    label: "Hash Table Size",
  },
};

export const ct_max: NvramProperty<number> = {
  key: "ct_max",
  description:
    "The maximum number of connections the router can track simultaneously.",
  page: "advanced-ctnf.asp",
  type: "integer",
  defaultValue: 4096,
  validation: (value) =>
    (value >= 128 && value <= 300000) || "Valid range: 128 - 300000.",
  ui: {
    label: "Maximum Connections",
  },
};

export const ct_tcp_timeout: NvramProperty<number[]> = {
  key: "ct_tcp_timeout",
  description:
    "Space-separated list of TCP connection state timeout values in seconds.",
  page: "advanced-ctnf.asp",
  type: "structured-string",
  defaultValue: [0, 1200, 120, 60, 120, 120, 10, 60, 30, 0],
  structuredSchema: {
    kind: "array",
    items: {
      type: "integer",
      label: "Timeout (s)",
      defaultValue: 0,
    },
  },
  transform: {
    toUi: (v) => v.split(" ").map(Number),
    fromUi: (v) => v.join(" "),
  },
};

export const ct_timeout: NvramProperty<[number, number]> = {
  key: "ct_timeout",
  description: "Space-separated timeouts for Generic and ICMP connections.",
  page: "advanced-ctnf.asp",
  type: "structured-string",
  defaultValue: [600, 30],
  structuredSchema: {
    kind: "array",
    items: {
      type: "integer",
      label: "Timeout (s)",
      defaultValue: 0,
    },
  },
  transform: {
    toUi: (v) => v.split(" ").map(Number) as [number, number],
    fromUi: (v) => v.join(" "),
  },
};

export const ct_udp_timeout: NvramProperty<[number, number]> = {
  key: "ct_udp_timeout",
  description:
    "Space-separated timeouts for Unreplied and Assured UDP connections.",
  page: "advanced-ctnf.asp",
  type: "structured-string",
  defaultValue: [30, 180],
  structuredSchema: {
    kind: "array",
    items: {
      type: "integer",
      label: "Timeout (s)",
      defaultValue: 0,
    },
  },
  transform: {
    toUi: (v) => v.split(" ").map(Number) as [number, number],
    fromUi: (v) => v.join(" "),
  },
};

export const ctf_disable: NvramProperty<boolean> = {
  key: "ctf_disable",
  description:
    "Controls CTF (Cut-Through Forwarding) and hardware acceleration. A value of '0' means CTF is enabled, '1' means disabled. Disabling is required for QoS and BW Limiter.",
  page: "advanced-misc.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v !== "1", // UI checkbox is for *enabling* CTF.
    fromUi: (v) => (v ? "0" : "1"),
  },
  ui: {
    label: "CTF (Cut-Through Forwarding) and HW acceleration",
  },
};

// --- DDNS Client (basic-ddns.asp) ---

export const ddnsx_custom_if: NvramProperty<string> = {
  key: "ddnsx_custom_if",
  description:
    "Custom interface name to use for IP address checking when no WAN is active and the IP source is an external checker.",
  page: "basic-ddns.asp",
  type: "string",
  defaultValue: "",
  validation: (value) =>
    value === "" ||
    /^[a-z0-9.]{2,6}$/.test(value) ||
    "Invalid interface name. Allowed characters: a-z, 0-9, . (2-6 chars).",
  ui: {
    label: "interface",
    state: {
      dependsOn: ["ddnsx{index}", "ddnsx{index}_ip", "wan_proto"], // Simplified dependency
      evaluator: (values) => {
        const clientEnabled = values["ddnsx{index}"] !== "<"; // Check if client is configured
        const useExternalChecker = values["ddnsx{index}_ip"]?.includes("@");
        const noWanActive = values["wan_proto"] === "disabled"; // Simplified check
        return clientEnabled && useExternalChecker && noWanActive
          ? "visible"
          : "hidden";
      },
    },
  },
};

const ddnsSubProperty = <T>(
  prop: string,
  desc: string,
  type: "string" | "number" | "boolean",
  defaultValue: T,
  validation?: Validator<T>,
): PatternedNvramProperty<{ index: 0 | 1 | 2 | 3 }, T> => ({
  getKey: (params) => `ddnsx${params.index}_${prop}`,
  regex: new RegExp(`^ddnsx([0-3])_${prop}$`),
  parameters: {
    index: { type: "integer", description: "DDNS client index", range: [0, 3] },
  },
  description: desc,
  page: "basic-ddns.asp",
  type: type as any,
  defaultValue,
  validation,
  transform:
    type === "boolean"
      ? ({
          toUi: (v: string) => v === "1",
          fromUi: (v: boolean) => (v ? "1" : "0"),
        } as any)
      : undefined,
});

export const ddnsx_cktime: PatternedNvramProperty<
  { index: 0 | 1 | 2 | 3 },
  number
> = {
  getKey: (params) => `ddnsx${params.index}_cktime`,
  regex: /^ddnsx([0-3])_cktime$/,
  parameters: {
    index: { type: "integer", description: "DDNS client index", range: [0, 3] },
  },
  description: "Check interval in minutes for external IP checkers.",
  page: "basic-ddns.asp",
  type: "integer",
  defaultValue: 10,
  validation: (v) => (v >= 5 && v <= 99999) || "Valid range: 5-99999 minutes.",
  ui: {
    label: "every:",
    state: {
      dependsOn: ["ddnsx{index}_ip"],
      evaluator: (values) =>
        values["ddnsx{index}_ip"]?.includes("@") ? "visible" : "hidden",
    },
  },
};
export const ddnsx_opendns = ddnsSubProperty(
  "opendns",
  "Bitmask indicating on which WANs to apply OpenDNS settings for this client.",
  "number",
  0,
);
export const ddnsx_refresh = ddnsSubProperty(
  "refresh",
  "Auto-refresh interval in days for the DDNS entry. 0 disables.",
  "number",
  28,
  (v) => (v >= 0 && v <= 90) || "Valid range: 0-90 days.",
);
export const ddnsx_save = ddnsSubProperty(
  "save",
  "Save state to NVRAM when the IP address changes.",
  "boolean",
  true,
);

// --- Debugging (admin-debug.asp) ---

export const debug_cprintf: NvramProperty<boolean> = {
  key: "debug_cprintf",
  description:
    "Redirects cprintf output to the console, making it visible in the browser.",
  page: "admin-debug.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v !== "0", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Enable cprintf output to console",
  },
};

export const debug_cprintf_file: NvramProperty<boolean> = {
  key: "debug_cprintf_file",
  description: "Redirects cprintf output to the file /tmp/cprintf for viewing.",
  page: "admin-debug.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v !== "0", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Enable cprintf output to /tmp/cprintf",
  },
};

export const debug_ddns: NvramProperty<boolean> = {
  key: "debug_ddns",
  description:
    "Enables DDNS debug output to files in /tmp/mdu-*, where * is the provider name.",
  page: "admin-debug.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v !== "0", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Enable DDNS output to /tmp/mdu-*",
  },
};

export const debug_logsegfault: NvramProperty<boolean> = {
  key: "debug_logsegfault",
  description:
    "If enabled, logs extensive messages when a program crashes due to a segmentation fault.",
  page: "admin-debug.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v !== "0", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Enable segfault logging",
  },
};

export const debug_nocommit: NvramProperty<boolean> = {
  key: "debug_nocommit",
  description:
    "Prevents configuration changes from being permanently saved to NVRAM. For debugging purposes only.",
  page: "admin-debug.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v !== "0", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Avoid performing an NVRAM commit",
  },
};

type NoRestartService = "crond" | "hotplug2" | "igmprt" | "ntpd";

export const debug_norestart: NvramProperty<NoRestartService[]> = {
  key: "debug_norestart",
  description:
    "A comma-separated list of processes that should not be automatically restarted if they die.",
  page: "admin-debug.asp",
  type: "list",
  defaultValue: [],
  transform: {
    toUi: (v) => (v ? (v.split(",") as NoRestartService[]) : []),
    fromUi: (v) => v.join(","),
  },
  ui: {
    label: "Do not restart the following process if they die",
  },
};

export const debug_wlx_shdown: NvramProperty<string> = {
  key: "debug_wlx_shdown",
  description:
    "An internal or legacy setting related to wireless shutdown. Not exposed in the UI.",
  page: "admin-debug.asp",
  type: "string",
  defaultValue: "",
};

/**
 * Represents a single choice in an enum-style setting.
 */
interface NvramOption<T extends string | number> {
  value: T;
  label: string;
}

// --- Helper Functions for Validation ---
const v_range = (value: number, min: number, max: number) =>
  (value >= min && value <= max) || `Value must be between ${min} and ${max}.`;
const v_ip = (value: string) =>
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    value,
  ) || "Invalid IP address format.";
const v_netmask = (value: string) => {
  const parts = value.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255))
    return "Invalid netmask format.";
  const binStr = parts.map((p) => p.toString(2).padStart(8, "0")).join("");
  return /^1*0*$/.test(binStr) || "Invalid netmask value.";
};
const v_length = (value: string, min: number, max: number) =>
  (value.length >= min && value.length <= max) ||
  `Length must be between ${min} and ${max} characters.`;

export const dhcp_lease: PatternedNvramProperty<
  { index: "" | "1" | "2" | "3" },
  number
> = {
  getKey: (params) => `dhcp${params.index}_lease`,
  regex: /^dhcp([1-3]?)_lease$/,
  parameters: {
    index: { type: "string", description: "LAN bridge index (empty for br0)" },
  },
  description:
    "Specifies the DHCP lease time in minutes for a specific LAN bridge.",
  page: "basic-network.asp",
  type: "integer",
  defaultValue: 1440,
  validation: (value) => v_range(value, 1, 10080),
  ui: {
    label: "Lease Time (mins)",
  },
};

export const dhcp_moveip: NvramProperty<"0" | "1" | "2"> = {
  key: "dhcp_moveip",
  description:
    "Internal transient flag used by the UI to signal the backend on how to handle service restarts after a LAN IP address change. Not a persistent user setting.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "0",
};

export const dhcpc_121: NvramProperty<boolean> = {
  key: "dhcpc_121",
  description:
    "Allows the WAN DHCP client to accept classless static routes (option 121) from the ISP.",
  page: "advanced-routing.asp",
  type: "boolean",
  defaultValue: true,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Accept DHCP Classless Routes (option 121)",
  },
};

export const dhcpc_33: NvramProperty<boolean> = {
  key: "dhcpc_33",
  description:
    "Allows the WAN DHCP client to accept static routes (option 33) from the ISP.",
  page: "advanced-routing.asp",
  type: "boolean",
  defaultValue: true,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Accept DHCP Static Route (option 33)",
  },
};

export const dhcpc_custom: NvramProperty<string> = {
  key: "dhcpc_custom",
  description:
    "Specifies extra command-line options for the WAN DHCP client (udhcpc).",
  page: "advanced-dhcpdns.asp",
  type: "string",
  defaultValue: "",
  validation: (value) => v_length(value, 0, 256),
  ui: {
    label: "DHCPC Options",
  },
};

export const dhcpc_minpkt: NvramProperty<boolean> = {
  key: "dhcpc_minpkt",
  description:
    "Instructs the DHCP client to use a smaller packet size, which may be required by some ISPs.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: true,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Reduce packet size",
  },
};

export const dhcpd_dmdns: NvramProperty<boolean> = {
  key: "dhcpd_dmdns",
  description: "Enables dnsmasq to act as the DNS server for the LAN.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: true,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Use internal DNS",
  },
};

export const dhcpd_endip: PatternedNvramProperty<
  { index: "" | "1" | "2" | "3" },
  string
> = {
  getKey: (params) => `dhcpd${params.index}_endip`,
  regex: /^dhcpd([1-3]?)_endip$/,
  parameters: {
    index: { type: "string", description: "LAN bridge index (empty for br0)" },
  },
  description:
    "The last IP address in the DHCP pool for a specific LAN bridge.",
  page: "basic-network.asp",
  type: "ip",
  validation: (value, allValues) => v_ip(value),
  ui: {
    label: "IP Range (last)",
  },
};

export const dhcpd_gwmode: NvramProperty<boolean> = {
  key: "dhcpd_gwmode",
  description:
    "Instructs the DHCP server to use the router's IP as the default gateway for clients if the WAN is disabled.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Use user-entered gateway if WAN is disabled",
  },
};

export const dhcpd_lmax: NvramProperty<number> = {
  key: "dhcpd_lmax",
  description: "Maximum number of active DHCP leases allowed.",
  page: "advanced-dhcpdns.asp",
  type: "integer",
  defaultValue: 255,
  validation: (value) => v_range(value, 1, 0xffff),
  ui: {
    label: "Maximum active DHCP leases",
  },
};

export const dhcpd_ostatic: PatternedNvramProperty<
  { index: "" | "1" | "2" | "3" },
  boolean
> = {
  getKey: (params) => `dhcpd${params.index}_ostatic`,
  regex: /^dhcpd([1-3]?)_ostatic$/,
  parameters: {
    index: { type: "string", description: "LAN bridge index (empty for br0)" },
  },
  description:
    "If enabled, dnsmasq will ignore DHCP requests from devices with MAC addresses not listed in the static DHCP/ARP table.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Ignore DHCP requests from unknown devices",
    state: {
      dependsOn: ["lan{index}_ifname"],
      evaluator: (values) =>
        values["lan{index}_ifname"] ? "enabled" : "disabled",
    },
  },
};

export const dhcpd_slt: NvramProperty<number> = {
  key: "dhcpd_slt",
  description:
    "Sets the lease time for static DHCP reservations. Can be '0' (same as normal), '-1' (infinite), or a custom value in minutes.",
  page: "basic-static.asp",
  type: "integer",
  defaultValue: 0,
  validation: (value) =>
    value === 0 ||
    value === -1 ||
    (value >= 1 && value <= 43200) ||
    "Invalid static lease time. Must be 0, -1, or 1-43200.",
  ui: {
    label: "Static lease time",
  },
};

export const dhcpd_startip: PatternedNvramProperty<
  { index: "" | "1" | "2" | "3" },
  string
> = {
  getKey: (params) => `dhcpd${params.index}_startip`,
  regex: /^dhcpd([1-3]?)_startip$/,
  parameters: {
    index: { type: "string", description: "LAN bridge index (empty for br0)" },
  },
  description:
    "The first IP address in the DHCP pool for a specific LAN bridge.",
  page: "basic-network.asp",
  type: "ip",
  validation: (value, allValues) => v_ip(value),
  ui: {
    label: "IP Range (first)",
  },
};

interface DhcpReservation {
  macs: string[];
  ip: string;
  hostname: string;
  arp_bind: boolean;
}

export const dhcpd_static: NvramProperty<DhcpReservation[]> = {
  key: "dhcpd_static",
  description:
    "A composite string containing all DHCP reservations and static ARP bindings. Each entry is delimited by '>'.",
  page: "basic-static.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        macs: {
          type: "string",
          label: "MAC Addresses (comma-separated)",
          defaultValue: "",
        },
        ip: { type: "string", label: "IP Address", defaultValue: "" },
        hostname: { type: "string", label: "Hostname", defaultValue: "" },
        arp_bind: {
          type: "boolean",
          label: "Static ARP Binding",
          defaultValue: false,
        },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((entry) => {
          const parts = entry.split("<");
          if (parts.length !== 4) return null;
          return {
            macs: parts[0]!.split(","),
            ip: parts[1],
            hostname: parts[2],
            arp_bind: parts[3] === "1",
          };
        })
        .filter((v): v is DhcpReservation => v !== null),
    fromUi: (value) =>
      value
        .map(
          (r) =>
            `${r.macs.join(",")}<${r.ip}<${r.hostname}<${
              r.arp_bind ? "1" : "0"
            }`,
        )
        .join(">"),
  },
  ui: {
    label: "DHCP Reservation",
  },
};

export const dmz_enable: NvramProperty<boolean> = {
  key: "dmz_enable",
  description:
    "Enables or disables the Demilitarized Zone (DMZ), which forwards all incoming WAN traffic to a single specified LAN IP address.",
  page: "forward-dmz.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Enable DMZ",
  },
};

export const dmz_ipaddr: NvramProperty<string> = {
  key: "dmz_ipaddr",
  description:
    "The IP address of the LAN device to which all WAN traffic will be forwarded when DMZ is enabled.",
  page: "forward-dmz.asp",
  type: "ip",
  defaultValue: "0",
  validation: (value, allValues) => {
    if (allValues["dmz_enable"] !== "1") return true;
    if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value))
      return "Invalid IP address.";
    // The UI performs a check to ensure the IP is within a configured LAN subnet, which would be complex to replicate here without full LAN config.
    return true;
  },
  ui: {
    label: "Destination Address",
  },
};

export const dmz_ra: NvramProperty<boolean> = {
  key: "dmz_ra",
  description:
    "If enabled, remote access ports (like SSH and web admin) configured on the router are not forwarded to the DMZ host.",
  page: "forward-dmz.asp",
  type: "boolean",
  defaultValue: true,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Keep remote-access on the router",
  },
};

export const dmz_sip: NvramProperty<string> = {
  key: "dmz_sip",
  description:
    "Restricts DMZ access to a specific list of source IP addresses or ranges from the WAN.",
  page: "forward-dmz.asp",
  type: "list",
  defaultValue: "",
  ui: {
    label: "Source Address Restriction",
  },
};

export const dns_fwd_local: NvramProperty<boolean> = {
  key: "dns_fwd_local",
  description:
    "If enabled, DNS queries for the local domain (defined in Basic > Identification) are forwarded to the upstream DNS servers.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Forward local domain queries to upstream DNS",
  },
};

export const dns_intcpt: NvramProperty<boolean> = {
  key: "dns_intcpt",
  description:
    "Enables DNS interception (transparent DNS proxy), redirecting all client DNS requests on TCP/UDP port 53 to the router's internal DNS server.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Intercept DNS port",
  },
};

export const dns_norebind: NvramProperty<boolean> = {
  key: "dns_norebind",
  description:
    "Enables DNS rebind protection, preventing upstream DNS servers from resolving queries to non-routable IP addresses (e.g., 192.168.x.x).",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: true,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Enable DNS Rebind protection",
    state: {
      dependsOn: ["dnsmasq_onion_support"],
      evaluator: (values) =>
        values["dnsmasq_onion_support"] === "1" ? "disabled" : "enabled",
    },
  },
};

export const dns_priv_override: NvramProperty<boolean> = {
  key: "dns_priv_override",
  description:
    "Attempts to prevent clients from automatically using DNS-over-HTTPS (DoH), forcing them to use the router's configured DNS servers.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Prevent client auto DoH",
  },
};

export const dnscrypt_ephemeral_keys: NvramProperty<boolean> = {
  key: "dnscrypt_ephemeral_keys",
  description:
    "Generates a new key pair for every DNS query when using dnscrypt-proxy. This enhances privacy but increases CPU load.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Ephemeral Keys",
    state: {
      dependsOn: ["dnscrypt_proxy"],
      evaluator: (values) =>
        values["dnscrypt_proxy"] === "1" ? "visible" : "hidden",
    },
  },
};

export const dnscrypt_log: NvramProperty<string> = {
  key: "dnscrypt_log",
  description: "Sets the logging level for the dnscrypt-proxy service.",
  page: "advanced-dhcpdns.asp",
  type: "string", // Although it's a number, it's treated as text in the UI
  defaultValue: "6",
  ui: {
    label: "Log Level",
  },
};

export const dnscrypt_manual: NvramProperty<boolean> = {
  key: "dnscrypt_manual",
  description:
    "Switches dnscrypt-proxy configuration from a predefined resolver to manual entry.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Manual Entry",
    state: {
      dependsOn: ["dnscrypt_proxy"],
      evaluator: (values) =>
        values["dnscrypt_proxy"] === "1" ? "visible" : "hidden",
    },
  },
};

export const dnscrypt_port: NvramProperty<number> = {
  key: "dnscrypt_port",
  description:
    "The local port on which dnscrypt-proxy listens for DNS queries from dnsmasq.",
  page: "advanced-dhcpdns.asp",
  type: "integer",
  defaultValue: 40,
  validation: (value) => v_range(value, 1, 65535),
  ui: {
    label: "Local Port",
  },
};

export const dnscrypt_priority: NvramProperty<"0" | "1" | "2"> = {
  key: "dnscrypt_priority",
  description:
    "Determines how dnscrypt-proxy interacts with other DNS servers. 'No-Resolv' forces all traffic through dnscrypt-proxy.",
  page: "advanced-dhcpdns.asp",
  type: "enum",
  defaultValue: "2",
  ui: {
    label: "Priority",
    options: [
      { value: "2", label: "No-Resolv*" },
      { value: "1", label: "Strict-Order" },
      { value: "0", label: "None" },
    ],
  },
};

export const dnscrypt_provider_key: NvramProperty<string> = {
  key: "dnscrypt_provider_key",
  description: "The public key of the manually configured DNSCrypt resolver.",
  page: "advanced-dhcpdns.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Provider Public Key",
    state: {
      dependsOn: ["dnscrypt_proxy", "dnscrypt_manual"],
      evaluator: (values) =>
        values["dnscrypt_proxy"] === "1" && values["dnscrypt_manual"] === "1"
          ? "visible"
          : "hidden",
    },
  },
};

export const dnscrypt_provider_name: NvramProperty<string> = {
  key: "dnscrypt_provider_name",
  description: "The name of the manually configured DNSCrypt provider.",
  page: "advanced-dhcpdns.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Provider Name",
    state: {
      dependsOn: ["dnscrypt_proxy", "dnscrypt_manual"],
      evaluator: (values) =>
        values["dnscrypt_proxy"] === "1" && values["dnscrypt_manual"] === "1"
          ? "visible"
          : "hidden",
    },
  },
};

export const dnscrypt_proxy: NvramProperty<boolean> = {
  key: "dnscrypt_proxy",
  description: "Master switch to enable or disable the dnscrypt-proxy service.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Use dnscrypt-proxy",
  },
};

export const dnscrypt_resolver: NvramProperty<string> = {
  key: "dnscrypt_resolver",
  description: "The selected predefined DNSCrypt resolver.",
  page: "advanced-dhcpdns.asp",
  type: "enum",
  defaultValue: "opendns",
  ui: {
    label: "Resolver",
    state: {
      dependsOn: ["dnscrypt_proxy", "dnscrypt_manual"],
      evaluator: (values) =>
        values["dnscrypt_proxy"] === "1" && values["dnscrypt_manual"] !== "1"
          ? "visible"
          : "hidden",
    },
    // Note: options are dynamically populated in the UI
  },
};

export const dnscrypt_resolver_address: NvramProperty<string> = {
  key: "dnscrypt_resolver_address",
  description:
    "The IP address and port of the manually configured DNSCrypt resolver.",
  page: "advanced-dhcpdns.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Resolver Address",
    state: {
      dependsOn: ["dnscrypt_proxy", "dnscrypt_manual"],
      evaluator: (values) =>
        values["dnscrypt_proxy"] === "1" && values["dnscrypt_manual"] === "1"
          ? "visible"
          : "hidden",
    },
  },
};

export const dnsmasq_custom: NvramProperty<string> = {
  key: "dnsmasq_custom",
  description:
    "Custom configuration options appended to the dnsmasq configuration file.",
  page: "advanced-dhcpdns.asp",
  type: "multiline-string",

  validation: (value) =>
    value.length <= 4096 || "Maximum length is 4096 characters.",
  ui: {
    label: "Dnsmasq Custom configuration",
  },
};

export const dnsmasq_debug: NvramProperty<boolean> = {
  key: "dnsmasq_debug",
  description:
    "Enables debug mode for dnsmasq, providing more verbose logging.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Debug Mode",
  },
};

export const dnsmasq_edns_size: NvramProperty<number> = {
  key: "dnsmasq_edns_size",
  description: "Sets the advertised EDNS packet size for DNS queries.",
  page: "advanced-dhcpdns.asp",
  type: "integer",
  defaultValue: 1232,
  validation: (value) => v_range(value, 512, 4096),
  ui: {
    label: "EDNS packet size",
  },
};

export const dnsmasq_gen_names: NvramProperty<boolean> = {
  key: "dnsmasq_gen_names",
  description:
    "Automatically generates a hostname for DHCP clients that do not provide one.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Generate a name for DHCP clients which do not otherwise have one",
  },
};

export const dnsmasq_onion_support: NvramProperty<boolean> = {
  key: "dnsmasq_onion_support",
  description:
    "Enables resolving of .onion addresses via the Tor network (if Tor is enabled).",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Resolve .onion using Tor",
  },
};

export const dnsmasq_pxelan: PatternedNvramProperty<
  { index: 0 | 1 | 2 | 3 },
  boolean
> = {
  getKey: (params) => `dnsmasq_pxelan${params.index}`,
  regex: /^dnsmasq_pxelan([0-3])$/,
  parameters: {
    index: { type: "integer", description: "LAN bridge index" },
  },
  description:
    "Enables PXE boot support on the specified LAN bridge when the TFTP server is active.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "PXE on LAN{index} (br{index})",
    state: {
      dependsOn: ["dnsmasq_tftp", "lan{index}_ifname"],
      evaluator: (values) =>
        values["dnsmasq_tftp"] === "1" && values["lan{index}_ifname"]
          ? "enabled"
          : "disabled",
    },
  },
};

export const dnsmasq_q: NvramProperty<number> = {
  key: "dnsmasq_q",
  description:
    "A bitmask to control dnsmasq logging verbosity. 1=mute dhcpv4, 2=mute dhcpv6, 4=mute RA.",
  page: "advanced-dhcpdns.asp",
  type: "integer",
  defaultValue: 0,
};

export const dnsmasq_safe: NvramProperty<boolean> = {
  key: "dnsmasq_safe",
  description:
    "An internal flag that, if set, prevents the 'dnsmasq_custom' configuration from being loaded to allow dnsmasq to start even with a syntax error in the custom config.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
};

export const dnsmasq_tftp: NvramProperty<boolean> = {
  key: "dnsmasq_tftp",
  description: "Enables the built-in TFTP server in dnsmasq.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Enable TFTP",
  },
};

export const dnsmasq_tftp_path: NvramProperty<string> = {
  key: "dnsmasq_tftp_path",
  description: "The root directory for the TFTP server.",
  page: "advanced-dhcpdns.asp",
  type: "string",
  defaultValue: "",
  validation: (value) => v_length(value, 0, 128),
  ui: {
    label: "TFTP root path",
  },
};

export const dnssec_enable: NvramProperty<boolean> = {
  key: "dnssec_enable",
  description: "Enables DNSSEC validation for DNS queries.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Enable DNSSEC support",
  },
};

export const dnssec_method: NvramProperty<0 | 1 | 2> = {
  key: "dnssec_method",
  description:
    "Selects the method for DNSSEC validation. '0' for dnsmasq, '1' for Stubby, '2' for server-only.",
  page: "advanced-dhcpdns.asp",
  type: "enum",
  defaultValue: 0,
  ui: {
    label: "DNSSEC validation method",
    options: [
      { value: 0, label: "Dnsmasq" },
      { value: 1, label: "Stubby" },
      { value: 2, label: "Server Only" },
    ],
    state: {
      dependsOn: ["dnssec_enable"],
      evaluator: (values) =>
        values["dnssec_enable"] === "1" ? "visible" : "hidden",
    },
  },
};

export const DSCP_fix_enable: NvramProperty<boolean> = {
  key: "DSCP_fix_enable",
  description:
    "Enables a fix for incorrect DSCP markings, often an issue with Comcast ISPs.",
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Enable DSCP Fix",
  },
};

export const emf_enable: NvramProperty<boolean> = {
  key: "emf_enable",
  description:
    "Enables Efficient Multicast Forwarding (IGMP Snooping) to optimize multicast traffic on the LAN.",
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Efficient Multicast Forwarding (IGMP Snooping)",
  },
};

export const force_igmpv2: NvramProperty<boolean> = {
  key: "force_igmpv2",
  description:
    "Forces the use of IGMP version 2 for multicast group management.",
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Force IGMPv2",
  },
};

export const ftp_anonrate: NvramProperty<number> = {
  key: "ftp_anonrate",
  description:
    "Maximum bandwidth in KBytes/sec for anonymous FTP users. 0 means unlimited.",
  page: "nas-ftp.asp",
  type: "integer",
  validation: (value) => v_range(value, 0, 99999),
  ui: {
    label: "Maximum Bandwidth for Anonymous Users",
  },
};

export const ftp_anonroot: NvramProperty<string> = {
  key: "ftp_anonroot",
  description:
    "The root directory for anonymous FTP connections. Defaults to /mnt if not specified.",
  page: "nas-ftp.asp",
  type: "string",
  validation: (value) =>
    value === "" ||
    value.startsWith("/") ||
    "Value must be empty or start with /",
  ui: {
    label: "Anonymous Root Directory*",
  },
};

export const ftp_anonymous: NvramProperty<"0" | "1" | "2" | "3"> = {
  key: "ftp_anonymous",
  description: "Controls access level for anonymous FTP users.",
  page: "nas-ftp.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Anonymous Users Access",
    options: [
      { value: "0", label: "Disabled" },
      { value: "1", label: "Read/Write" },
      { value: "2", label: "Read Only" },
      { value: "3", label: "Write Only" },
    ],
  },
};

export const ftp_custom: NvramProperty<string> = {
  key: "ftp_custom",
  description: "Custom configuration options for the vsftpd server.",
  page: "nas-ftp.asp",
  type: "string",
  defaultValue: "",
  validation: (value) => v_length(value, 0, 2048),
  ui: {
    label: "Vsftpd Custom Configuration",
  },
};

export const ftp_dirlist: NvramProperty<"0" | "1" | "2"> = {
  key: "ftp_dirlist",
  description: "Controls whether directory listings are allowed for FTP users.",
  page: "nas-ftp.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Directory Listings",
    options: [
      { value: "0", label: "Enabled" },
      { value: "1", label: "Disabled" },
      { value: "2", label: "Disabled for Anonymous" },
    ],
  },
};

export const ftp_enable: NvramProperty<"0" | "1" | "2"> = {
  key: "ftp_enable",
  description: "Controls the FTP server's startup behavior and accessibility.",
  page: "nas-ftp.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Enable on Start",
    options: [
      { value: "0", label: "No" },
      { value: "1", label: "Yes, WAN and LAN" },
      { value: "2", label: "Yes, LAN only" },
    ],
  },
};

export const ftp_ipmax: NvramProperty<number> = {
  key: "ftp_ipmax",
  description:
    "Maximum number of connections allowed from a single IP address. 0 means unlimited.",
  page: "nas-ftp.asp",
  type: "integer",
  validation: (value) => v_range(value, 0, 12),
  ui: {
    label: "Maximum Connections from the same IP",
  },
};

interface FtpLimit {
  enabled: boolean;
  hits: number;
  seconds: number;
}
export const ftp_limit: NvramProperty<FtpLimit> = {
  key: "ftp_limit",
  description:
    "Configures rate limiting for FTP connection attempts to mitigate brute-force attacks.",
  page: "nas-ftp.asp",
  type: "structured-string",
  defaultValue: { enabled: false, hits: 3, seconds: 60 },
  structuredSchema: {
    kind: "object",
    fields: {
      enabled: { type: "boolean", label: "Enabled", defaultValue: false },
      hits: { type: "integer", label: "Hits", defaultValue: 3 },
      seconds: { type: "integer", label: "Seconds", defaultValue: 60 },
    },
  },
  transform: {
    toUi: (value) => {
      const parts = value.split(",");
      return {
        enabled: parts[0] === "1",
        hits: parseInt(parts[1] || "3", 10),
        seconds: parseInt(parts[2] || "60", 10),
      };
    },
    fromUi: (value) =>
      `${value.enabled ? "1" : "0"},${value.hits},${value.seconds}`,
  },
  ui: {
    label: "Limit Connection Attempts",
  },
};

export const ftp_max: NvramProperty<number> = {
  key: "ftp_max",
  description:
    "Maximum number of simultaneous FTP users allowed. 0 means unlimited.",
  page: "nas-ftp.asp",
  type: "integer",
  validation: (value) => v_range(value, 0, 12),
  ui: {
    label: "Maximum Users Allowed to Log in",
  },
};

export const ftp_port: NvramProperty<number> = {
  key: "ftp_port",
  description: "The TCP port on which the FTP server listens.",
  page: "nas-ftp.asp",
  type: "integer",
  defaultValue: 21,
  validation: (value) => v_range(value, 1, 65535),
  ui: {
    label: "FTP Port",
  },
};

export const ftp_pubroot: NvramProperty<string> = {
  key: "ftp_pubroot",
  description:
    "The default root directory for authenticated users if a specific one is not defined for them. Defaults to /mnt.",
  page: "nas-ftp.asp",
  type: "string",
  validation: (value) =>
    value === "" ||
    value.startsWith("/") ||
    "Value must be empty or start with /",
  ui: {
    label: "Public Root Directory*",
  },
};

export const ftp_pvtroot: NvramProperty<string> = {
  key: "ftp_pvtroot",
  description:
    "The base directory for 'private' user access. Each private user will be chrooted to a subdirectory named after their username inside this path.",
  page: "nas-ftp.asp",
  type: "string",
  validation: (value) =>
    value === "" ||
    value.startsWith("/") ||
    "Value must be empty or start with /",
  ui: {
    label: "Private Root Directory**",
  },
};

export const ftp_rate: NvramProperty<number> = {
  key: "ftp_rate",
  description:
    "Maximum bandwidth in KBytes/sec for authenticated FTP users. 0 means unlimited.",
  page: "nas-ftp.asp",
  type: "integer",
  validation: (value) => v_range(value, 0, 99999),
  ui: {
    label: "Maximum Bandwidth for Authenticated Users",
  },
};

export const ftp_sip: NvramProperty<string> = {
  key: "ftp_sip",
  description:
    "Restricts FTP access from the WAN to a specific list of source IP addresses or ranges.",
  page: "nas-ftp.asp",
  type: "list",
  defaultValue: "",
  ui: {
    label: "Allowed Remote Address(es)",
  },
};

export const ftp_staytimeout: NvramProperty<number> = {
  key: "ftp_staytimeout",
  description:
    "The idle timeout in seconds for FTP connections. 0 means no timeout.",
  page: "nas-ftp.asp",
  type: "integer",
  validation: (value) => v_range(value, 0, 65535),
  ui: {
    label: "Idle Timeout",
  },
};

export const ftp_super: NvramProperty<boolean> = {
  key: "ftp_super",
  description:
    "Allows the router's admin/root user to log in via FTP, providing full filesystem access. This is a security risk if exposed to the WAN.",
  page: "nas-ftp.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Allow Admin Login*",
  },
};

export const ftp_tls: NvramProperty<boolean> = {
  key: "ftp_tls",
  description:
    "Enables FTP over TLS (FTPS) for secure connections, using the router's web server certificate.",
  page: "nas-ftp.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "TLS support",
  },
};

interface FtpUser {
  username: string;
  password_hash: string; // The UI doesn't expose the raw password, so we assume it's stored hashed or at least not shown.
  access: "Read/Write" | "Read Only" | "View Only" | "Private";
  root_dir: string;
}
export const ftp_users: NvramProperty<FtpUser[]> = {
  key: "ftp_users",
  description:
    "List of user accounts for the FTP server, stored in a composite string format.",
  page: "nas-ftp.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        username: { type: "string", label: "Username", defaultValue: "" },
        password_hash: {
          type: "string",
          label: "Password Hash",
          defaultValue: "",
          optional: true,
        },
        access: {
          type: "string",
          label: "Access Level",
          defaultValue: "Read/Write",
        },
        root_dir: {
          type: "string",
          label: "Root Directory",
          defaultValue: "",
        },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((entry) => {
          const parts = entry.split("<");
          return {
            username: parts[0] || "",
            password_hash: parts[1] || "",
            access: parts[2] as FtpUser["access"],
            root_dir: parts[3] || "",
          };
        }),
    fromUi: (value) =>
      value
        .map(
          (u) => `${u.username}<${u.password_hash}<${u.access}<${u.root_dir}`,
        )
        .join(">"),
  },
  ui: {
    label: "User Accounts",
  },
};

export const fw_blackhole: NvramProperty<boolean> = {
  key: "fw_blackhole",
  description: "Enables smart Path MTU Discovery black hole detection.",
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: true,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Smart MTU black hole detection",
  },
};

export const fw_nat_tuning: NvramProperty<"0" | "1" | "2"> = {
  key: "fw_nat_tuning",
  description:
    "Adjusts TCP/UDP buffer sizes. 0=Small (default), 1=Medium, 2=Large.",
  page: "advanced-ctnf.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "TCP/UDP Buffers",
    options: [
      { value: "0", label: "Small (default)" },
      { value: "1", label: "Medium" },
      { value: "2", label: "Large" },
    ],
  },
};

export const gro_disable: NvramProperty<boolean> = {
  key: "gro_disable",
  description:
    "Disables Generic Receive Offload (GRO) for the network stack. Disabling it may be necessary for Samba to work correctly.",
  page: "nas-samba.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Disable GRO",
    state: {
      dependsOn: ["smbd_enable"],
      evaluator: (values) =>
        values["smbd_enable"] === "0"
          ? "disabled" // UI sets it to checked and disabled
          : "enabled",
    },
  },
};

export const http_enable: NvramProperty<boolean> = {
  key: "http_enable",
  description:
    "Enables local HTTP access to the router's web interface. The UI combines this with `https_enable` into a single 'Local Access' dropdown.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
};

export const http_id: NvramProperty<string> = {
  key: "http_id",
  description:
    "A session security token (CSRF token) used to validate POST requests. This is a read-only, session-specific value generated at login.",
  page: "about.asp", // Appears on every page
  type: "string",
};

export const http_ipv6: NvramProperty<boolean> = {
  key: "http_ipv6",
  description:
    "Allows the router's web interface to listen for connections on IPv6 addresses.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Listen on IPv6",
    state: {
      dependsOn: ["http_enable", "https_enable", "ipv6_service"],
      evaluator: (values) =>
        (values.http_enable === "1" || values.https_enable === "1") &&
        values.ipv6_service !== ""
          ? "enabled"
          : "disabled",
    },
  },
};

export const http_lan_listeners: NvramProperty<number> = {
  key: "http_lan_listeners",
  description:
    "A bitmask controlling which LAN bridges (br0-br3) the web server listens on. Bit 0 for br0, bit 1 for br1, etc. UI shows separate checkboxes per LAN.",
  page: "admin-access.asp",
  type: "integer",
  defaultValue: 7,
};

export const http_lanport: NvramProperty<number> = {
  key: "http_lanport",
  description: "The TCP port for local HTTP access to the web interface.",
  page: "admin-access.asp",
  type: "integer",
  defaultValue: 80,
  validation: portValidator,
  ui: {
    label: "HTTP Port",
    state: {
      dependsOn: ["http_enable", "https_enable"],
      evaluator: (values) =>
        values.http_enable === "1" || values.https_enable === "1"
          ? "enabled"
          : "disabled",
    },
  },
};

export const http_nocache: NvramProperty<boolean> = {
  key: "http_nocache",
  description:
    "Adds 'no-cache' headers to HTTP responses for the web interface, telling browsers not to cache pages.",
  page: "admin-debug.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: 'Set "no-cache" in httpd header',
  },
};

export const http_username: NvramProperty<string> = {
  key: "http_username",
  description:
    "The username for logging into the web interface. Defaults to 'root' if empty.",
  page: "admin-access.asp",
  type: "string",
  defaultValue: "root",
  validation: (value) => v_length(value, 0, 20),
  ui: {
    label: "Username",
    suffix: '&nbsp;<small>empty field means "root"</small>',
  },
};

export const http_wanport: NvramProperty<number> = {
  key: "http_wanport",
  description:
    "The TCP port for remote (WAN) access to the web interface. Ports 80 and 443 are disallowed.",
  page: "admin-access.asp",
  type: "integer",
  defaultValue: 8080,
  validation: (value, allValues) => {
    const portVal = portValidator(value);
    if (portVal !== true) return portVal;
    if (value === 80 || value === 443)
      return "Ports 80 and 443 are not allowed for remote GUI access.";
    if (
      value === parseInt(allValues["http_lanport"] || "0", 10) ||
      value === parseInt(allValues["https_lanport"] || "0", 10)
    )
      return "Ports for local and remote GUI access cannot be the same.";
    return true;
  },
  ui: {
    label: "Port",
    state: {
      dependsOn: ["remote_management"],
      evaluator: (values) =>
        values.remote_management === "1" ? "visible" : "hidden",
    },
  },
};

export const http_wanport_bfm: NvramProperty<boolean> = {
  key: "http_wanport_bfm",
  description:
    "Enables a brute force mitigation rule in the firewall for the remote web access port.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: true,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Remote Web Port Protection",
  },
};

export const https_crt_cn: NvramProperty<string> = {
  key: "https_crt_cn",
  description:
    "Optional Common Name(s) to be embedded in the self-signed SSL certificate for HTTPS.",
  page: "admin-access.asp",
  type: "string",
  defaultValue: "",
  validation: (value) => v_length(value, 0, 64),
  ui: {
    label: "Common Name (CN)",
  },
};

export const https_crt_save: NvramProperty<boolean> = {
  key: "https_crt_save",
  description:
    "If enabled, the generated SSL certificate and key will be saved to NVRAM, persisting across reboots.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: false,
  transform: { toUi: (v) => v === "1", fromUi: (v) => (v ? "1" : "0") },
  ui: {
    label: "Save In NVRAM",
  },
};

export const https_enable: NvramProperty<boolean> = {
  key: "https_enable",
  description:
    "Enables local HTTPS access to the router's web interface. The UI combines this with `http_enable` into a single 'Local Access' dropdown.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
};

export const https_lanport: NvramProperty<number> = {
  key: "https_lanport",
  description: "The TCP port for local HTTPS access to the web interface.",
  page: "admin-access.asp",
  type: "integer",
  defaultValue: 443,
  validation: (value, allValues) => {
    const portVal = portValidator(value);
    if (portVal !== true) return portVal;
    if (value === parseInt(allValues["http_lanport"] || "0", 10))
      return "HTTP and HTTPS ports cannot be the same.";
    return true;
  },
  ui: {
    label: "HTTPS Port",
    state: {
      dependsOn: ["https_enable"],
      evaluator: (values) =>
        values.https_enable === "1" ? "enabled" : "disabled",
    },
  },
};

// --- NVRAM Catalog (Continuation) ---

export const idle_enable: NvramProperty<boolean> = {
  key: "idle_enable",
  description:
    "Enables spinning down each connected HDD when idle. Not necessary for flash drives.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "HDD Spindown",
    state: {
      dependsOn: ["usb_enable", "usb_storage"],
      evaluator: (values) =>
        values["usb_enable"] === "1" && values["usb_storage"] === "1"
          ? "enabled"
          : "disabled",
    },
  },
};

export const ipsec_pass: NvramProperty<"0" | "1" | "2" | "3"> = {
  key: "ipsec_pass",
  description:
    "Controls the passthrough of IPSec VPN traffic through the router's firewall.",
  page: "advanced-ctnf.asp",
  type: "enum",
  defaultValue: "1",
  ui: {
    label: "Enable IPSec Passthrough",
    options: [
      { value: "0", label: "Disabled" },
      { value: "1", label: "IPv4 & IPv6" },
      { value: "2", label: "IPv6 only" },
      { value: "3", label: "IPv4 only" },
    ],
  },
};

export const ipv6_6rd_borderrelay: NvramProperty<string> = {
  key: "ipv6_6rd_borderrelay",
  description: "The IPv4 address of the 6rd border relay provided by the ISP.",
  page: "basic-ipv6.asp",
  type: "ip",
  defaultValue: "68.113.165.1",
  ui: {
    label: "6RD Tunnel Border Relay (IPv4 Address)",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "6rd" || values["ipv6_service"] === "6rd-pd"
          ? "visible"
          : "hidden",
    },
  },
};

export const ipv6_6rd_ipv4masklen: NvramProperty<string> = {
  key: "ipv6_6rd_ipv4masklen",
  description:
    "The number of high-order bits of the ISP's IPv4 address that are identical across all 6rd CEs. Usually 0.",
  page: "basic-ipv6.asp",
  type: "string", // Stored as a string, but represents a number
  defaultValue: "0",
  ui: {
    label: "6RD IPv4 Mask Length",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "6rd" || values["ipv6_service"] === "6rd-pd"
          ? "visible"
          : "hidden",
    },
  },
};

export const ipv6_6rd_prefix: NvramProperty<string> = {
  key: "ipv6_6rd_prefix",
  description: "The IPv6 prefix assigned by the ISP for the 6rd tunnel.",
  page: "basic-ipv6.asp",
  type: "string", // IPv6 Prefix
  defaultValue: "2602:100::",
  ui: {
    label: "6rd Routed Prefix",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "6rd" || values["ipv6_service"] === "6rd-pd"
          ? "visible"
          : "hidden",
    },
  },
};

export const ipv6_6rd_prefix_length: NvramProperty<string> = {
  key: "ipv6_6rd_prefix_length",
  description: "The length of the ISP-assigned IPv6 prefix for the 6rd tunnel.",
  page: "basic-ipv6.asp",
  type: "string", // Stored as string, but represents a number
  defaultValue: "32",
  validation: (value) =>
    (parseInt(value, 10) >= 3 && parseInt(value, 10) <= 127) ||
    "Valid range: 3-127",
  ui: {
    label: "6rd Prefix Length",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "6rd" || values["ipv6_service"] === "6rd-pd"
          ? "visible"
          : "hidden",
    },
  },
};

export const ipv6_accept_ra: NvramProperty<number> = {
  key: "ipv6_accept_ra",
  description:
    "Bitmask controlling acceptance of IPv6 Router Advertisements. 1=WAN, 2=LAN.",
  page: "basic-ipv6.asp",
  type: "integer",
  defaultValue: 1,
  transform: {
    toUi: (v) => parseInt(v, 10) || 0,
    fromUi: (v) => v.toString(),
  },
  ui: {
    label: "Accept RA from",
  },
};

export const ipv6_debug: NvramProperty<boolean> = {
  key: "ipv6_debug",
  description: "Starts the DHCPv6 client in debug mode for troubleshooting.",
  page: "basic-ipv6.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Debug",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "native-pd" ? "visible" : "hidden",
    },
  },
};

export const ipv6_dhcpd: NvramProperty<boolean> = {
  key: "ipv6_dhcpd",
  description:
    "Enables the DHCPv6 server function on the LAN, allowing clients to obtain IPv6 addresses.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Announce IPv6 on LAN (DHCP)",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] !== "" ? "visible" : "hidden",
    },
  },
};

export const ipv6_dns: NvramProperty<string> = {
  key: "ipv6_dns",
  description: "A space-separated list of static IPv6 DNS servers.",
  page: "basic-ipv6.asp",
  type: "string",
  defaultValue: "2606:4700:4700::1111 2606:4700:4700::1001",
  ui: {
    label: "Static DNS",
  },
};

export const ipv6_dns_lan: NvramProperty<string> = {
  key: "ipv6_dns_lan",
  description:
    "A space-separated list of IPv6 DNS servers to be advertised to LAN clients via DHCPv6 or RA.",
  page: "advanced-dhcpdns.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "IPv6 DNS Server",
    state: {
      dependsOn: ["ipv6_service", "ipv6_radvd", "ipv6_dhcpd"],
      evaluator: (values) =>
        values["ipv6_service"] !== "" &&
        (values["ipv6_radvd"] === "1" || values["ipv6_dhcpd"] === "1")
          ? "enabled"
          : "disabled",
    },
  },
};

export const ipv6_duid_type: NvramProperty<"1" | "3"> = {
  key: "ipv6_duid_type",
  description:
    "Specifies the type of DHCP Unique Identifier (DUID) to use for the DHCPv6 client.",
  page: "basic-ipv6.asp",
  type: "enum",
  defaultValue: "3",
  ui: {
    label: "IPv6 DUID Type",
    options: [
      { value: "1", label: "DUID-LLT" },
      { value: "3", label: "DUID-LL (default)" },
    ],
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "native-pd" ? "visible" : "hidden",
    },
  },
};

export const ipv6_fast_ra: NvramProperty<boolean> = {
  key: "ipv6_fast_ra",
  description:
    "Forces dnsmasq to always be in frequent Router Advertisement (RA) mode.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Fast RA mode",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] !== "" ? "visible" : "hidden",
    },
  },
};

export const ipv6_ifname: NvramProperty<string> = {
  key: "ipv6_ifname",
  description:
    "Specifies the network interface name for the IPv6 tunnel (e.g., 'six0').",
  page: "basic-ipv6.asp",
  type: "string",
  defaultValue: "six0",
  validation: (value) =>
    value.length >= 2 || "Interface name must be at least 2 characters.",
  ui: {
    label: "IPv6 WAN Interface",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) => {
        const service = values["ipv6_service"];
        return service === "6to4" || service === "sit" ? "visible" : "hidden";
      },
    },
  },
};

export const ipv6_isp_gw: NvramProperty<string> = {
  key: "ipv6_isp_gw",
  description:
    "The gateway IPv6 address provided by the ISP for a static IPv6 connection.",
  page: "basic-ipv6.asp",
  type: "ip",
  defaultValue: "",
  ui: {
    label: "IPv6 WAN Gateway",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "native" ? "visible" : "hidden",
    },
  },
};

export const ipv6_isp_opt: NvramProperty<boolean> = {
  key: "ipv6_isp_opt",
  description:
    "Adds a default IPv6 route (::/0) via the WAN interface. A workaround for some ISPs.",
  page: "basic-ipv6.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Add default route ::/0",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) => {
        const service = values["ipv6_service"];
        return service === "native-pd" || service === "native"
          ? "visible"
          : "hidden";
      },
    },
  },
};

export const ipv6_lease_time: NvramProperty<string> = {
  key: "ipv6_lease_time",
  description:
    "The lease time in hours for DHCPv6 addresses assigned to LAN clients.",
  page: "advanced-dhcpdns.asp",
  type: "string", // Stored as string, but is a number
  defaultValue: "12",
  validation: (value) =>
    (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 720) ||
    "Valid range: 1-720 hours",
  ui: {
    label: "DHCP IPv6 lease time",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "native-pd"
          ? "hidden"
          : values["ipv6_service"] !== ""
          ? "visible"
          : "hidden",
    },
  },
};

export const ipv6_pd_norelease: NvramProperty<boolean> = {
  key: "ipv6_pd_norelease",
  description:
    "Prevents the DHCPv6 client from sending a release message on exit, increasing the likelihood of receiving the same prefix on subsequent requests.",
  page: "basic-ipv6.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Do not allow PD/Address release",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "native-pd" ? "visible" : "hidden",
    },
  },
};

export const ipv6_pdonly: NvramProperty<boolean> = {
  key: "ipv6_pdonly",
  description:
    "Instructs the DHCPv6 client to only request a Prefix Delegation (PD), not a specific address. Often used for PPPoE connections.",
  page: "basic-ipv6.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Request PD Only",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "native-pd" ? "visible" : "hidden",
    },
  },
};

interface Ipv6PortForwardRule {
  enabled: boolean;
  protocol: "1" | "2" | "3"; // TCP, UDP, Both
  srcAddress: string;
  destAddress: string;
  destPorts: string;
  description: string;
}

export const ipv6_portforward: NvramProperty<Ipv6PortForwardRule[]> = {
  key: "ipv6_portforward",
  description: "A list of IPv6 port forwarding rules.",
  page: "forward-basic-ipv6.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        enabled: { type: "boolean", label: "Enabled", defaultValue: false },
        protocol: { type: "string", label: "Protocol", defaultValue: "3" },
        srcAddress: {
          type: "string",
          label: "Source Address",
          defaultValue: "",
        },
        destAddress: {
          type: "string",
          label: "Destination Address",
          defaultValue: "",
        },
        destPorts: {
          type: "string",
          label: "Destination Ports",
          defaultValue: "",
        },
        description: {
          type: "string",
          label: "Description",
          defaultValue: "",
        },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const parts = v.split("<");
          return {
            enabled: parts[0] === "1",
            protocol: parts[1] as "1" | "2" | "3",
            srcAddress: parts[2] || "",
            destAddress: parts[3] || "",
            destPorts: (parts[4] || "").replace(/:/g, "-"),
            description: parts[5] || "",
          };
        }),
    fromUi: (value) =>
      value
        .map(
          (v) =>
            `${v.enabled ? "1" : "0"}<${v.protocol}<${v.srcAddress}<${
              v.destAddress
            }<${(v.destPorts || "").replace(/-/g, ":")}<${v.description}`,
        )
        .join(">"),
  },
};

export const ipv6_prefix: NvramProperty<string> = {
  key: "ipv6_prefix",
  description: "The IPv6 prefix assigned to the LAN side of the router.",
  page: "basic-ipv6.asp",
  type: "string", // IPv6 prefix
  validation: (value) => value === "" || true || "Invalid IPv6 prefix.", // TODO: implement ExpandIPv6Address validation
  ui: {
    label: "Assigned / Routed Prefix",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "sit" || values["ipv6_service"] === "native"
          ? "visible"
          : "hidden",
    },
  },
};

export const ipv6_prefix_len_wan: NvramProperty<string> = {
  key: "ipv6_prefix_len_wan",
  description: "The prefix length for the static WAN IPv6 address.",
  page: "basic-ipv6.asp",
  type: "string",
  defaultValue: "64",
  validation: (value) =>
    (parseInt(value, 10) >= 3 && parseInt(value, 10) <= 127) ||
    "Valid range: 3-127",
  ui: {
    label: "IPv6 WAN Prefix Length",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "native" ? "visible" : "hidden",
    },
  },
};

export const ipv6_prefix_length: NvramProperty<string> = {
  key: "ipv6_prefix_length",
  description: "The prefix length for the assigned LAN IPv6 prefix.",
  page: "basic-ipv6.asp",
  type: "string",
  defaultValue: "56",
  validation: (value) =>
    (parseInt(value, 10) >= 3 && parseInt(value, 10) <= 127) ||
    "Valid range: 3-127",
  ui: {
    label: "Prefix Length",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) => {
        const service = values["ipv6_service"];
        return service === "sit" ||
          service === "native" ||
          service === "native-pd"
          ? "visible"
          : "hidden";
      },
    },
  },
};

export const ipv6_radvd: NvramProperty<boolean> = {
  key: "ipv6_radvd",
  description:
    "Enables Router Advertisement Daemon (radvd), allowing SLAAC (Stateless Address Autoconfiguration) on the LAN.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Announce IPv6 on LAN (SLAAC)",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] !== "" ? "visible" : "hidden",
    },
  },
};

export const ipv6_relay: NvramProperty<string> = {
  key: "ipv6_relay",
  description:
    "The last octet of the 6to4 anycast relay address (192.88.99.x).",
  page: "basic-ipv6.asp",
  type: "string",
  defaultValue: "1",
  validation: (value) =>
    (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 254) ||
    "Valid range: 1-254",
  ui: {
    label: "Relay Anycast Address",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "6to4" ? "visible" : "hidden",
    },
  },
};

export const ipv6_rtr_addr: NvramProperty<string> = {
  key: "ipv6_rtr_addr",
  description:
    "Manually specified IPv6 address for the router on the LAN interface.",
  page: "basic-ipv6.asp",
  type: "string", // IPv6 address
  ui: {
    label: "IPv6 Router LAN Address",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) => {
        const service = values["ipv6_service"];
        return service === "" || service === "6rd" ? "hidden" : "visible";
      },
    },
  },
};

export const ipv6_service: NvramProperty<
  "" | "native-pd" | "native" | "6to4" | "sit" | "6rd" | "6rd-pd" | "other"
> = {
  key: "ipv6_service",
  description: "Defines the method for obtaining IPv6 connectivity.",
  page: "basic-ipv6.asp",
  type: "enum",
  defaultValue: "native-pd",
  ui: {
    label: "IPv6 Service Type",
    options: [
      { value: "", label: "Disabled" },
      { value: "native-pd", label: "DHCPv6 with Prefix Delegation" },
      { value: "native", label: "Static IPv6" },
      { value: "6to4", label: "6to4 Anycast Relay" },
      { value: "sit", label: "6in4 Static Tunnel" },
      { value: "6rd", label: "6rd Relay" },
      { value: "6rd-pd", label: "6rd from DHCPv4 (Option 212)" },
      { value: "other", label: "Other (Manual Configuration)" },
    ],
  },
};

export const ipv6_tun_addr: NvramProperty<string> = {
  key: "ipv6_tun_addr",
  description:
    "The IPv6 address of the client (this router) side of a 6in4 static tunnel.",
  page: "basic-ipv6.asp",
  type: "string", // IPv6 Address
  defaultValue: "",
  validation: (value) => value === "" || true || "Invalid IPv6 address.", // TODO: implement ExpandIPv6Address validation
  ui: {
    label: "Tunnel Client IPv6 Address",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "sit" ? "visible" : "hidden",
    },
  },
};

export const ipv6_tun_addrlen: NvramProperty<string> = {
  key: "ipv6_tun_addrlen",
  description:
    "The prefix length of the client-side IPv6 address for a 6in4 static tunnel.",
  page: "basic-ipv6.asp",
  type: "string", // number
  defaultValue: "64",
  validation: (value) =>
    (parseInt(value, 10) >= 3 && parseInt(value, 10) <= 127) ||
    "Valid range: 3-127.",
  ui: {
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "sit" ? "visible" : "hidden",
    },
  },
};

export const ipv6_tun_mtu: NvramProperty<string> = {
  key: "ipv6_tun_mtu",
  description: "The MTU for the IPv6 tunnel. 0 for default.",
  page: "basic-ipv6.asp",
  type: "string", // number
  defaultValue: "0",
  validation: (value) => {
    const num = parseInt(value, 10);
    return (
      num === 0 ||
      (num >= 1280 && num <= 1480) ||
      "Valid range is 0 or 1280-1480."
    );
  },
  ui: {
    label: "Tunnel MTU",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "6to4" || values["ipv6_service"] === "sit"
          ? "visible"
          : "hidden",
    },
  },
};

export const ipv6_tun_ttl: NvramProperty<string> = {
  key: "ipv6_tun_ttl",
  description: "The TTL (Time To Live) for packets traversing the IPv6 tunnel.",
  page: "basic-ipv6.asp",
  type: "string", // number
  defaultValue: "255",
  validation: (value) =>
    (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 255) ||
    "Valid range: 0-255.",
  ui: {
    label: "Tunnel TTL",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "6to4" ||
        values["ipv6_service"] === "sit" ||
        values["ipv6_service"] === "6rd-pd"
          ? "visible"
          : "hidden",
    },
  },
};

export const ipv6_tun_v4end: NvramProperty<string> = {
  key: "ipv6_tun_v4end",
  description: "The remote IPv4 endpoint of the 6in4 static tunnel.",
  page: "basic-ipv6.asp",
  type: "ip",
  defaultValue: "0.0.0.0",
  ui: {
    label: "Tunnel Remote Endpoint (IPv4 Address)",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "sit" ? "visible" : "hidden",
    },
  },
};

export const ipv6_vlan: NvramProperty<string> = {
  key: "ipv6_vlan",
  description:
    "Bitmask to enable IPv6 subnet delegation to secondary LAN bridges. 1=LAN1, 2=LAN2, 4=LAN3.",
  page: "basic-ipv6.asp",
  type: "string", // Bitmask
  defaultValue: "0",
  ui: {
    label: "Enable IPv6 subnet for",
  },
};

export const ipv6_wan_addr: NvramProperty<string> = {
  key: "ipv6_wan_addr",
  description: "The static IPv6 address for the WAN interface.",
  page: "basic-ipv6.asp",
  type: "string", // IPv6 address
  defaultValue: "",
  ui: {
    label: "IPv6 WAN Address",
    state: {
      dependsOn: ["ipv6_service"],
      evaluator: (values) =>
        values["ipv6_service"] === "native" ? "visible" : "hidden",
    },
  },
};

export const jffs2_auto_unmount: NvramProperty<boolean> = {
  key: "jffs2_auto_unmount",
  description:
    "Automatically unmounts the JFFS partition during a firmware upgrade to help preserve its contents.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Unmount JFFS during upgrade",
  },
};

export const jffs2_exec: NvramProperty<string> = {
  key: "jffs2_exec",
  description:
    "A command or script to execute when the JFFS partition is mounted.",
  page: "admin-jffs2.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Execute when mounted",
  },
};

export const jffs2_on: NvramProperty<boolean> = {
  key: "jffs2_on",
  description: "Enables the JFFS2 (Journaling Flash File System) partition.",
  page: "admin-jffs2.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable",
  },
};

export const jumbo_frame_enable: NvramProperty<boolean> = {
  key: "jumbo_frame_enable",
  description: "Enables support for Jumbo Frames on Gigabit Ethernet ports.",
  page: "advanced-misc.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable Jumbo Frames *",
  },
};

export const jumbo_frame_size: NvramProperty<number> = {
  key: "jumbo_frame_size",
  description: "The size in bytes for Jumbo Frames.",
  page: "advanced-misc.asp",
  type: "integer",
  defaultValue: 2000,
  validation: rangeValidator(1, 9720, "Jumbo Frame Size"),
  ui: {
    label: "Jumbo Frame Size *",
    state: {
      dependsOn: ["jumbo_frame_enable"],
      evaluator: (values) =>
        values["jumbo_frame_enable"] === "1" ? "enabled" : "disabled",
    },
  },
};

interface LanAccessRule {
  enabled: boolean;
  srcBridge: 0 | 1 | 2 | 3;
  srcAddress: string;
  dstBridge: 0 | 1 | 2 | 3;
  dstAddress: string;
  description: string;
}

export const lan_access: NvramProperty<LanAccessRule[]> = {
  key: "lan_access",
  description: "List of rules defining access between different LAN bridges.",
  page: "advanced-access.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        enabled: { type: "boolean", label: "Enabled", defaultValue: false },
        srcBridge: {
          type: "integer",
          label: "Source Bridge",
          defaultValue: 0,
        },
        srcAddress: {
          type: "string",
          label: "Source Address",
          defaultValue: "",
        },
        dstBridge: {
          type: "integer",
          label: "Destination Bridge",
          defaultValue: 0,
        },
        dstAddress: {
          type: "string",
          label: "Destination Address",
          defaultValue: "",
        },
        description: {
          type: "string",
          label: "Description",
          defaultValue: "",
        },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const p = v.split("<");
          return {
            enabled: p[0] === "1",
            srcBridge: parseInt(p[1] || "0", 10) as LanAccessRule["srcBridge"],
            srcAddress: p[2] || "",
            dstBridge: parseInt(p[3] || "0", 10) as LanAccessRule["dstBridge"],
            dstAddress: p[4] || "",
            description: p[5] || "",
          };
        }),
    fromUi: (value) =>
      value
        .map(
          (v) =>
            `${v.enabled ? 1 : 0}<${v.srcBridge}<${v.srcAddress}<${
              v.dstBridge
            }<${v.dstAddress}<${v.description}`,
        )
        .join(">"),
  },
};

export const lan_desc: NvramProperty<boolean> = {
  key: "lan_desc",
  description:
    "Show speed information in the Ethernet Ports State section of the Overview page.",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Show Speed Info",
    state: {
      dependsOn: ["lan_state"],
      evaluator: (values) =>
        values["lan_state"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const lan_dhcp: NvramProperty<boolean> = {
  key: "lan_dhcp",
  description:
    "When enabled, the router obtains its LAN IP address from another DHCP server on the network (disabling its own).",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Automatic IP",
  },
};

export const lan_gateway: NvramProperty<string> = {
  key: "lan_gateway",
  description:
    "The default gateway address for the LAN when the router is in 'Static' mode (lan_dhcp=0).",
  page: "basic-network.asp",
  type: "ip",
  defaultValue: "0.0.0.0",
  ui: {
    label: "Default Gateway",
    state: {
      dependsOn: ["lan_dhcp"],
      evaluator: (values) =>
        values["lan_dhcp"] === "1" ? "disabled" : "enabled",
    },
  },
};

export const lan_hwaddr: NvramProperty<string> = {
  key: "lan_hwaddr",
  description: "The hardware MAC address of the primary LAN (br0) interface.",
  page: "advanced-mac.asp",
  type: "mac",
};

// Helper type for patterned LAN keys
type LanBridgeParam = { bridgeIndex: 0 | 1 | 2 | 3 };
const lanKey = (params: LanBridgeParam) =>
  params.bridgeIndex === 0 ? "lan" : `lan${params.bridgeIndex}`;

export const lan_ifname: PatternedNvramProperty<LanBridgeParam, string> = {
  getKey: (params) => `${lanKey(params)}_ifname`,
  regex: /^lan(\d*)_ifname$/,
  parameters: {
    bridgeIndex: {
      type: "integer",
      description: "LAN bridge index (0-3)",
      range: [0, 3],
    },
  },
  description:
    "The interface name for the LAN bridge (e.g., br0, br1). An empty string means the bridge is disabled.",
  page: "advanced-vlan.asp",
  type: "string",
};

export const lan_ifnames: PatternedNvramProperty<LanBridgeParam, string> = {
  getKey: (params) => `${lanKey(params)}_ifnames`,
  regex: /^lan(\d*)_ifnames$/,
  parameters: {
    bridgeIndex: {
      type: "integer",
      description: "LAN bridge index (0-3)",
      range: [0, 3],
    },
  },
  description:
    "A space-separated list of physical and virtual interfaces assigned to this LAN bridge.",
  page: "advanced-vlan.asp",
  type: "string",
};

export const lan_invert: NvramProperty<boolean> = {
  key: "lan_invert",
  description:
    "Inverts the display order of ports in the Ethernet Ports State section of the Overview page.",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Invert Ports Order",
    state: {
      dependsOn: ["lan_state"],
      evaluator: (values) =>
        values["lan_state"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const lan_ipaddr: PatternedNvramProperty<LanBridgeParam, string> = {
  getKey: (params) => `${lanKey(params)}_ipaddr`,
  regex: /^lan(\d*)_ipaddr$/,
  parameters: {
    bridgeIndex: {
      type: "integer",
      description: "LAN bridge index (0-3)",
      range: [0, 3],
    },
  },
  description: "The IP address for the specified LAN bridge.",
  page: "basic-network.asp",
  type: "ip",
};

export const lan_netmask: PatternedNvramProperty<LanBridgeParam, string> = {
  getKey: (params) => `${lanKey(params)}_netmask`,
  regex: /^lan(\d*)_netmask$/,
  parameters: {
    bridgeIndex: {
      type: "integer",
      description: "LAN bridge index (0-3)",
      range: [0, 3],
    },
  },
  description: "The subnet mask for the specified LAN bridge.",
  page: "basic-network.asp",
  type: "netmask",
};

export const lan_proto: PatternedNvramProperty<
  LanBridgeParam,
  "dhcp" | "static"
> = {
  getKey: (params) => `${lanKey(params)}_proto`,
  regex: /^lan(\d*)_proto$/,
  parameters: {
    bridgeIndex: {
      type: "integer",
      description: "LAN bridge index (0-3)",
      range: [0, 3],
    },
  },
  description:
    "Determines if the LAN bridge has DHCP server enabled ('dhcp') or not ('static').",
  page: "basic-network.asp",
  type: "enum",
};

export const lan_state: NvramProperty<boolean> = {
  key: "lan_state",
  description: "Enables the Ethernet Ports State section on the Overview page.",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Enable Ports State",
  },
};

export const lan_stp: PatternedNvramProperty<LanBridgeParam, boolean> = {
  getKey: (params) => `${lanKey(params)}_stp`,
  regex: /^lan(\d*)_stp$/,
  parameters: {
    bridgeIndex: {
      type: "integer",
      description: "LAN bridge index (0-3)",
      range: [0, 3],
    },
  },
  description:
    "Enables Spanning Tree Protocol (STP) on the specified LAN bridge to prevent network loops.",
  page: "basic-network.asp",
  type: "boolean",
  transform: booleanTransformer,
  ui: {
    label: "STP",
  },
};

export const log_dropdups: NvramProperty<boolean> = {
  key: "log_dropdups",
  description: "If enabled, syslog will drop duplicate log messages.",
  page: "admin-log.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Drop dups",
  },
};

export const log_events: NvramProperty<string[]> = {
  key: "log_events",
  description:
    "A comma-separated list of specific system events to log (e.g., 'acre', 'crond').",
  page: "admin-log.asp",
  type: "list",
  defaultValue: [],
  transform: {
    toUi: (v) => (v ? v.split(",") : []),
    fromUi: (v) => v.join(","),
  },
  ui: {
    label: "Events Logged",
  },
};

export const log_file: NvramProperty<boolean> = {
  key: "log_file",
  description: "Enables logging to an internal buffer or file.",
  page: "admin-log.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Log Internally",
  },
};

export const log_file_custom: NvramProperty<boolean> = {
  key: "log_file_custom",
  description: "Enables the use of a custom path for the log file.",
  page: "admin-log.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Custom Log File Path",
  },
};

export const log_file_keep: NvramProperty<number> = {
  key: "log_file_keep",
  description: "The number of rotated log files to keep.",
  page: "admin-log.asp",
  type: "integer",
  defaultValue: 1,
  validation: rangeValidator(0, 99),
  ui: {
    label: "Number of rotated logs to keep",
  },
};

export const log_file_path: NvramProperty<string> = {
  key: "log_file_path",
  description: "The custom path and filename for the log file.",
  page: "admin-log.asp",
  type: "string",
  defaultValue: "/var/log/messages",
};

export const log_file_size: NvramProperty<number> = {
  key: "log_file_size",
  description: "The maximum size in KB before the log file is rotated.",
  page: "admin-log.asp",
  type: "integer",
  defaultValue: 50,
  validation: rangeValidator(0, 99999),
  ui: {
    label: "Max size before rotate",
  },
};

export const log_ftp: NvramProperty<boolean> = {
  key: "log_ftp",
  description: "Enables logging of FTP server requests and responses.",
  page: "nas-ftp.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Log FTP requests and responses",
  },
};

export const log_in: NvramProperty<"0" | "1" | "2" | "3"> = {
  key: "log_in",
  description: "Controls logging of inbound connections.",
  page: "admin-log.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Inbound",
    options: [
      { value: "0", label: "Disabled (recommended)" },
      { value: "1", label: "If Blocked By Firewall" },
      { value: "2", label: "If Allowed By Firewall" },
      { value: "3", label: "Both" },
    ],
  },
};

export const log_limit: NvramProperty<number> = {
  key: "log_limit",
  description:
    "The maximum number of connection log messages per minute. 0 for unlimited.",
  page: "admin-log.asp",
  type: "integer",
  defaultValue: 60,
  validation: rangeValidator(0, 2400, "messages per minute"),
  ui: {
    label: "Limit",
  },
};

export const log_mark: NvramProperty<string> = {
  key: "log_mark",
  description:
    "Interval in minutes for generating a '-- MARK --' entry in the log.",
  page: "admin-log.asp",
  type: "enum",
  defaultValue: "60",
  ui: {
    label: "Generate Marker",
    options: [
      { value: "0", label: "Disabled" },
      { value: "30", label: "Every 30 Minutes" },
      { value: "60", label: "Every 1 Hour" },
      { value: "120", label: "Every 2 Hours" },
      { value: "360", label: "Every 6 Hours" },
      { value: "720", label: "Every 12 Hours" },
      { value: "1440", label: "Every 1 Day" },
      { value: "10080", label: "Every 7 Days" },
    ],
  },
};

export const log_min_level: NvramProperty<string> = {
  key: "log_min_level",
  description: "Sets the minimum severity level for messages to be logged.",
  page: "admin-log.asp",
  type: "enum",
  defaultValue: "8",
  ui: {
    label: "Minimum log level",
    options: [
      { value: "1", label: "Emergency" },
      { value: "2", label: "Alert" },
      { value: "3", label: "Critical" },
      { value: "4", label: "Error" },
      { value: "5", label: "Warning" },
      { value: "6", label: "Notice" },
      { value: "7", label: "Info" },
      { value: "8", label: "Debug" },
    ],
  },
};

export const log_out: NvramProperty<"0" | "1" | "2" | "3"> = {
  key: "log_out",
  description: "Controls logging of outbound connections.",
  page: "admin-log.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Outbound",
    options: [
      { value: "0", label: "Disabled (recommended)" },
      { value: "1", label: "If Blocked By Firewall" },
      { value: "2", label: "If Allowed By Firewall" },
      { value: "3", label: "Both" },
    ],
  },
};

export const log_remote: NvramProperty<boolean> = {
  key: "log_remote",
  description: "Enables sending log messages to a remote syslog server.",
  page: "admin-log.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Log To Remote System",
  },
};

export const log_remoteip: NvramProperty<string> = {
  key: "log_remoteip",
  description: "The IP address or hostname of the remote syslog server.",
  page: "admin-log.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Host or IP Address / Port",
  },
};

export const log_remoteport: NvramProperty<number> = {
  key: "log_remoteport",
  description: "The port of the remote syslog server.",
  page: "admin-log.asp",
  type: "integer",
  defaultValue: 514,
  validation: portValidator,
};

export const log_wm: NvramProperty<boolean> = {
  key: "log_wm",
  description:
    "Enables the Web Monitor feature to log visited domains and web searches.",
  page: "admin-log.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Monitor Web Usage",
  },
};

export const log_wmdmax: NvramProperty<number> = {
  key: "log_wmdmax",
  description: "The maximum number of visited domain entries to remember.",
  page: "admin-log.asp",
  type: "integer",
  defaultValue: 2000,
  validation: rangeValidator(0, 9999),
  ui: {
    label: "Domains",
    state: {
      dependsOn: ["log_wm"],
      evaluator: (values) =>
        values["log_wm"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const log_wmip: NvramProperty<string> = {
  key: "log_wmip",
  description:
    "A comma-separated list of IP addresses or ranges to either include in or exclude from web monitoring, based on 'log_wmtype'.",
  page: "admin-log.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "IP Address(es)",
    state: {
      dependsOn: ["log_wm", "log_wmtype"],
      evaluator: (values) =>
        values["log_wm"] === "1" && values["log_wmtype"] !== "0"
          ? "visible"
          : "hidden",
    },
  },
};

export const log_wmsmax: NvramProperty<number> = {
  key: "log_wmsmax",
  description: "The maximum number of web search entries to remember.",
  page: "admin-log.asp",
  type: "integer",
  defaultValue: 2000,
  validation: rangeValidator(0, 9999),
  ui: {
    label: "Searches",
    state: {
      dependsOn: ["log_wm"],
      evaluator: (values) =>
        values["log_wm"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const log_wmtype: NvramProperty<"0" | "1" | "2"> = {
  key: "log_wmtype",
  description: "Determines which clients are monitored by the Web Monitor.",
  page: "admin-log.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Monitor",
    options: [
      { value: "0", label: "All Computers / Devices" },
      { value: "1", label: "The Following..." },
      { value: "2", label: "All Except..." },
    ],
    state: {
      dependsOn: ["log_wm"],
      evaluator: (values) =>
        values["log_wm"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const macnames: NvramProperty<string> = {
  key: "macnames",
  description:
    "A list of MAC-to-hostname mappings, used by the Wireless Filter page. Format: 'MAC1<Name1>MAC2<Name2>...'",
  page: "basic-wfilter.asp",
  type: "string",
  defaultValue: "",
};

export const manual_boot_nv: NvramProperty<boolean> = {
  key: "manual_boot_nv",
  description:
    "A flag used internally by the VLAN page to indicate that NVRAM settings have been manually modified and a reboot is required.",
  page: "advanced-vlan.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
};

export const mdns_enable: NvramProperty<boolean> = {
  key: "mdns_enable",
  description:
    "Enables the Avahi mDNS (multicast DNS) daemon for zero-configuration networking.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable multicast DNS (Avahi mDNS)",
  },
};

export const mdns_reflector: NvramProperty<boolean> = {
  key: "mdns_reflector",
  description:
    "Enables the mDNS reflector, which forwards mDNS packets between different subnets (LAN bridges).",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Enable reflector",
    state: {
      dependsOn: ["mdns_enable"],
      evaluator: (values) =>
        values["mdns_enable"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const model: NvramProperty<string> = {
  key: "model",
  description: "The router's model identifier string.",
  page: "advanced-vlan.asp",
  type: "string",
};

export const ms_autoscan: NvramProperty<boolean> = {
  key: "ms_autoscan",
  description:
    "Enables automatic scanning of media directories at a 10-minute interval.",
  page: "nas-media.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Auto scan media",
    suffix: " <small>10 minutes interval</small>",
    state: {
      dependsOn: ["ms_dbdir"],
      evaluator: (values) =>
        values["ms_dbdir"] !== "" ? "enabled" : "disabled",
    },
  },
};

export const ms_custom: NvramProperty<string> = {
  key: "ms_custom",
  description: "Custom configuration options for the MiniDLNA media server.",
  page: "nas-media.asp",
  type: "string",
  defaultValue: "",
  validation: (value) =>
    value.length <= 4096 || "Maximum length is 4096 characters.",
  ui: {
    label: "Custom configuration",
  },
};

export const ms_dbdir: NvramProperty<string> = {
  key: "ms_dbdir",
  description:
    "Specifies the directory to store the MiniDLNA media database. Can be in RAM, JFFS, or a custom path.",
  page: "nas-media.asp",
  type: "string",
  defaultValue: "",
  validation: (value, allValues) => {
    if (value.startsWith("/jffs") && allValues["jffs2_on"] !== "1") {
      return "JFFS is not enabled.";
    }
    if (value.startsWith("/") && value !== "") return true;
    if (value === "") return true; // RAM is valid
    return "Path must be empty for RAM or start with / for a custom path.";
  },
  ui: {
    label: "Database Location",
  },
};

interface MediaDir {
  directory: string;
  filter: "" | "A" | "V" | "P" | "PV";
}

export const ms_dirs: NvramProperty<MediaDir[]> = {
  key: "ms_dirs",
  description:
    "A list of directories and content filters for the MiniDLNA media server.",
  page: "nas-media.asp",
  type: "structured-string",
  defaultValue: [{ directory: "/mnt", filter: "" }],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        directory: {
          type: "string",
          label: "Directory",
          defaultValue: "",
        },
        filter: { type: "string", label: "Filter", defaultValue: "" },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const parts = v.split("<");
          return {
            directory: parts[0]!,
            filter: (parts[1] as MediaDir["filter"]) || "",
          };
        }),
    fromUi: (value) => value.map((v) => `${v.directory}<${v.filter}`).join(">"),
  },
  ui: {
    label: "Media Directories",
  },
};

export const ms_enable: NvramProperty<boolean> = {
  key: "ms_enable",
  description: "Enables the MiniDLNA media server on startup.",
  page: "nas-media.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable on Start",
  },
};

export const ms_ifname: NvramProperty<string> = {
  key: "ms_ifname",
  description:
    "A comma-separated list of LAN bridge interfaces (e.g., 'br0,br1') on which the media server will be available.",
  page: "nas-media.asp",
  type: "list",
  defaultValue: "br0",
  ui: {
    label: "Enabled on",
  },
};

export const ms_port: NvramProperty<number> = {
  key: "ms_port",
  description:
    "The port number for the MiniDLNA server. Set to 0 for a random port.",
  page: "nas-media.asp",
  type: "integer",
  defaultValue: 0,
  validation: rangeValidator(0, 65535, "port"),
  ui: {
    label: "Port",
  },
};

export const ms_sas: NvramProperty<boolean> = {
  key: "ms_sas",
  description:
    "Scan media directories at startup. Only available when the database location is not temporary RAM.",
  page: "nas-media.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Scan Media at Startup*",
    state: {
      dependsOn: ["ms_dbdir"],
      evaluator: (values) => (values["ms_dbdir"] !== "" ? "visible" : "hidden"),
    },
  },
};

export const ms_stdlna: NvramProperty<boolean> = {
  key: "ms_stdlna",
  description:
    "Enforces strict adherence to DLNA standards, which may improve compatibility with some devices but break functionality with others.",
  page: "nas-media.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Strictly adhere to DLNA standards",
  },
};

export const ms_tivo: NvramProperty<boolean> = {
  key: "ms_tivo",
  description: "Enables specific workarounds for TiVo devices.",
  page: "nas-media.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "TiVo Support",
  },
};

export const multicast_custom: NvramProperty<string> = {
  key: "multicast_custom",
  description:
    "Custom configuration for the IGMP proxy service. This is used when none of the standard LAN bridge options are selected.",
  page: "advanced-firewall.asp",
  type: "string",
  defaultValue: "",
  validation: (value) =>
    value.length <= 2048 || "Maximum length is 2048 characters.",
  ui: {
    label: "IGMP proxy Custom configuration",
  },
};

const multicastLanProperty = (
  lanIndex: 0 | 1 | 2 | 3,
): NvramProperty<boolean> => ({
  key: `multicast_lan${lanIndex === 0 ? "" : lanIndex}`,
  description: `Enables the IGMP proxy on the LAN${lanIndex} (br${lanIndex}) interface.`,
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: `LAN${lanIndex}`,
    state: {
      dependsOn: [
        `lan${lanIndex === 0 ? "" : lanIndex}_ifname`,
        "multicast_pass",
      ],
      evaluator: (values) => {
        const isEnabled = values["multicast_pass"] === "1";
        const hasInterface =
          values[`lan${lanIndex === 0 ? "" : lanIndex}_ifname`] !== "";
        return isEnabled && hasInterface ? "enabled" : "disabled";
      },
    },
  },
});

export const multicast_lan = multicastLanProperty(0);
export const multicast_lan1 = multicastLanProperty(1);
export const multicast_lan2 = multicastLanProperty(2);
export const multicast_lan3 = multicastLanProperty(3);

export const multicast_pass: NvramProperty<boolean> = {
  key: "multicast_pass",
  description:
    "Globally enables or disables the IGMP proxy service, which allows multicast traffic to pass between WAN and LAN.",
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable IGMP proxy",
  },
};

export const multicast_quickleave: NvramProperty<boolean> = {
  key: "multicast_quickleave",
  description:
    "Enables the IGMP proxy's quickleave feature, which sends a Leave message upstream as soon as a Leave is received from a downstream client.",
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Enable quickleave",
  },
};

export const mwan_ckdst: NvramProperty<[string, string]> = {
  key: "mwan_ckdst",
  description:
    "A comma-separated list of up to two IP addresses or domain names to use as targets for the MultiWAN connection check (watchdog).",
  page: "basic-network.asp",
  type: "list",
  defaultValue: ["1.1.1.1", "google.com"],
  transform: {
    toUi: (value) => value.split(",", 2) as [string, string],
    fromUi: (value) => value.join(","),
  },
  ui: {
    label: "Target",
  },
};

export const mwan_cktime: NvramProperty<
  0 | 30 | 60 | 120 | 180 | 300 | 600 | 900 | 1800
> = {
  key: "mwan_cktime",
  description:
    "The interval in seconds for the MultiWAN connection check (watchdog). 0 disables the check.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: 0,
  ui: {
    label: "Check connections every",
    options: [
      { value: 0, label: "Disabled" },
      { value: 30, label: "30 seconds" },
      { value: 60, label: "1 minute*" },
      { value: 120, label: "2 minutes" },
      { value: 180, label: "3 minutes" },
      { value: 300, label: "5 minutes" },
      { value: 600, label: "10 minutes" },
      { value: 900, label: "15 minutes" },
      { value: 1800, label: "30 minutes" },
    ],
  },
};

export const mwan_num: NvramProperty<1 | 2 | 3 | 4> = {
  key: "mwan_num",
  description: "The number of logical WAN interfaces to enable.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: 1,
  ui: {
    label: "Number of logical WANs",
    options: [
      { value: 1, label: "1 WAN" },
      { value: 2, label: "2 WAN" },
      { value: 3, label: "3 WAN" },
      { value: 4, label: "4 WAN" },
    ],
  },
};

export const mwan_tune_gc: NvramProperty<boolean> = {
  key: "mwan_tune_gc",
  description:
    "Tunes the route cache garbage collection for multi-WAN in load balancing mode.",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Tune route cache",
    state: {
      dependsOn: ["mwan_num"],
      evaluator: (values) =>
        parseInt(values["mwan_num"] || "0", 10) > 1 ? "visible" : "hidden",
    },
  },
};

export const mysql_allow_anyhost: NvramProperty<boolean> = {
  key: "mysql_allow_anyhost",
  description:
    "Allows any host to connect to the MySQL database server. If disabled, only localhost connections are allowed.",
  page: "web-mysql.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Allow Anyhost to access",
  },
};

export const mysql_binary: NvramProperty<"internal" | "optware" | "custom"> = {
  key: "mysql_binary",
  description: "Specifies the location of the MySQL server binaries.",
  page: "web-mysql.asp",
  type: "enum",
  defaultValue: "internal",
  ui: {
    label: "MySQL binary path",
    options: [
      { value: "internal", label: "Internal (/usr/bin)" },
      { value: "optware", label: "Optware (/opt/bin)" },
      { value: "custom", label: "Custom" },
    ],
  },
};

export const mysql_binary_custom: NvramProperty<string> = {
  key: "mysql_binary_custom",
  description:
    "The custom path to the MySQL binaries, used when 'mysql_binary' is set to 'custom'.",
  page: "web-mysql.asp",
  type: "string",
  defaultValue: "/mnt/sda1/mysql/bin",
  ui: {
    state: {
      dependsOn: ["mysql_binary"],
      evaluator: (values) =>
        values["mysql_binary"] === "custom" ? "visible" : "hidden",
    },
  },
};

export const mysql_check_time: NvramProperty<number> = {
  key: "mysql_check_time",
  description:
    "The interval in minutes for the keep-alive check to ensure the MySQL daemon is running. 0 disables the check.",
  page: "web-mysql.asp",
  type: "integer",
  defaultValue: 5,
  validation: rangeValidator(0, 55, "minutes"),
  ui: {
    label: "Poll Interval",
  },
};

export const mysql_datadir: NvramProperty<string> = {
  key: "mysql_datadir",
  description:
    "The subdirectory under the mounted USB partition to use for MySQL data files.",
  page: "web-mysql.asp",
  type: "string",
  defaultValue: "data",
  ui: {
    label: "Data dir.",
  },
};

export const mysql_dlroot: NvramProperty<string> = {
  key: "mysql_dlroot",
  description:
    "The mount point of the USB partition to use for the MySQL server.",
  page: "web-mysql.asp",
  type: "string",
  defaultValue: "",
  ui: {
    state: {
      dependsOn: ["mysql_usb_enable"],
      evaluator: (values) =>
        values["mysql_usb_enable"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const mysql_enable: NvramProperty<boolean> = {
  key: "mysql_enable",
  description:
    "Enables the MySQL server to start automatically on router boot.",
  page: "web-mysql.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable on Start",
  },
};

export const mysql_init_priv: NvramProperty<boolean> = {
  key: "mysql_init_priv",
  description:
    "Forces a re-initialization of the MySQL privilege tables on the next start.",
  page: "web-mysql.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Re-init priv. table",
  },
};

export const mysql_init_rootpass: NvramProperty<boolean> = {
  key: "mysql_init_rootpass",
  description:
    "Forces a re-initialization of the MySQL root user's password on the next start.",
  page: "web-mysql.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Re-init root password",
  },
};

export const mysql_key_buffer: NvramProperty<number> = {
  key: "mysql_key_buffer",
  description: "Size of the buffer used for index blocks, in MB.",
  page: "web-mysql.asp",
  type: "integer",
  defaultValue: 16,
  validation: rangeValidator(1, 1024),
  ui: {
    label: "Key buffer",
  },
};

export const mysql_max_allowed_packet: NvramProperty<number> = {
  key: "mysql_max_allowed_packet",
  description:
    "The maximum size of one packet or any generated/intermediate string, in MB.",
  page: "web-mysql.asp",
  type: "integer",
  defaultValue: 4,
  validation: rangeValidator(1, 1024000),
  ui: {
    label: "Max allowed packet",
  },
};

export const mysql_max_connections: NvramProperty<number> = {
  key: "mysql_max_connections",
  description: "The maximum number of simultaneous client connections.",
  page: "web-mysql.asp",
  type: "integer",
  defaultValue: 100,
  validation: rangeValidator(1, 999999),
  ui: {
    label: "Max connections",
  },
};

export const mysql_passwd: NvramProperty<string> = {
  key: "mysql_passwd",
  description: "The password for the MySQL root user.",
  page: "web-mysql.asp",
  type: "string",
  defaultValue: "admin",
  validation: (value) => value.trim() !== "" || "Password cannot be empty.",
  ui: {
    label: "root password",
    state: {
      dependsOn: ["mysql_init_rootpass"],
      evaluator: (values) =>
        values["mysql_init_rootpass"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const mysql_port: NvramProperty<number> = {
  key: "mysql_port",
  description:
    "The TCP port on which the MySQL server listens for connections.",
  page: "web-mysql.asp",
  type: "integer",
  defaultValue: 3306,
  validation: portValidator,
  ui: {
    label: "MySQL listen port",
  },
};

export const mysql_query_cache_size: NvramProperty<number> = {
  key: "mysql_query_cache_size",
  description:
    "The amount of memory allocated for caching query results, in MB.",
  page: "web-mysql.asp",
  type: "integer",
  defaultValue: 16,
  validation: rangeValidator(1, 1024),
  ui: {
    label: "Query cache size",
  },
};

export const mysql_read_buffer_size: NvramProperty<number> = {
  key: "mysql_read_buffer_size",
  description:
    "The size of the buffer used for sequential scans of MyISAM tables, in KB.",
  page: "web-mysql.asp",
  type: "integer",
  defaultValue: 128,
  validation: rangeValidator(1, 1024000),
  ui: {
    label: "Read buffer size",
  },
};

export const mysql_read_rnd_buffer_size: NvramProperty<number> = {
  key: "mysql_read_rnd_buffer_size",
  description:
    "The size of the buffer used for reading rows in sorted order, in KB.",
  page: "web-mysql.asp",
  type: "integer",
  defaultValue: 256,
  validation: rangeValidator(1, 1024000),
  ui: {
    label: "Read rand buffer size",
  },
};

export const mysql_server_custom: NvramProperty<string> = {
  key: "mysql_server_custom",
  description: "Custom configuration parameters for the MySQL server.",
  page: "web-mysql.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Custom Config",
  },
};

export const mysql_sleep: NvramProperty<number> = {
  key: "mysql_sleep",
  description: "Delay in seconds before starting the MySQL daemon at boot.",
  page: "web-mysql.asp",
  type: "integer",
  defaultValue: 2,
  validation: rangeValidator(1, 60),
  ui: {
    label: "Delay at startup",
  },
};

export const mysql_sort_buffer_size: NvramProperty<number> = {
  key: "mysql_sort_buffer_size",
  description:
    "The size of the buffer allocated for each session that needs to perform a sort, in KB.",
  page: "web-mysql.asp",
  type: "integer",
  defaultValue: 128,
  validation: rangeValidator(1, 1024000),
  ui: {
    label: "Sort buffer size",
  },
};

export const mysql_table_open_cache: NvramProperty<number> = {
  key: "mysql_table_open_cache",
  description: "The number of open tables for all threads.",
  page: "web-mysql.asp",
  type: "integer",
  defaultValue: 4,
  validation: rangeValidator(1, 999999),
  ui: {
    label: "Table open cache",
  },
};

export const mysql_thread_cache_size: NvramProperty<number> = {
  key: "mysql_thread_cache_size",
  description: "How many threads the server should cache for reuse.",
  page: "web-mysql.asp",
  type: "integer",
  defaultValue: 8,
  validation: rangeValidator(1, 999999),
  ui: {
    label: "Thread cache size",
  },
};

export const mysql_thread_stack: NvramProperty<number> = {
  key: "mysql_thread_stack",
  description: "The stack size for each thread, in KB.",
  page: "web-mysql.asp",
  type: "integer",
  defaultValue: 128,
  validation: rangeValidator(1, 1024000),
  ui: {
    label: "Thread stack",
  },
};

export const mysql_tmpdir: NvramProperty<string> = {
  key: "mysql_tmpdir",
  description:
    "The subdirectory under the mounted USB partition to use for MySQL temporary files.",
  page: "web-mysql.asp",
  type: "string",
  defaultValue: "tmp",
  ui: {
    label: "Tmp dir.",
  },
};

export const mysql_usb_enable: NvramProperty<boolean> = {
  key: "mysql_usb_enable",
  description: "Enables the use of a USB partition for storing MySQL data.",
  page: "web-mysql.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Enable USB Partition",
  },
};

export const mysql_username: NvramProperty<string> = {
  key: "mysql_username",
  description:
    "The username for the MySQL root account. This is typically 'root' and not user-configurable from the UI.",
  page: "web-mysql.asp",
  type: "string",
  defaultValue: "root",
  ui: {
    label: "root user name",
  },
};

export const NC_AllowedWebHosts: NvramProperty<string> = {
  key: "NC_AllowedWebHosts",
  description:
    "A space-separated list of URLs that are excluded from the Captive Portal, allowing direct access.",
  page: "splashd.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "URL Excluded from Captive Portal",
  },
};

export const NC_BridgeLAN: NvramProperty<"br0" | "br1" | "br2" | "br3"> = {
  key: "NC_BridgeLAN",
  description:
    "The LAN bridge interface on which the Captive Portal will be active.",
  page: "splashd.asp",
  type: "enum",
  defaultValue: "br0",
  ui: {
    label: "Interface",
    options: [
      { value: "br0", label: "LAN0 (br0)*" },
      { value: "br1", label: "LAN1 (br1)" },
      { value: "br2", label: "LAN2 (br2)" },
      { value: "br3", label: "LAN3 (br3)" },
    ],
  },
};

export const NC_DocumentRoot: NvramProperty<string> = {
  key: "NC_DocumentRoot",
  description:
    "The path to the directory containing the splash.html welcome page for the Captive Portal.",
  page: "splashd.asp",
  type: "string",
  defaultValue: "/tmp/splashd",
  ui: {
    label: "Welcome html Path",
  },
};

export const NC_enable: NvramProperty<boolean> = {
  key: "NC_enable",
  description: "Enables the Captive Portal (NoCatSplash) feature.",
  page: "splashd.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable",
  },
};

export const NC_ExcludePorts: NvramProperty<string> = {
  key: "NC_ExcludePorts",
  description:
    "A space-separated list of TCP/UDP ports to exclude from Captive Portal redirection.",
  page: "splashd.asp",
  type: "string",
  defaultValue: "1863",
  ui: {
    label: "Excluded Ports to be redirected",
  },
};

export const NC_ForcedRedirect: NvramProperty<boolean> = {
  key: "NC_ForcedRedirect",
  description:
    "If enabled, users will be redirected to the specified 'Home Page' after accepting the splash page.",
  page: "splashd.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Captive Site Forwarding",
  },
};

export const NC_GatewayName: NvramProperty<string> = {
  key: "NC_GatewayName",
  description:
    "The name of the gateway that appears on the Captive Portal splash page.",
  page: "splashd.asp",
  type: "string",
  defaultValue: "FreshTomato Captive Portal",
  validation: (value) =>
    value.length <= 255 || "Maximum length is 255 characters.",
  ui: {
    label: "Gateway Name",
  },
};

export const NC_GatewayPort: NvramProperty<number> = {
  key: "NC_GatewayPort",
  description: "The TCP port used by the Captive Portal for page redirection.",
  page: "splashd.asp",
  type: "integer",
  defaultValue: 5280,
  validation: portValidator,
  ui: {
    label: "Gateway Port",
  },
};

export const NC_HomePage: NvramProperty<string> = {
  key: "NC_HomePage",
  description:
    "The URL to which users are redirected after accepting the splash page, if 'Forced Redirect' is enabled.",
  page: "splashd.asp",
  type: "string",
  defaultValue: "https://startpage.com",
  validation: (value, allValues) => {
    if (allValues["NC_ForcedRedirect"] === "1" && value.length < 1) {
      return "Home Page cannot be empty when Forced Redirect is enabled.";
    }
    return true;
  },
  ui: {
    label: "Home Page",
    state: {
      dependsOn: ["NC_ForcedRedirect"],
      evaluator: (values) =>
        values.NC_ForcedRedirect === "1" ? "enabled" : "disabled",
    },
  },
};

export const NC_IdleTimeout: NvramProperty<number> = {
  key: "NC_IdleTimeout",
  description:
    "The time in seconds after which an idle user's session will expire. 0 means unlimited.",
  page: "splashd.asp",
  type: "integer",
  defaultValue: 0,
  validation: (value) =>
    value === 0 || value >= 300 || "Value must be 0 or >= 300.",
  ui: {
    label: "Idle Timeout",
  },
};

export const NC_IncludePorts: NvramProperty<string> = {
  key: "NC_IncludePorts",
  description:
    "A space-separated list of TCP/UDP ports to explicitly include in Captive Portal redirection.",
  page: "splashd.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Included Ports to be redirected",
  },
};

export const NC_LoginTimeout: NvramProperty<string> = {
  key: "NC_LoginTimeout",
  description:
    "The duration in seconds for which a user's session remains active after they accept the splash page.",
  page: "splashd.asp",
  type: "string", // Stored as string, but behaves like integer
  defaultValue: "3600",
  ui: {
    label: "Logged Timeout",
  },
};

export const NC_MACWhiteList: NvramProperty<string> = {
  key: "NC_MACWhiteList",
  description:
    "A space-separated list of MAC addresses that are exempt from the Captive Portal.",
  page: "splashd.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "MAC Address Whitelist",
  },
};

export const NC_MaxMissedARP: NvramProperty<string> = {
  key: "NC_MaxMissedARP",
  description:
    "The number of missed ARP requests before a client is considered to have disconnected.",
  page: "splashd.asp",
  type: "string", // Stored as string, but behaves like integer
  defaultValue: "5",
  ui: {
    label: "Max Missed ARP",
  },
};

export const NC_Verbosity: NvramProperty<string> = {
  key: "NC_Verbosity",
  description: "The logging level for the Captive Portal service.",
  page: "splashd.asp",
  type: "string", // Stored as string, but behaves like integer
  defaultValue: "2",
  ui: {
    label: "Log Info Level",
  },
};

interface Shlimit {
  mode: number; // bitmask: 1=SSH, 2=Telnet
  hits: number;
  seconds: number;
}
export const ne_shlimit: NvramProperty<Shlimit> = {
  key: "ne_shlimit",
  description:
    "Configures rate limiting for SSH and Telnet connection attempts to prevent brute-force attacks.",
  page: "admin-access.asp",
  type: "structured-string",
  defaultValue: { mode: 1, hits: 3, seconds: 60 },
  structuredSchema: {
    kind: "object",
    fields: {
      mode: {
        type: "integer",
        label: "Mode",
        defaultValue: 1,
      },
      hits: {
        type: "integer",
        label: "Hits",
        defaultValue: 3,
      },
      seconds: {
        type: "integer",
        label: "Seconds",
        defaultValue: 60,
      },
    },
  },
  transform: {
    toUi: (value) => {
      const [mode = "0", hits = "3", seconds = "60"] = value.split(",");
      return {
        mode: parseInt(mode, 10),
        hits: parseInt(hits, 10),
        seconds: parseInt(seconds, 10),
      };
    },
    fromUi: (value) => `${value.mode},${value.hits},${value.seconds}`,
  },
  ui: {
    label: "Limit Connection Attempts",
  },
};

export const ne_snat: NvramProperty<"0" | "1"> = {
  key: "ne_snat",
  description:
    "Selects the NAT target to use. MASQUERADE is more flexible but may have a performance overhead compared to SNAT.",
  page: "advanced-firewall.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "NAT target",
    options: [
      { value: "0", label: "MASQUERADE" },
      { value: "1", label: "SNAT" },
    ],
  },
};

export const ne_syncookies: NvramProperty<boolean> = {
  key: "ne_syncookies",
  description: "Enables TCP SYN cookies to mitigate SYN flood attacks.",
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable TCP SYN cookies",
  },
};

export const ne_valpha: NvramProperty<string> = {
  key: "ne_valpha",
  description:
    "Alpha parameter for the TCP Vegas congestion control algorithm.",
  page: "qos-settings.asp",
  type: "string",
  defaultValue: "2",
  validation: (value) => rangeValidator(0, 65535)(parseInt(value, 10)),
  ui: {
    label: "Alpha",
  },
};

export const ne_vbeta: NvramProperty<string> = {
  key: "ne_vbeta",
  description: "Beta parameter for the TCP Vegas congestion control algorithm.",
  page: "qos-settings.asp",
  type: "string",
  defaultValue: "6",
  validation: (value) => rangeValidator(0, 65535)(parseInt(value, 10)),
  ui: {
    label: "Beta",
  },
};

export const ne_vegas: NvramProperty<boolean> = {
  key: "ne_vegas",
  description:
    "Enables the TCP Vegas congestion control algorithm for router-generated traffic, which prioritizes latency over throughput.",
  page: "qos-settings.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable TCP Vegas",
  },
};

export const ne_vgamma: NvramProperty<string> = {
  key: "ne_vgamma",
  description:
    "Gamma parameter for the TCP Vegas congestion control algorithm.",
  page: "qos-settings.asp",
  type: "string",
  defaultValue: "2",
  validation: (value) => rangeValidator(0, 65535)(parseInt(value, 10)),
  ui: {
    label: "Gamma",
  },
};

export const nf_ftp: NvramProperty<boolean> = {
  key: "nf_ftp",
  description: "Enables the connection tracking helper for the FTP protocol.",
  page: "advanced-ctnf.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "FTP",
  },
};

export const nf_h323: NvramProperty<boolean> = {
  key: "nf_h323",
  description:
    "Enables the connection tracking helper for the H.323 VoIP protocol.",
  page: "advanced-ctnf.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "H.323",
  },
};

export const nf_l7in: NvramProperty<boolean> = {
  key: "nf_l7in",
  description: "Enables Layer 7 protocol matching for inbound traffic.",
  page: "advanced-ctnf.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Inbound Layer 7",
  },
};

export const nf_loopback: NvramProperty<"0" | "1" | "2"> = {
  key: "nf_loopback",
  description: "Controls NAT loopback (hairpin NAT) functionality.",
  page: "advanced-firewall.asp",
  type: "enum",
  defaultValue: "1",
  ui: {
    label: "NAT loopback",
    options: [
      { value: "0", label: "All" },
      { value: "1", label: "Forwarded Only" },
      { value: "2", label: "Disabled" },
    ],
  },
};

export const nf_pptp: NvramProperty<boolean> = {
  key: "nf_pptp",
  description:
    "Enables the connection tracking helper for the GRE/PPTP protocol.",
  page: "advanced-ctnf.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "GRE / PPTP",
  },
};

export const nf_rtsp: NvramProperty<boolean> = {
  key: "nf_rtsp",
  description: "Enables the connection tracking helper for the RTSP protocol.",
  page: "advanced-ctnf.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "RTSP",
  },
};

export const nf_sip: NvramProperty<boolean> = {
  key: "nf_sip",
  description:
    "Enables the connection tracking helper for the SIP VoIP protocol.",
  page: "advanced-ctnf.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "SIP",
  },
};

export const nf_ttl: NvramProperty<string> = {
  key: "nf_ttl",
  description:
    "Adjusts the Time-To-Live (TTL) value of packets passing through the router. Can be a fixed increment/decrement or a custom value.",
  page: "advanced-ctnf.asp",
  type: "string",
  defaultValue: "0",
  ui: {
    label: "TTL Adjust",
  },
};

export const nfs_enable: NvramProperty<boolean> = {
  key: "nfs_enable",
  description: "Enables the NFS server.",
  page: "admin-nfs.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable NFS Server",
  },
};

export const nfs_enable_v2: NvramProperty<boolean> = {
  key: "nfs_enable_v2",
  description: "Enables support for the legacy NFSv2 protocol.",
  page: "admin-nfs.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable legacy (NFS V2) support",
  },
};

interface NfsExportEntry {
  directory: string;
  ip_subnet: string;
  access: "rw" | "ro";
  sync: "sync" | "async";
  subtree_check: "subtree_check" | "no_subtree_check";
  other_options: string;
}
export const nfs_exports: NvramProperty<NfsExportEntry[]> = {
  key: "nfs_exports",
  description:
    "A list of directories to be shared via NFS, along with their access permissions and options.",
  page: "admin-nfs.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        directory: {
          type: "string",
          label: "Directory",
          defaultValue: "",
        },
        ip_subnet: {
          type: "string",
          label: "IP/Subnet",
          defaultValue: "",
        },
        access: { type: "string", label: "Access", defaultValue: "rw" },
        sync: { type: "string", label: "Sync Mode", defaultValue: "sync" },
        subtree_check: {
          type: "string",
          label: "Subtree Check",
          defaultValue: "subtree_check",
        },
        other_options: {
          type: "string",
          label: "Other Options",
          defaultValue: "",
        },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const parts = v.split("<");
          if (parts.length !== 6) return null;
          return {
            directory: parts[0],
            ip_subnet: parts[1],
            access: parts[2] as any,
            sync: parts[3] as any,
            subtree_check: parts[4] as any,
            other_options: parts[5],
          };
        })
        .filter((v) => v !== null) as NfsExportEntry[],
    fromUi: (value) =>
      value
        .map(
          (v) =>
            `${v.directory}<${v.ip_subnet}<${v.access}<${v.sync}<${v.subtree_check}<${v.other_options}`,
        )
        .join(">"),
  },
  ui: {
    label: "Exports",
  },
};

export const nginx_custom: NvramProperty<string> = {
  key: "nginx_custom",
  description:
    "Custom configuration directives to be added to the main nginx.conf file.",
  page: "web-nginx.asp",
  type: "string",
  defaultValue: "",
  validation: (value) =>
    value.length <= 4096 || "Maximum length is 4096 characters.",
  ui: {
    label: "NGINX Custom configuration",
  },
};

export const nginx_docroot: NvramProperty<string> = {
  key: "nginx_docroot",
  description: "The root directory for the Nginx web server's content.",
  page: "web-nginx.asp",
  type: "string",
  defaultValue: "/www",
  validation: pathValidator,
  ui: {
    label: "Document Root Path",
  },
};

export const nginx_enable: NvramProperty<boolean> = {
  key: "nginx_enable",
  description: "Enables the Nginx web server to start on boot.",
  page: "web-nginx.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable on Start",
  },
};

export const nginx_fqdn: NvramProperty<string> = {
  key: "nginx_fqdn",
  description:
    "The server name (fully qualified domain name) for the Nginx web server.",
  page: "web-nginx.asp",
  type: "string",
  defaultValue: "FreshTomato",
  ui: {
    label: "Web Server Name",
  },
};

export const nginx_h5aisupport: NvramProperty<boolean> = {
  key: "nginx_h5aisupport",
  description:
    "Enables support for h5ai, a modern file indexer for web servers.",
  page: "web-nginx.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable h5ai support",
  },
};

export const nginx_httpcustom: NvramProperty<string> = {
  key: "nginx_httpcustom",
  description:
    "Custom configuration directives to be added within the 'http' block of nginx.conf.",
  page: "web-nginx.asp",
  type: "string",
  defaultValue: "",
  validation: (value) =>
    value.length <= 4096 || "Maximum length is 4096 characters.",
  ui: {
    label: "NGINX HTTP Section Custom configuration",
  },
};

export const nginx_keepconf: NvramProperty<boolean> = {
  key: "nginx_keepconf",
  description:
    "If enabled, manually edited Nginx configuration files will not be overwritten by the GUI.",
  page: "web-nginx.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Keep Config Files",
  },
};

export const nginx_override: NvramProperty<boolean> = {
  key: "nginx_override",
  description:
    "If enabled, a user-provided nginx.conf file will be used instead of the GUI-generated one.",
  page: "web-nginx.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Use user config file",
  },
};

export const nginx_overridefile: NvramProperty<string> = {
  key: "nginx_overridefile",
  description:
    "The path to the custom nginx.conf file to use when 'nginx_override' is enabled.",
  page: "web-nginx.asp",
  type: "string",
  defaultValue: "/path/to/nginx.conf",
  validation: pathValidator,
  ui: {
    label: "User config file path",
  },
};

export const nginx_php: NvramProperty<boolean> = {
  key: "nginx_php",
  description: "Enables PHP support for the Nginx web server via php-fpm.",
  page: "web-nginx.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable PHP support",
  },
};

export const nginx_phpconf: NvramProperty<string> = {
  key: "nginx_phpconf",
  description: "Custom configuration directives for the php.ini file.",
  page: "web-nginx.asp",
  type: "string",
  defaultValue: "",
  validation: (value) =>
    value.length <= 4096 || "Maximum length is 4096 characters.",
  ui: {
    label: "PHP Custom configuration",
  },
};

export const nginx_phpfpmconf: NvramProperty<string> = {
  key: "nginx_phpfpmconf",
  description: "Custom configuration directives for the php-fpm.conf file.",
  page: "web-nginx.asp",
  type: "string",
  defaultValue: "",
  validation: (value) =>
    value.length <= 4096 || "Maximum length is 4096 characters.",
  ui: {
    label: "php-fpm Custom configuration",
  },
};

export const nginx_port: NvramProperty<number> = {
  key: "nginx_port",
  description:
    "The TCP port on which the Nginx web server listens. Also used by MySQL admin interface.",
  page: "web-nginx.asp",
  type: "integer",
  defaultValue: 85,
  validation: portValidator,
  ui: {
    label: "Web Server Port",
  },
};

export const nginx_priority: NvramProperty<number> = {
  key: "nginx_priority",
  description:
    "The scheduling priority (nice value) for the Nginx process. Ranges from -20 (highest) to 19 (lowest).",
  page: "web-nginx.asp",
  type: "integer",
  defaultValue: 10,
  validation: rangeValidator(-20, 19),
  ui: {
    label: "Server Priority",
  },
};

export const nginx_remote: NvramProperty<boolean> = {
  key: "nginx_remote",
  description:
    "Allows the Nginx web server to be accessed from the WAN interface.",
  page: "web-nginx.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Allow Remote Access",
  },
};

export const nginx_upload: NvramProperty<number> = {
  key: "nginx_upload",
  description:
    "The maximum allowed size for file uploads via the Nginx server, in MB.",
  page: "web-nginx.asp",
  type: "integer",
  defaultValue: 100,
  validation: rangeValidator(0, 512),
  ui: {
    label: "Upload file size limit",
  },
};

export const nginx_user: NvramProperty<"root" | "nobody"> = {
  key: "nginx_user",
  description:
    "The user account under which the Nginx and PHP-FPM processes will run.",
  page: "web-nginx.asp",
  type: "enum",
  defaultValue: "root",
  ui: {
    label: "Run As",
    options: [
      { value: "root", label: "Root" },
      { value: "nobody", label: "Nobody" },
    ],
  },
};

export const ntp_server: NvramProperty<string> = {
  key: "ntp_server",
  description:
    "A space-separated list of NTP servers to use for time synchronization.",
  page: "basic-time.asp",
  type: "string",
  defaultValue:
    "0.north-america.pool.ntp.org 1.north-america.pool.ntp.org 2.north-america.pool.ntp.org",
  ui: {
    label: "Upstream Server",
  },
};

export const ntp_updates: NvramProperty<"-1" | "0" | "1"> = {
  key: "ntp_updates",
  description: "Controls the NTP client's behavior for time synchronization.",
  page: "basic-time.asp",
  type: "enum",
  defaultValue: "1",
  ui: {
    label: "Enable",
    options: [
      { value: "-1", label: "Off" },
      { value: "0", label: "On & Sync at startup" },
      { value: "1", label: "On & Sync periodically" },
    ],
  },
};

export const ntpd_enable: NvramProperty<"0" | "1" | "2"> = {
  key: "ntpd_enable",
  description:
    "Enables the built-in NTP server to provide time to LAN and/or WAN clients.",
  page: "basic-time.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Enable",
    options: [
      { value: "0", label: "Off" },
      { value: "1", label: "LAN" },
      { value: "2", label: "LAN & WAN" },
    ],
  },
};

export const ntpd_server_redir: NvramProperty<boolean> = {
  key: "ntpd_server_redir",
  description:
    "If enabled, all NTP requests from LAN clients will be intercepted and redirected to the router's local NTP server.",
  page: "basic-time.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Intercept NTP Requests",
  },
};

interface PbrRule {
  enabled: boolean;
  protocol: number; // -2 for Any, -1 for TCP/UDP, 6 for TCP, etc.
  srcType: 0 | 1 | 2 | 3; // 0=Any, 1=IP, 2=MAC
  srcAddr: string;
  srcPort: string;
  destType: 0 | 1 | 3; // 0=Any, 1=IP, 3=Domain
  destAddr: string;
  destPort: string;
  wan: 1 | 2 | 3 | 4; // WAN0, WAN1, etc.
  description: string;
}
export const pbr_rules: NvramProperty<PbrRule[]> = {
  key: "pbr_rules",
  description:
    "A list of Policy-Based Routing rules to direct specific traffic through a designated WAN interface.",
  page: "advanced-pbr.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        enabled: { type: "boolean", label: "Enabled", defaultValue: false },
        protocol: { type: "integer", label: "Protocol", defaultValue: -2 },
        srcType: {
          type: "integer",
          label: "Source Type",
          defaultValue: 0,
        },
        srcAddr: {
          type: "string",
          label: "Source Address",
          defaultValue: "",
        },
        srcPort: {
          type: "string",
          label: "Source Port",
          defaultValue: "",
        },
        destType: {
          type: "integer",
          label: "Destination Type",
          defaultValue: 0,
        },
        destAddr: {
          type: "string",
          label: "Destination Address",
          defaultValue: "",
        },
        destPort: {
          type: "string",
          label: "Destination Port",
          defaultValue: "",
        },
        wan: { type: "integer", label: "WAN", defaultValue: 1 },
        description: {
          type: "string",
          label: "Description",
          defaultValue: "",
        },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const p = v.split("<");
          if (p.length !== 10) return null;
          return {
            enabled: p[0] === "1",
            protocol: parseInt(p[1]!, 10),
            srcType: parseInt(p[2]!, 10) as any,
            srcAddr: p[3]!,
            srcPort: p[4]!.replace(/:/g, "-"),
            destType: parseInt(p[5]!, 10) as any,
            destAddr: p[6]!,
            destPort: p[7]!.replace(/:/g, "-"),
            wan: parseInt(p[8]!, 10) as any,
            description: unescape(p[9]!),
          };
        })
        .filter((v) => v !== null) as PbrRule[],
    fromUi: (value) =>
      value
        .map((v) =>
          [
            v.enabled ? "1" : "0",
            v.protocol,
            v.srcType,
            v.srcAddr,
            v.srcPort.replace(/-/g, ":"),
            v.destType,
            v.destAddr,
            v.destPort.replace(/-/g, ":"),
            v.wan,
            escape(v.description),
          ].join("<"),
        )
        .join(">"),
  },
  ui: {
    label: "Rules",
  },
};

export const pci_wl_country_code: PatternedNvramProperty<
  { pci_id: 1 | 2 | 3 },
  string
> = {
  getKey: (params) => `pci/${params.pci_id}/1/ccode`,
  regex: /^pci\/([1-3])\/1\/ccode$/,
  parameters: {
    pci_id: {
      type: "integer",
      description: "PCI bus ID for the wireless card",
      range: [1, 3],
    },
  },
  description:
    "PCI-specific wireless country code. This is a lower-level setting often mirrored by `wlX_country_code`.",
  page: "advanced-wireless.asp",
  type: "enum",
};

export const pci_wl_country_rev: PatternedNvramProperty<
  { pci_id: 1 | 2 | 3 },
  number
> = {
  getKey: (params) => `pci/${params.pci_id}/1/regrev`,
  regex: /^pci\/([1-3])\/1\/regrev$/,
  parameters: {
    pci_id: {
      type: "integer",
      description: "PCI bus ID for the wireless card",
      range: [1, 3],
    },
  },
  description: "PCI-specific wireless country revision number.",
  page: "advanced-wireless.asp",
  type: "integer",
  validation: (value) => (value >= 0 && value <= 999) || "Valid range: 0 - 999",
};

interface PortForwardRule {
  enabled: boolean;
  protocol: 1 | 2 | 3; // TCP, UDP, Both
  srcAddr: string;
  extPorts: string;
  intPort?: number;
  intAddr: string;
  description: string;
}
export const portforward: NvramProperty<PortForwardRule[]> = {
  key: "portforward",
  description: "A list of port forwarding rules.",
  page: "forward-basic.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        enabled: { type: "boolean", label: "Enabled", defaultValue: false },
        protocol: { type: "integer", label: "Protocol", defaultValue: 3 },
        srcAddr: {
          type: "string",
          label: "Source Address",
          defaultValue: "",
        },
        extPorts: {
          type: "string",
          label: "External Ports",
          defaultValue: "",
        },
        intPort: {
          type: "integer",
          label: "Internal Port",
          defaultValue: 0,
          optional: true,
        },
        intAddr: {
          type: "string",
          label: "Internal Address",
          defaultValue: "",
        },
        description: {
          type: "string",
          label: "Description",
          defaultValue: "",
        },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const p = v.split("<");
          if (p.length !== 7) return null;
          return {
            enabled: p[0] === "1",
            protocol: parseInt(p[1]!, 10) as any,
            srcAddr: p[2]!,
            extPorts: p[3]!.replace(/:/g, "-"),
            intPort: p[4] ? parseInt(p[4], 10) : undefined,
            intAddr: p[5]!,
            description: p[6]!,
          };
        })
        .filter((v) => v !== null) as PortForwardRule[],
    fromUi: (value) =>
      value
        .map((v) =>
          [
            v.enabled ? "1" : "0",
            v.protocol,
            v.srcAddr,
            (v.extPorts || "").replace(/-/g, ":"),
            v.intPort || "",
            v.intAddr,
            v.description,
          ].join("<"),
        )
        .join(">"),
  },
  ui: {
    label: "Port Forwarding",
  },
};

export const pptp_client_crypt: NvramProperty<"0" | "1" | "2" | "3"> = {
  key: "pptp_client_crypt",
  description: "Specifies the encryption level for the PPTP client connection.",
  page: "vpn-pptp.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Encryption",
    options: [
      { value: "0", label: "Auto" },
      { value: "1", label: "None" },
      { value: "2", label: "Maximum (128 bit only)" },
      { value: "3", label: "Required (128 or 40 bit)" },
    ],
  },
};

export const pptp_client_custom: NvramProperty<string> = {
  key: "pptp_client_custom",
  description: "Custom options for the PPTP client.",
  page: "vpn-pptp.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Custom Configuration",
  },
};

export const pptp_client_dfltroute: NvramProperty<boolean> = {
  key: "pptp_client_dfltroute",
  description:
    "If enabled, redirects all internet traffic through the PPTP tunnel.",
  page: "vpn-pptp.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Redirect Internet traffic",
  },
};

export const pptp_client_eas: NvramProperty<boolean> = {
  key: "pptp_client_eas",
  description: "Enables the PPTP client to start on boot.",
  page: "vpn-pptp.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable on Start",
  },
};

export const pptp_client_mppeopt: NvramProperty<string> = {
  key: "pptp_client_mppeopt",
  description:
    "Microsoft Point-to-Point Encryption (MPPE) options for the PPTP client. (Note: Not directly configurable in the UI shown, but is part of PPTP).",
  page: "vpn-pptp.asp",
  type: "string",
  defaultValue: "",
};

export const pptp_client_mru: NvramProperty<string> = {
  key: "pptp_client_mru",
  description: "Maximum Receive Unit for the PPTP client connection.",
  page: "vpn-pptp.asp",
  type: "string",
  defaultValue: "1400",
  validation: (value) => rangeValidator(576, 1500)(parseInt(value, 10)),
  ui: {
    label: "MRU",
  },
};

export const pptp_client_mruenable: NvramProperty<"0" | "1"> = {
  key: "pptp_client_mruenable",
  description:
    "Enables manual configuration of the Maximum Receive Unit (MRU).",
  page: "vpn-pptp.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "MRU",
    options: [
      { value: "0", label: "Default" },
      { value: "1", label: "Manual" },
    ],
  },
};

export const pptp_client_mtu: NvramProperty<string> = {
  key: "pptp_client_mtu",
  description: "Maximum Transmission Unit for the PPTP client connection.",
  page: "vpn-pptp.asp",
  type: "string",
  defaultValue: "1400",
  validation: (value) => rangeValidator(576, 1500)(parseInt(value, 10)),
  ui: {
    label: "MTU",
  },
};

export const pptp_client_mtuenable: NvramProperty<"0" | "1"> = {
  key: "pptp_client_mtuenable",
  description:
    "Enables manual configuration of the Maximum Transmission Unit (MTU).",
  page: "vpn-pptp.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "MTU",
    options: [
      { value: "0", label: "Default" },
      { value: "1", label: "Manual" },
    ],
  },
};

export const pptp_client_nat: NvramProperty<boolean> = {
  key: "pptp_client_nat",
  description:
    "Creates NAT on the PPTP tunnel, allowing LAN clients to access the internet through the VPN.",
  page: "vpn-pptp.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Create NAT on tunnel",
  },
};

export const pptp_client_passwd: NvramProperty<string> = {
  key: "pptp_client_passwd",
  description: "The password for the PPTP client connection.",
  page: "vpn-pptp.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Password ",
  },
};

export const pptp_client_peerdns: NvramProperty<"0" | "1" | "2"> = {
  key: "pptp_client_peerdns",
  description: "Controls how DNS servers provided by the PPTP server are used.",
  page: "vpn-pptp.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Accept DNS configuration",
    options: [
      { value: "0", label: "Disabled" },
      { value: "1", label: "Yes" },
      { value: "2", label: "Exclusive" },
    ],
  },
};

export const pptp_client_srvip: NvramProperty<string> = {
  key: "pptp_client_srvip",
  description: "The IP address or domain name of the remote PPTP server.",
  page: "vpn-pptp.asp",
  type: "string",
  defaultValue: "",
  validation: (value) => {
    if (value === "") return true; // Can be empty if not enabled
    const ipRegex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\\.[a-zA-Z]{2,})+$/;
    return (
      ipRegex.test(value) ||
      domainRegex.test(value) ||
      "Invalid server address."
    );
  },
  ui: {
    label: "Server Address",
  },
};

export const pptp_client_srvsub: NvramProperty<string> = {
  key: "pptp_client_srvsub",
  description:
    "The network address of the remote subnet to be routed through the PPTP tunnel.",
  page: "vpn-pptp.asp",
  type: "ip",
  defaultValue: "10.0.0.0",
  ui: {
    label: "Remote subnet / netmask",
  },
};

export const pptp_client_srvsubmsk: NvramProperty<string> = {
  key: "pptp_client_srvsubmsk",
  description: "The netmask of the remote subnet.",
  page: "vpn-pptp.asp",
  type: "netmask",
  defaultValue: "255.0.0.0",
};

export const pptp_client_stateless: NvramProperty<boolean> = {
  key: "pptp_client_stateless",
  description: "Enables stateless MPPE connection mode.",
  page: "vpn-pptp.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Stateless MPPE connection",
  },
};

export const pptp_client_username: NvramProperty<string> = {
  key: "pptp_client_username",
  description: "The username for the PPTP client connection.",
  page: "vpn-pptp.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Username ",
  },
};

export const pptp_client_usewan: NvramProperty<
  "wan" | "wan2" | "wan3" | "wan4" | "none"
> = {
  key: "pptp_client_usewan",
  description: "Binds the PPTP client to a specific WAN interface.",
  page: "vpn-pptp.asp",
  type: "enum",
  defaultValue: "none",
  ui: {
    label: "Bind to",
    options: [
      { value: "wan", label: "WAN0" },
      { value: "wan2", label: "WAN1" },
      { value: "wan3", label: "WAN2" },
      { value: "wan4", label: "WAN3" },
      { value: "none", label: "none" },
    ],
  },
};

export const pptpd_broadcast: NvramProperty<
  "disable" | "br0" | "ppp" | "br0ppp"
> = {
  key: "pptpd_broadcast",
  description:
    "Controls broadcast relay mode between the LAN and connected VPN clients.",
  page: "vpn-pptp-server.asp",
  type: "enum",
  defaultValue: "disable",
  ui: {
    label: "Broadcast Relay Mode",
    options: [
      { value: "disable", label: "Disabled" },
      { value: "br0", label: "LAN to VPN Clients" },
      { value: "ppp", label: "VPN Clients to LAN" },
      { value: "br0ppp", label: "Both" },
    ],
  },
};

export const pptpd_chap: NvramProperty<"0" | "1" | "2"> = {
  key: "pptpd_chap",
  description:
    "Specifies the required CHAP authentication method for the PPTP server.",
  page: "vpn-pptp-server.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Authentication",
    options: [
      { value: "0", label: "Auto" },
      { value: "1", label: "MS-CHAPv1" },
      { value: "2", label: "MS-CHAPv2" },
    ],
  },
};

export const pptpd_custom: NvramProperty<string> = {
  key: "pptpd_custom",
  description:
    "Custom configuration options for the PoPToP (PPTP server) daemon.",
  page: "vpn-pptp-server.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Poptop Custom configuration",
  },
};

export const pptpd_dns1: NvramProperty<string> = {
  key: "pptpd_dns1",
  description: "Primary DNS server IP to be assigned to PPTP clients.",
  page: "vpn-pptp-server.asp",
  type: "ip",
  defaultValue: "",
  ui: {
    label: "DNS Servers",
  },
};

export const pptpd_dns2: NvramProperty<string> = {
  key: "pptpd_dns2",
  description: "Secondary DNS server IP to be assigned to PPTP clients.",
  page: "vpn-pptp-server.asp",
  type: "ip",
  defaultValue: "",
};

export const pptpd_enable: NvramProperty<boolean> = {
  key: "pptpd_enable",
  description: "Enables the PPTP server to start on boot.",
  page: "vpn-pptp-server.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable on Start",
  },
};

export const pptpd_forcemppe: NvramProperty<"0" | "1"> = {
  key: "pptpd_forcemppe",
  description:
    "Specifies the required MPPE encryption level for the PPTP server.",
  page: "vpn-pptp-server.asp",
  type: "enum",
  defaultValue: "1",
  ui: {
    label: "Encryption",
    options: [
      { value: "0", label: "None" },
      { value: "1", label: "MPPE-128" },
    ],
  },
};

export const pptpd_mru: NvramProperty<string> = {
  key: "pptpd_mru",
  description: "Maximum Receive Unit for the PPTP server connections.",
  page: "vpn-pptp-server.asp",
  type: "string",
  defaultValue: "1400",
  validation: (value) => rangeValidator(576, 1500)(parseInt(value, 10)),
  ui: {
    label: "MRU",
  },
};

export const pptpd_mtu: NvramProperty<string> = {
  key: "pptpd_mtu",
  description: "Maximum Transmission Unit for the PPTP server connections.",
  page: "vpn-pptp-server.asp",
  type: "string",
  defaultValue: "1400",
  validation: (value) => rangeValidator(576, 1500)(parseInt(value, 10)),
  ui: {
    label: "MTU",
  },
};

export const pptpd_remoteip: NvramProperty<string> = {
  key: "pptpd_remoteip",
  description:
    "The range of IP addresses to assign to connecting PPTP clients, in the format 'start_ip-end_octet'.",
  page: "vpn-pptp-server.asp",
  type: "string",
  defaultValue: "172.19.0.1-6",
  ui: {
    label: "Remote IP Address Range",
  },
};

interface PptpdUser {
  username: string;
  password?: string;
}
export const pptpd_users: NvramProperty<PptpdUser[]> = {
  key: "pptpd_users",
  description:
    "A list of username/password pairs for PPTP server authentication.",
  page: "vpn-pptp-server.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        username: { type: "string", label: "Username", defaultValue: "" },
        password: {
          type: "string",
          label: "Password",
          defaultValue: "",
          optional: true,
        },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const parts = v.split("<");
          return { username: parts[0] || "", password: parts[1] || "" };
        }),
    fromUi: (value) =>
      value.map((v) => `${v.username}<${v.password}`).join(">"),
  },
  ui: {
    label: "PPTP User List",
  },
};

export const pptpd_wins1: NvramProperty<string> = {
  key: "pptpd_wins1",
  description: "Primary WINS server IP to be assigned to PPTP clients.",
  page: "vpn-pptp-server.asp",
  type: "ip",
  defaultValue: "",
  ui: {
    label: "WINS Servers",
  },
};

export const pptpd_wins2: NvramProperty<string> = {
  key: "pptpd_wins2",
  description: "Secondary WINS server IP to be assigned to PPTP clients.",
  page: "vpn-pptp-server.asp",
  type: "ip",
  defaultValue: "",
};

export const qos_ack: NvramProperty<boolean> = {
  key: "qos_ack",
  description: "Prioritizes small TCP ACK packets to improve download speeds.",
  page: "qos-settings.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "ACK",
  },
};

export const qos_cake_prio_mode: NvramProperty<"0" | "1" | "2" | "3" | "4"> = {
  key: "qos_cake_prio_mode",
  description: "Sets the priority queue mode for the CAKE AQM scheduler.",
  page: "qos-settings.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "CAKE mode",
    options: [
      {
        value: "0",
        label: "Single class [besteffort] - no classification is involved",
      },
      { value: "1", label: "8 priority classes [diffserv8] - DSCP" },
      { value: "2", label: "4 priority classes [diffserv4] - DSCP" },
      { value: "3", label: "3 priority classes [diffserv3] - DSCP" },
      {
        value: "4",
        label: "8 priority classes [precedence] - ToS based - discouraged",
      },
    ],
  },
};

export const qos_cake_wash: NvramProperty<boolean> = {
  key: "qos_cake_wash",
  description:
    "When using CAKE, forces the clearing of DSCP markings from inbound packets.",
  page: "qos-settings.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "CAKE wash",
  },
};

export const qos_classify: NvramProperty<boolean> = {
  key: "qos_classify",
  description:
    "Enables traffic classification based on rules defined on the QoS Classification page.",
  page: "qos-settings.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Classify traffic",
  },
};

export const qos_classnames: NvramProperty<string> = {
  key: "qos_classnames",
  description: "A space-separated list of names for the 10 QoS classes.",
  page: "qos-settings.asp",
  type: "string",
  defaultValue:
    "Service VOIP/Game Remote WWW Media HTTPS/Msgr Mail FileXfer P2P/Bulk Crawl",
  ui: {
    label: "Custom Class Names",
  },
};

export const qos_default: NvramProperty<string> = {
  key: "qos_default",
  description:
    "The default QoS class (0-9) to assign to traffic that does not match any classification rule.",
  page: "qos-settings.asp",
  type: "enum",
  defaultValue: "8",
  // Note: Options are dynamically generated from `qos_classnames`.
  ui: {
    label: "Default class",
  },
};

export const qos_enable: NvramProperty<boolean> = {
  key: "qos_enable",
  description:
    "Globally enables or disables the Quality of Service (QoS) engine.",
  page: "qos-settings.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable QoS",
  },
};

export const qos_fin: NvramProperty<boolean> = {
  key: "qos_fin",
  description: "Prioritizes small TCP FIN packets.",
  page: "qos-settings.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "FIN",
  },
};

export const qos_icmp: NvramProperty<boolean> = {
  key: "qos_icmp",
  description:
    "Prioritizes ICMP packets, which can improve ping times and network diagnostics.",
  page: "qos-settings.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Prioritize ICMP",
  },
};

export const qos_irates: NvramProperty<string> = {
  key: "qos_irates",
  description:
    "A comma-separated list of 'rate-ceiling' percentage pairs for each of the 10 inbound QoS classes.",
  page: "qos-settings.asp",
  type: "string",
  defaultValue: "5-100,2-20,5-100,10-90,20-90,5-90,5-70,5-100,5-30,1-1",
  ui: {
    label: "Inbound settings",
  },
};

export const qos_mode: NvramProperty<"1" | "2"> = {
  key: "qos_mode",
  description:
    "Selects the QoS engine: HTB for traditional shaping or CAKE for modern AQM.",
  page: "qos-settings.asp",
  type: "enum",
  defaultValue: "1",
  ui: {
    label: "QoS mode",
    options: [
      { value: "1", label: "HTB limiter + leaf qdisc scheduler (classic/SQM)" },
      { value: "2", label: "CAKE AQM" },
    ],
  },
};

export const qos_orates: NvramProperty<string> = {
  key: "qos_orates",
  description:
    "A comma-separated list of 'rate-ceiling' percentage pairs for each of the 10 outbound QoS classes.",
  page: "qos-settings.asp",
  type: "string",
  defaultValue: "5-100,5-30,5-100,5-70,5-70,5-70,5-70,5-100,5-30,1-1",
  ui: {
    label: "Outbound settings",
  },
};

interface QosRule {
  addrType: 0 | 1 | 2 | 3; // Any, Dst IP, Src IP, Src MAC
  addr: string;
  proto: number;
  portMode: "a" | "d" | "s" | "x"; // Any, Dst, Src, Src or Dst
  port: string;
  ipp2p: number;
  layer7: string;
  transferredStart: string;
  transferredEnd: string;
  dscp: string;
  class: number;
  description: string;
}

export const qos_orules: NvramProperty<QosRule[]> = {
  key: "qos_orules",
  description:
    "A list of rules used to classify traffic into different QoS classes.",
  page: "qos-classify.asp",
  type: "structured-string",
  defaultValue: [
    {
      addrType: 0,
      addr: "",
      proto: -1,
      portMode: "d",
      port: "53",
      ipp2p: 0,
      layer7: "",
      transferredStart: "",
      transferredEnd: "",
      dscp: "",
      class: 0,
      description: "DNS",
    },
  ],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        addrType: {
          type: "integer",
          label: "Address Type",
          defaultValue: 0,
        },
        addr: { type: "string", label: "Address", defaultValue: "" },
        proto: { type: "integer", label: "Protocol", defaultValue: -1 },
        portMode: {
          type: "string",
          label: "Port Mode",
          defaultValue: "d",
        },
        port: { type: "string", label: "Port", defaultValue: "" },
        ipp2p: { type: "integer", label: "IPP2P", defaultValue: 0 },
        layer7: { type: "string", label: "Layer7", defaultValue: "" },
        transferredStart: {
          type: "string",
          label: "Transferred Start",
          defaultValue: "",
        },
        transferredEnd: {
          type: "string",
          label: "Transferred End",
          defaultValue: "",
          optional: true,
        },
        dscp: { type: "string", label: "DSCP", defaultValue: "" },
        class: { type: "integer", label: "Class", defaultValue: 0 },
        description: {
          type: "string",
          label: "Description",
          defaultValue: "",
        },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const p = v.split("<");
          if (p.length !== 11) return null;
          const [transferredStart, transferredEnd] = (p[7] || "").split(":");
          return {
            addrType: parseInt(p[0]!, 10) as any,
            addr: p[1]!,
            proto: parseInt(p[2]!, 10),
            portMode: p[3]! as any,
            port: p[4]!.replace(/:/g, "-"),
            ipp2p: parseInt(p[5]!, 10),
            layer7: p[6]!,
            transferredStart,
            transferredEnd: transferredEnd || "",
            dscp: p[8]!,
            class: parseInt(p[9]!, 10),
            description: unescape(p[10]!),
          };
        })
        .filter((v) => v !== null) as QosRule[],
    fromUi: (value) =>
      value
        .map((v) =>
          [
            v.addrType,
            v.addr,
            v.proto,
            v.portMode,
            (v.port || "").replace(/-/g, ":"),
            v.ipp2p,
            v.layer7,
            v.transferredEnd
              ? `${v.transferredStart || ""}:${v.transferredEnd}`
              : v.transferredStart,
            v.dscp,
            v.class,
            escape(v.description),
          ].join("<"),
        )
        .join(">"),
  },
  ui: {
    label: "Traffic classification",
  },
};

export const qos_pfifo: NvramProperty<"0" | "1" | "2" | "3"> = {
  key: "qos_pfifo",
  description: "Selects the queuing discipline scheduler to use with HTB QoS.",
  page: "qos-settings.asp",
  type: "enum",
  defaultValue: "3",
  ui: {
    label: "Qdisc Scheduler",
    options: [
      { value: "0", label: "sfq" },
      { value: "1", label: "pfifo" },
      { value: "2", label: "codel" },
      { value: "3", label: "fq_codel" },
    ],
  },
};

export const qos_reset: NvramProperty<boolean> = {
  key: "qos_reset",
  description:
    "If enabled, QoS classes and rules will be reset when settings are changed.",
  page: "qos-settings.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Reset class when changing settings",
  },
};

export const qos_rst: NvramProperty<boolean> = {
  key: "qos_rst",
  description: "Prioritizes small TCP RST packets.",
  page: "qos-settings.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "RST",
  },
};

export const qos_syn: NvramProperty<boolean> = {
  key: "qos_syn",
  description:
    "Prioritizes small TCP SYN packets to improve connection establishment times.",
  page: "qos-settings.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "SYN",
  },
};

export const qos_udp: NvramProperty<boolean> = {
  key: "qos_udp",
  description:
    "If enabled, inbound UDP traffic will not be processed by the QoS engine.",
  page: "qos-settings.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "No Ingress QoS for UDP",
  },
};

export const remote_management: NvramProperty<boolean> = {
  key: "remote_management",
  description:
    "Globally enables or disables remote access to the router's web interface from the WAN. The UI combines this with `remote_mgt_https`.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
};

export const remote_mgt_https: NvramProperty<boolean> = {
  key: "remote_mgt_https",
  description:
    "If remote management is enabled, this setting specifies whether to use HTTPS (1) or HTTP (0).",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
};

export const remote_upgrade: NvramProperty<boolean> = {
  key: "remote_upgrade",
  description:
    "Allows firmware upgrades to be performed via the remote web interface. Disabling this reduces the memory footprint during an upgrade.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Allow Remote Upgrade",
  },
};

export const rmgt_sip: NvramProperty<string> = {
  key: "rmgt_sip",
  description:
    "A comma-separated list of source IP addresses or ranges that are allowed to access the remote management interface.",
  page: "admin-access.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Allowed Remote IP Address",
  },
};

export const router_name: NvramProperty<string> = {
  key: "router_name",
  description:
    "A user-defined name for the router, used for local identification purposes in the web UI.",
  page: "basic-ident.asp",
  type: "string",
  defaultValue: "FreshTomato",
  validation: (value) =>
    (value.length >= 1 && value.length <= 32) ||
    "Must be between 1 and 32 characters.",
  ui: {
    label: "Router Name",
  },
};

interface StaticRoute {
  destination: string;
  gateway: string;
  netmask: string;
  metric: number;
  interface: string;
  description: string;
}
export const routes_static: NvramProperty<StaticRoute[]> = {
  key: "routes_static",
  description: "A list of user-defined static routes.",
  page: "advanced-routing.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        destination: {
          type: "string",
          label: "Destination",
          defaultValue: "",
        },
        gateway: { type: "string", label: "Gateway", defaultValue: "" },
        netmask: { type: "string", label: "Netmask", defaultValue: "" },
        metric: { type: "integer", label: "Metric", defaultValue: 0 },
        interface: { type: "string", label: "Interface", defaultValue: "" },
        description: {
          type: "string",
          label: "Description",
          defaultValue: "",
        },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const p = v.split("<");
          if (p.length !== 6) return null;
          return {
            destination: p[0]!,
            gateway: p[1]!,
            netmask: p[2]!,
            metric: parseInt(p[3]!, 10),
            interface: p[4]!,
            description: p[5]!,
          };
        })
        .filter((v) => v !== null) as StaticRoute[],
    fromUi: (value) =>
      value
        .map(
          (v) =>
            `${v.destination}<${v.gateway}<${v.netmask}<${v.metric}<${v.interface}<${v.description}`,
        )
        .join(">"),
  },
  ui: {
    label: "Static Routing Table",
  },
};

export const rstats_bak: NvramProperty<boolean> = {
  key: "rstats_bak",
  description:
    "If enabled, creates backups of the bandwidth monitoring data file.",
  page: "admin-bwm.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Create Backups",
  },
};

export const rstats_enable: NvramProperty<boolean> = {
  key: "rstats_enable",
  description: "Enables the bandwidth monitoring feature (rstats).",
  page: "admin-bwm.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Enable",
  },
};

export const rstats_exclude: NvramProperty<string[]> = {
  key: "rstats_exclude",
  description:
    "A comma-separated list of network interfaces to exclude from bandwidth monitoring.",
  page: "admin-bwm.asp",
  type: "list",
  defaultValue: [],
  transform: {
    toUi: (v) => (v ? v.split(",") : []),
    fromUi: (v) => v.join(","),
  },
  ui: {
    label: "Excluded Interfaces",
  },
};

export const rstats_offset: NvramProperty<number> = {
  key: "rstats_offset",
  description:
    "The day of the month (1-31) to consider as the start of the monthly billing cycle for bandwidth monitoring.",
  page: "admin-bwm.asp",
  type: "integer",
  defaultValue: 1,
  validation: rangeValidator(1, 31),
  ui: {
    label: "First Day Of The Month",
  },
};

export const rstats_path: NvramProperty<string> = {
  key: "rstats_path",
  description:
    "The location to save the bandwidth monitoring history file. Can be RAM, NVRAM, JFFS, CIFS, or a custom path.",
  page: "admin-bwm.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Save History Location",
  },
};

export const rstats_sshut: NvramProperty<boolean> = {
  key: "rstats_sshut",
  description:
    "If enabled, saves the current bandwidth monitoring data to the storage location upon router shutdown or reboot.",
  page: "admin-bwm.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Save On Halt/Reboot",
  },
};

export const rstats_stime: NvramProperty<number> = {
  key: "rstats_stime",
  description:
    "The frequency in hours at which bandwidth monitoring data is saved to permanent storage.",
  page: "admin-bwm.asp",
  type: "enum",
  defaultValue: 48,
  ui: {
    label: "Save Frequency",
    options: [
      { value: 1, label: "Every Hour" },
      { value: 2, label: "Every 2 Hours" },
      { value: 3, label: "Every 3 Hours" },
      { value: 4, label: "Every 4 Hours" },
      { value: 5, label: "Every 5 Hours" },
      { value: 6, label: "Every 6 Hours" },
      { value: 9, label: "Every 9 Hours" },
      { value: 12, label: "Every 12 Hours" },
      { value: 24, label: "Every 24 Hours" },
      { value: 48, label: "Every 2 Days" },
      { value: 72, label: "Every 3 Days" },
      { value: 96, label: "Every 4 Days" },
      { value: 120, label: "Every 5 Days" },
      { value: 144, label: "Every 6 Days" },
      { value: 168, label: "Every Week" },
    ],
  },
};

interface Schedule {
  enabled: boolean;
  time: number; // minutes from midnight, or negative for 'every X minutes'
  days: number; // bitmask for days of the week
}
const scheduleTransformer: ValueTransformer<Schedule> = {
  toUi: (value: NvramValue): Schedule => {
    const parts = value.split(",");
    return {
      enabled: parts[0] === "1",
      time: parseInt(parts[1] || "0", 10),
      days: parseInt(parts[2] || "0", 10),
    };
  },
  fromUi: (value: Schedule): NvramValue => {
    return `${value.enabled ? "1" : "0"},${value.time},${value.days}`;
  },
};

const scheduleProperty = (
  key: string,
  page: string,
  description: string,
): NvramProperty<Schedule> => ({
  key,
  description,
  page,
  type: "structured-string",
  defaultValue: { enabled: false, time: 0, days: 0 },
  structuredSchema: {
    kind: "object",
    fields: {
      enabled: { type: "boolean", label: "Enabled", defaultValue: false },
      time: { type: "integer", label: "Time", defaultValue: 0 },
      days: { type: "integer", label: "Days Mask", defaultValue: 0 },
    },
  },
  transform: scheduleTransformer,
});

export const sch_c1 = scheduleProperty(
  "sch_c1",
  "admin-sched.asp",
  "Schedule for Custom Script 1.",
);
export const sch_c1_cmd: NvramProperty<string> = {
  key: "sch_c1_cmd",
  description: "Command for Custom Script 1.",
  page: "admin-sched.asp",
  type: "string",
};
export const sch_c2 = scheduleProperty(
  "sch_c2",
  "admin-sched.asp",
  "Schedule for Custom Script 2.",
);
export const sch_c2_cmd: NvramProperty<string> = {
  key: "sch_c2_cmd",
  description: "Command for Custom Script 2.",
  page: "admin-sched.asp",
  type: "string",
};
export const sch_c3 = scheduleProperty(
  "sch_c3",
  "admin-sched.asp",
  "Schedule for Custom Script 3.",
);
export const sch_c3_cmd: NvramProperty<string> = {
  key: "sch_c3_cmd",
  description: "Command for Custom Script 3.",
  page: "admin-sched.asp",
  type: "string",
};
export const sch_c4 = scheduleProperty(
  "sch_c4",
  "admin-sched.asp",
  "Schedule for Custom Script 4.",
);
export const sch_c4_cmd: NvramProperty<string> = {
  key: "sch_c4_cmd",
  description: "Command for Custom Script 4.",
  page: "admin-sched.asp",
  type: "string",
};
export const sch_c5 = scheduleProperty(
  "sch_c5",
  "admin-sched.asp",
  "Schedule for Custom Script 5.",
);
export const sch_c5_cmd: NvramProperty<string> = {
  key: "sch_c5_cmd",
  description: "Command for Custom Script 5.",
  page: "admin-sched.asp",
  type: "string",
};
export const sch_rboot = scheduleProperty(
  "sch_rboot",
  "admin-sched.asp",
  "Schedule for automatic reboots.",
);
export const sch_rcon = scheduleProperty(
  "sch_rcon",
  "admin-sched.asp",
  "Schedule for automatic WAN reconnections.",
);

// --- from admin-scripts.asp ---

export const script_init: NvramProperty<string> = {
  key: "script_init",
  description:
    "A shell script that runs once after the router has finished booting and all services are started.",
  page: "admin-scripts.asp",
  type: "multiline-string",
  defaultValue: "",
  validation: (value) =>
    value.length <= 4096 || "Maximum length is 4096 characters.",
  ui: {
    label: "Init",
  },
};

export const script_shut: NvramProperty<string> = {
  key: "script_shut",
  description:
    "A shell script that runs just before the router shuts down or reboots.",
  page: "admin-scripts.asp",
  type: "multiline-string",
  defaultValue: "",
  validation: (value) =>
    value.length <= 4096 || "Maximum length is 4096 characters.",
  ui: {
    label: "Halt",
  },
};

export const script_usbhotplug: NvramProperty<string> = {
  key: "script_usbhotplug",
  description: "A script that runs when any USB device is attached or removed.",
  page: "nas-usb.asp",
  type: "multiline-string",
  defaultValue: "",
  validation: (value) =>
    value.length <= 2048 || "Maximum length is 2048 characters.",
  ui: {
    label: "Hotplug script",
  },
};

export const script_usbmount: NvramProperty<string> = {
  key: "script_usbmount",
  description:
    "A script that runs after a USB storage device is successfully mounted.",
  page: "nas-usb.asp",
  type: "multiline-string",
  defaultValue: "",
  validation: (value) =>
    value.length <= 2048 || "Maximum length is 2048 characters.",
  ui: {
    label: "Run after mounting",
  },
};

export const script_usbumount: NvramProperty<string> = {
  key: "script_usbumount",
  description:
    "A script that runs just before a USB storage device is unmounted.",
  page: "nas-usb.asp",
  type: "multiline-string",
  defaultValue: "",
  validation: (value) =>
    value.length <= 2048 || "Maximum length is 2048 characters.",
  ui: {
    label: "Run before unmounting",
  },
};

export const script_fire: NvramProperty<string> = {
  key: "script_fire",
  description:
    "A shell script that is executed when the firewall is started or restarted.",
  page: "admin-scripts.asp",
  type: "multiline-string",
  defaultValue: "",
  validation: (value) => v_length(value, 0, 8192),
  ui: {
    label: "Firewall",
  },
};

export const script_wanup: NvramProperty<string> = {
  key: "script_wanup",
  description:
    "A shell script that is executed after the main WAN interface (WAN0) comes up.",
  page: "admin-scripts.asp",
  type: "multiline-string",
  defaultValue: "",
  validation: (value) => v_length(value, 0, 4096),
  ui: {
    label: "WAN Up (main)",
  },
};

const buttonActionOptions: ReadonlyArray<
  NvramOption<"0" | "1" | "2" | "3" | "4" | "5">
> = [
  { value: "0", label: "Do Nothing" },
  { value: "1", label: "Toggle Wireless" },
  { value: "2", label: "Reboot" },
  { value: "3", label: "Halt" },
  { value: "5", label: "Unmount all USB Drives" },
  { value: "4", label: "Run Custom Script" },
];

export const sesx_b0: NvramProperty<"0" | "1" | "2" | "3" | "4" | "5"> = {
  key: "sesx_b0",
  description: "Action for a 1-2 second press of the SES/WPS/AOSS button.",
  page: "admin-buttons.asp",
  type: "enum",
  defaultValue: "1",
  validation: buttonActionValidator,
  ui: {
    label: "1-2 Seconds",
    options: buttonActionOptions,
  },
};

export const sesx_b1: NvramProperty<"0" | "1" | "2" | "3" | "4" | "5"> = {
  key: "sesx_b1",
  description: "Action for a 4-6 second press of the SES/WPS/AOSS button.",
  page: "admin-buttons.asp",
  type: "enum",
  defaultValue: "4",
  validation: buttonActionValidator,
  ui: {
    label: "4-6 Seconds",
    options: buttonActionOptions,
  },
};

export const sesx_b2: NvramProperty<"0" | "1" | "2" | "3" | "4" | "5"> = {
  key: "sesx_b2",
  description: "Action for an 8-10 second press of the SES/WPS/AOSS button.",
  page: "admin-buttons.asp",
  type: "enum",
  defaultValue: "4",
  validation: buttonActionValidator,
  ui: {
    label: "8-10 Seconds",
    options: buttonActionOptions,
  },
};

export const sesx_b3: NvramProperty<"0" | "1" | "2" | "3" | "4" | "5"> = {
  key: "sesx_b3",
  description: "Action for a 12+ second press of the SES/WPS/AOSS button.",
  page: "admin-buttons.asp",
  type: "enum",
  defaultValue: "4",
  validation: buttonActionValidator,
  ui: {
    label: "12+ Seconds",
    options: buttonActionOptions,
  },
};

export const sesx_led: NvramProperty<number> = {
  key: "sesx_led",
  description:
    "A bitmask controlling which LEDs are enabled at startup. 1=Amber, 2=White, 4=AOSS, 8=Bridge.",
  page: "admin-buttons.asp",
  type: "integer",
  defaultValue: 12,
  ui: {
    label: "Startup LED",
  },
};

export const sesx_script: NvramProperty<string> = {
  key: "sesx_script",
  description:
    "The custom script to be executed when a button press action is set to 'Run Custom Script'.",
  page: "admin-buttons.asp",
  type: "multiline-string",
  defaultValue: "[ $1 -ge 20 ] && telnetd -p 233 -l /bin/sh\x0a",
  ui: {
    label: "Custom Script",
  },
};

export const smart_connect_x: NvramProperty<boolean> = {
  key: "smart_connect_x",
  description:
    "Enables Wireless Band Steering, where the router attempts to steer dual-band clients to the 5GHz band.",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable",
  },
};

export const smbd_autoshare: NvramProperty<"0" | "1" | "2" | "3"> = {
  key: "smbd_autoshare",
  description: "Automatically shares all attached USB partitions via Samba.",
  page: "nas-samba.asp",
  type: "enum",
  defaultValue: "2",
  ui: {
    label: "Auto-share all USB Partitions",
    options: [
      { value: "0", label: "Disabled" },
      { value: "1", label: "Read Only" },
      { value: "2", label: "Read / Write" },
      { value: "3", label: "Hidden Read / Write" },
    ],
  },
};

export const smbd_cpage: NvramProperty<string> = {
  key: "smbd_cpage",
  description:
    "Specifies the client codepage for Samba to handle character encoding correctly.",
  page: "nas-samba.asp",
  type: "enum",
  defaultValue: "",
  ui: {
    label: "Client Codepage",
    options: [
      { value: "", label: "Unspecified" },
      { value: "437", label: "437 (United States, Canada)" },
      { value: "850", label: "850 (Western Europe)" },
      { value: "852", label: "852 (Central / Eastern Europe)" },
      { value: "866", label: "866 (Cyrillic / Russian)" },
      { value: "932", label: "932 (Japanese)" },
      { value: "936", label: "936 (Simplified Chinese)" },
      { value: "949", label: "949 (Korean)" },
      { value: "950", label: "950 (Traditional Chinese / Big5)" },
    ],
  },
};

export const smbd_custom: NvramProperty<string> = {
  key: "smbd_custom",
  description: "Custom configuration options to be added to the smb.conf file.",
  page: "nas-samba.asp",
  type: "string",
  defaultValue: "",
  validation: (value) =>
    value.length <= 2048 || "Maximum length is 2048 characters.",
  ui: {
    label: "Custom Configuration",
  },
};

export const smbd_enable: NvramProperty<"0" | "1" | "2"> = {
  key: "smbd_enable",
  description:
    "Controls the Samba file sharing service and its authentication mode.",
  page: "nas-samba.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Enable on Start",
    options: [
      { value: "0", label: "No" },
      { value: "1", label: "Yes, no Authentication" },
      { value: "2", label: "Yes, Authentication required" },
    ],
  },
};

export const smbd_ifnames: NvramProperty<string> = {
  key: "smbd_ifnames",
  description:
    "A space-separated list of LAN bridge interfaces on which the Samba server will listen.",
  page: "nas-samba.asp",
  type: "list",
  defaultValue: "br0",
  ui: {
    label: "LAN interfaces",
  },
};

export const smbd_master: NvramProperty<boolean> = {
  key: "smbd_master",
  description: "Enables the router to act as a Master Browser on the network.",
  page: "nas-samba.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Master Browser",
  },
};

export const smbd_passwd: NvramProperty<string> = {
  key: "smbd_passwd",
  description: "The password for the authenticated Samba user.",
  page: "nas-samba.asp",
  type: "string",
  defaultValue: "",
  validation: (value) => value.length >= 1 || "Password is required.",
  ui: {
    label: "Password",
  },
};

export const smbd_protocol: NvramProperty<"0" | "1" | "2"> = {
  key: "smbd_protocol",
  description: "Specifies the SMB protocol version to be used.",
  page: "nas-samba.asp",
  type: "enum",
  defaultValue: "2",
  ui: {
    label: "Samba protocol version",
    options: [
      { value: "0", label: "SMBv1" },
      { value: "1", label: "SMBv2" },
      { value: "2", label: "SMBv1 + SMBv2" },
    ],
  },
};

interface SambaShare {
  name: string;
  directory: string;
  description: string;
  access: "0" | "1"; // Read Only, Read/Write
  hidden: "0" | "1";
}
export const smbd_shares: NvramProperty<SambaShare[]> = {
  key: "smbd_shares",
  description: "A list of custom Samba shares.",
  page: "nas-samba.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        name: { type: "string", label: "Share Name", defaultValue: "" },
        directory: {
          type: "string",
          label: "Directory",
          defaultValue: "",
        },
        description: {
          type: "string",
          label: "Description",
          defaultValue: "",
        },
        access: { type: "string", label: "Access", defaultValue: "0" },
        hidden: { type: "string", label: "Hidden", defaultValue: "0" },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const p = v.split("<");
          if (p.length !== 5) return null;
          return {
            name: p[0],
            directory: p[1],
            description: p[2],
            access: p[3] as any,
            hidden: p[4] as any,
          };
        })
        .filter((v) => v !== null) as SambaShare[],
    fromUi: (value) =>
      value
        .map(
          (v) =>
            `${v.name}<${v.directory}<${v.description}<${v.access}<${v.hidden}`,
        )
        .join(">"),
  },
  ui: {
    label: "Additional Shares List",
  },
};

export const smbd_user: NvramProperty<string> = {
  key: "smbd_user",
  description: "The username for authenticated Samba access.",
  page: "nas-samba.asp",
  type: "string",
  defaultValue: "nas",
  validation: (value) =>
    (value.length >= 1 && value !== "root") ||
    'Username is required and cannot be "root".',
  ui: {
    label: "Username",
  },
};

export const smbd_wgroup: NvramProperty<string> = {
  key: "smbd_wgroup",
  description: "The workgroup name for the Samba server.",
  page: "nas-samba.asp",
  type: "string",
  defaultValue: "WORKGROUP",
  ui: {
    label: "Workgroup Name",
  },
};

export const smbd_wins: NvramProperty<boolean> = {
  key: "smbd_wins",
  description: "Enables the router to act as a WINS server on the network.",
  page: "nas-samba.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "WINS Server",
    state: {
      dependsOn: ["wan_wins"],
      evaluator: (values) =>
        values["wan_wins"] !== "" && values["wan_wins"] !== "0.0.0.0"
          ? "disabled"
          : "enabled",
    },
  },
};

export const snmp_contact: NvramProperty<string> = {
  key: "snmp_contact",
  description: "The contact information for the device, as reported by SNMP.",
  page: "admin-snmp.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Contact",
  },
};

export const snmp_enable: NvramProperty<boolean> = {
  key: "snmp_enable",
  description: "Enables the SNMP agent.",
  page: "admin-snmp.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable SNMP",
  },
};

export const snmp_location: NvramProperty<string> = {
  key: "snmp_location",
  description: "The physical location of the device, as reported by SNMP.",
  page: "admin-snmp.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Location",
  },
};

export const snmp_port: NvramProperty<number> = {
  key: "snmp_port",
  description: "The UDP port for the SNMP agent.",
  page: "admin-snmp.asp",
  type: "integer",
  defaultValue: 161,
  validation: portValidator,
  ui: {
    label: "Port",
  },
};

export const snmp_remote: NvramProperty<boolean> = {
  key: "snmp_remote",
  description: "Allows SNMP queries from the WAN interface.",
  page: "admin-snmp.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Remote access",
  },
};

export const snmp_remote_sip: NvramProperty<string> = {
  key: "snmp_remote_sip",
  description:
    "A list of allowed remote source IP addresses/ranges for SNMP access.",
  page: "admin-snmp.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Allowed Remote IP Address",
  },
};

export const snmp_ro: NvramProperty<string> = {
  key: "snmp_ro",
  description: "The read-only community string for SNMP access.",
  page: "admin-snmp.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "RO Community",
  },
};

export const sshd_authkeys: NvramProperty<string> = {
  key: "sshd_authkeys",
  description: "A list of public keys authorized for SSH access, one per line.",
  page: "admin-access.asp",
  type: "string",
  defaultValue: "",
  validation: (value) =>
    value.length <= 4096 || "Maximum length is 4096 characters.",
  ui: {
    label: "Authorized Keys",
  },
};

export const sshd_eas: NvramProperty<boolean> = {
  key: "sshd_eas",
  description: "Enables the SSH server to start on boot.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Enable on Startup",
  },
};

export const sshd_forwarding: NvramProperty<boolean> = {
  key: "sshd_forwarding",
  description:
    "Allows TCP port forwarding (tunnelling) through the SSH server.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Port Forwarding",
  },
};

export const sshd_motd: NvramProperty<boolean> = {
  key: "sshd_motd",
  description:
    "Enables the display of an extended Message of the Day upon SSH login.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Extended MOTD",
  },
};

export const sshd_pass: NvramProperty<boolean> = {
  key: "sshd_pass",
  description:
    "Allows password-based authentication for SSH. If disabled, only key-based authentication is allowed.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Allow Password Login",
  },
};

export const sshd_port: NvramProperty<number> = {
  key: "sshd_port",
  description: "The TCP port for the SSH server on the LAN.",
  page: "admin-access.asp",
  type: "integer",
  defaultValue: 22,
  validation: portValidator,
  ui: {
    label: "LAN Port",
  },
};

export const sshd_remote: NvramProperty<boolean> = {
  key: "sshd_remote",
  description: "Allows the SSH server to be accessed from the WAN.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "WAN Access",
  },
};

export const sshd_rport: NvramProperty<number> = {
  key: "sshd_rport",
  description: "The TCP port for the SSH server on the WAN.",
  page: "admin-access.asp",
  type: "integer",
  defaultValue: 22,
  validation: portValidator,
  ui: {
    label: "WAN Port",
    state: {
      dependsOn: ["sshd_remote"],
      evaluator: (values) =>
        values["sshd_remote"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const stealth_iled: NvramProperty<boolean> = {
  key: "stealth_iled",
  description:
    "If Stealth Mode is enabled, this setting excludes the INTERNET LED from being turned off.",
  page: "admin-buttons.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Exclude INTERNET LED",
    state: {
      dependsOn: ["stealth_mode"],
      evaluator: (values) =>
        values["stealth_mode"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const stealth_mode: NvramProperty<boolean> = {
  key: "stealth_mode",
  description:
    "Enables Stealth Mode, which turns off all router LEDs after booting. Requires a reboot.",
  page: "admin-buttons.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable Stealth Mode",
  },
};

export const stubby_force_tls13: NvramProperty<boolean> = {
  key: "stubby_force_tls13",
  description: "Forces Stubby to use TLS 1.3 for DNS-over-TLS connections.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Force TLS1.3",
  },
};

export const stubby_log: NvramProperty<string> = {
  key: "stubby_log",
  description: "Sets the logging verbosity level for the Stubby daemon.",
  page: "advanced-dhcpdns.asp",
  type: "enum",
  defaultValue: "5",
  ui: {
    label: "Log Level",
    options: [
      { value: "0", label: "Emergency" },
      { value: "1", label: "Alert" },
      { value: "2", label: "Critical" },
      { value: "3", label: "Error" },
      { value: "4", label: "Warning" },
      { value: "5", label: "Notice*" },
      { value: "6", label: "Info" },
      { value: "7", label: "Debug" },
    ],
  },
};

export const stubby_port: NvramProperty<number> = {
  key: "stubby_port",
  description:
    "The local TCP port on which Stubby listens for DNS queries from dnsmasq.",
  page: "advanced-dhcpdns.asp",
  type: "integer",
  defaultValue: 5453,
  validation: portValidator,
  ui: {
    label: "Local Port",
  },
};

export const stubby_priority: NvramProperty<"2" | "1" | "0"> = {
  key: "stubby_priority",
  description:
    "Controls how dnsmasq uses the Stubby resolver relative to other DNS servers.",
  page: "advanced-dhcpdns.asp",
  type: "enum",
  defaultValue: "2",
  ui: {
    label: "Priority",
    options: [
      { value: "2", label: "No-Resolv*" },
      { value: "1", label: "Strict-Order" },
      { value: "0", label: "None" },
    ],
  },
};

export const stubby_proxy: NvramProperty<boolean> = {
  key: "stubby_proxy",
  description: "Enables the Stubby DNS-over-TLS proxy.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Use Stubby",
  },
};

export const t_cafree: NvramProperty<boolean> = {
  key: "t_cafree",
  description:
    "If enabled, treats cache, buffers, and reclaimable slab memory as 'free' when calculating available memory.",
  page: "admin-debug.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label:
      "Count cache memory, buffers and reclaimable slab memory as free memory",
  },
};

export const t_features: NvramProperty<string> = {
  key: "t_features",
  description:
    "A read-only hexadecimal bitmask representing the firmware's compiled features.",
  page: "admin-buttons.asp",
  type: "hex",
};

export const t_hidelr: NvramProperty<boolean> = {
  key: "t_hidelr",
  description:
    "If enabled, connections between LAN clients and the router itself are not displayed in the connection tracking table.",
  page: "admin-debug.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Avoid displaying LAN to router connections",
  },
};

export const t_model: NvramProperty<string> = {
  key: "t_model",
  description: "A read-only identifier for the router model.",
  page: "admin-buttons.asp",
  type: "string",
};

export const t_model_name: NvramProperty<string> = {
  key: "t_model_name",
  description:
    "A read-only string representing the human-readable router model name.",
  page: "admin-bwm.asp",
  type: "string",
};

export const telnetd_eas: NvramProperty<boolean> = {
  key: "telnetd_eas",
  description: "Enables the Telnet server to start on boot.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Enable at Startup",
  },
};

export const telnetd_port: NvramProperty<number> = {
  key: "telnetd_port",
  description: "The TCP port for the Telnet server.",
  page: "admin-access.asp",
  type: "integer",
  defaultValue: 23,
  validation: portValidator,
  ui: {
    label: "Port",
  },
};

export const tinc_custom: NvramProperty<string> = {
  key: "tinc_custom",
  description: "Custom configuration directives for the Tinc daemon.",
  page: "vpn-tinc.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Custom",
  },
};

export const tinc_devicetype: NvramProperty<"tun" | "tap"> = {
  key: "tinc_devicetype",
  description: "The type of virtual network interface to use for the Tinc VPN.",
  page: "vpn-tinc.asp",
  type: "enum",
  defaultValue: "tun",
  ui: {
    label: "Interface Type",
    options: [
      { value: "tun", label: "TUN" },
      { value: "tap", label: "TAP" },
    ],
  },
};

export const tinc_enable: NvramProperty<boolean> = {
  key: "tinc_enable",
  description: "Enables the Tinc VPN to start on boot.",
  page: "vpn-tinc.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable on Start",
  },
};

export const tinc_firewall: NvramProperty<string> = {
  key: "tinc_firewall",
  description:
    "Custom firewall rules to be applied when the Tinc interface comes up.",
  page: "vpn-tinc.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Firewall",
  },
};

export const tinc_host_down: NvramProperty<string> = {
  key: "tinc_host_down",
  description:
    "A script that is executed when a remote host becomes unreachable.",
  page: "vpn-tinc.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "host-down",
  },
};

export const tinc_host_up: NvramProperty<string> = {
  key: "tinc_host_up",
  description:
    "A script that is executed when a remote host becomes reachable.",
  page: "vpn-tinc.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "host-up",
  },
};

interface TincHost {
  connectTo: boolean;
  name: string;
  address: string;
  port?: number;
  compression: string; // "0" to "12"
  subnet: string;
  rsa_key: string;
  ed25519_key: string;
  custom: string;
}
export const tinc_hosts: NvramProperty<TincHost[]> = {
  key: "tinc_hosts",
  description: "A list of remote hosts (peers) for the Tinc mesh VPN.",
  page: "vpn-tinc.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        connectTo: {
          type: "boolean",
          label: "Connect To",
          defaultValue: false,
        },
        name: { type: "string", label: "Name", defaultValue: "" },
        address: { type: "string", label: "Address", defaultValue: "" },
        port: {
          type: "integer",
          label: "Port",
          defaultValue: 0,
          optional: true,
        },
        compression: {
          type: "string",
          label: "Compression",
          defaultValue: "0",
        },
        subnet: { type: "string", label: "Subnet", defaultValue: "" },
        rsa_key: { type: "string", label: "RSA Key", defaultValue: "" },
        ed25519_key: {
          type: "string",
          label: "Ed25519 Key",
          defaultValue: "",
        },
        custom: { type: "string", label: "Custom Script", defaultValue: "" },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const p = v.split("<");
          if (p.length !== 9) return null;
          return {
            connectTo: p[0] === "1",
            name: p[1],
            address: p[2],
            port: p[3] ? parseInt(p[3], 10) : undefined,
            compression: p[4],
            subnet: p[5],
            rsa_key: p[6],
            ed25519_key: p[7],
            custom: p[8],
          };
        })
        .filter((v) => v !== null) as TincHost[],
    fromUi: (value) =>
      value
        .map(
          (v) =>
            `${v.connectTo ? "1" : "0"}<${v.name}<${v.address}<${
              v.port || ""
            }<${v.compression}<${v.subnet}<${v.rsa_key}<${v.ed25519_key}<${
              v.custom
            }`,
        )
        .join(">"),
  },
  ui: {
    label: "Hosts",
  },
};

export const tinc_manual_firewall: NvramProperty<"0" | "1" | "2"> = {
  key: "tinc_manual_firewall",
  description: "Controls how firewall rules for Tinc are managed.",
  page: "vpn-tinc.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Firewall Rules",
    options: [
      { value: "0", label: "Automatic" },
      { value: "1", label: "Additional" },
      { value: "2", label: "Manual" },
    ],
  },
};

export const tinc_manual_tinc_up: NvramProperty<"0" | "1"> = {
  key: "tinc_manual_tinc_up",
  description:
    "Controls whether the 'tinc-up' script is automatically generated or manually specified.",
  page: "vpn-tinc.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "tinc-up creation",
    options: [
      { value: "0", label: "Automatic" },
      { value: "1", label: "Manual" },
    ],
  },
};

export const tinc_mode: NvramProperty<"switch" | "hub"> = {
  key: "tinc_mode",
  description: "Sets the operational mode for a TAP-style Tinc VPN.",
  page: "vpn-tinc.asp",
  type: "enum",
  defaultValue: "switch",
  ui: {
    label: "Mode",
    options: [
      { value: "switch", label: "Switch" },
      { value: "hub", label: "Hub" },
    ],
  },
};

export const tinc_name: NvramProperty<string> = {
  key: "tinc_name",
  description: "The name of this local node in the Tinc VPN mesh.",
  page: "vpn-tinc.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Host Name",
  },
};

export const tinc_poll: NvramProperty<number> = {
  key: "tinc_poll",
  description:
    "The interval in minutes for the keep-alive check to ensure the Tinc daemon is running. 0 disables the check.",
  page: "vpn-tinc.asp",
  type: "integer",
  defaultValue: 0,
  validation: rangeValidator(0, 1440),
  ui: {
    label: "Poll Interval",
  },
};

export const tinc_private_ed25519: NvramProperty<string> = {
  key: "tinc_private_ed25519",
  description: "The Ed25519 private key for this Tinc node.",
  page: "vpn-tinc.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Ed25519 Private Key",
  },
};

export const tinc_private_rsa: NvramProperty<string> = {
  key: "tinc_private_rsa",
  description:
    "The RSA private key for this Tinc node, used for compatibility with older Tinc versions.",
  page: "vpn-tinc.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "RSA Private Key *",
  },
};

export const tinc_subnet_down: NvramProperty<string> = {
  key: "tinc_subnet_down",
  description:
    "A script that is executed when a remote subnet becomes unreachable.",
  page: "vpn-tinc.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "subnet-down",
  },
};

export const tinc_subnet_up: NvramProperty<string> = {
  key: "tinc_subnet_up",
  description:
    "A script that is executed when a remote subnet becomes reachable.",
  page: "vpn-tinc.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "subnet-up",
  },
};

export const tinc_tinc_down: NvramProperty<string> = {
  key: "tinc_tinc_down",
  description: "A script that is executed when the Tinc daemon is stopped.",
  page: "vpn-tinc.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "tinc-down",
  },
};

export const tinc_tinc_up: NvramProperty<string> = {
  key: "tinc_tinc_up",
  description:
    "A script that is executed after the Tinc daemon starts and the interface is configured.",
  page: "vpn-tinc.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "tinc-up",
  },
};

export const tinc_vpn_netmask: NvramProperty<string> = {
  key: "tinc_vpn_netmask",
  description: "The netmask for the entire VPN network, used in TUN mode.",
  page: "vpn-tinc.asp",
  type: "netmask",
  defaultValue: "255.255.0.0",
  ui: {
    label: "VPN Netmask",
  },
};

export const tm_dst: NvramProperty<boolean> = {
  key: "tm_dst",
  description:
    "Enables or disables automatic Daylight Saving Time adjustments based on the selected timezone rule.",
  page: "basic-time.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Auto Daylight Savings",
  },
};

export const tm_sel: NvramProperty<string> = {
  key: "tm_sel",
  description: "The selected timezone rule from the predefined list.",
  page: "basic-time.asp",
  type: "enum",
  defaultValue: "PST8PDT,M3.2.0/2,M11.1.0/2",
  ui: {
    label: "UTC offsets",
  },
};

export const tm_tz: NvramProperty<string> = {
  key: "tm_tz",
  description:
    "The POSIX-compliant timezone string. This is derived from `tm_sel` and `tm_dst`, or set manually if `tm_sel` is 'custom'.",
  page: "basic-time.asp",
  type: "string",
  defaultValue: "PST8PDT,M3.2.0/2,M11.1.0/2",
  ui: {
    label: "Custom TZ String",
  },
};

export const tomatoanon_enable: NvramProperty<boolean> = {
  key: "tomatoanon_enable",
  description:
    "Enables participation in the TomatoAnon project, which sends anonymous usage statistics.",
  page: "admin-tomatoanon.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable",
  },
};

export const tomatoanon_notify: NvramProperty<boolean> = {
  key: "tomatoanon_notify",
  description:
    "Enables the Update Notification System, which checks for new FreshTomato versions.",
  page: "admin-tomatoanon.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Enable",
  },
};

export const tor_custom: NvramProperty<string> = {
  key: "tor_custom",
  description: "Custom configuration options for the Tor client.",
  page: "advanced-tor.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Custom Configuration",
  },
};

export const tor_datadir: NvramProperty<string> = {
  key: "tor_datadir",
  description: "The directory where Tor stores its data.",
  page: "advanced-tor.asp",
  type: "string",
  defaultValue: "/tmp/tor",
  validation: pathValidator,
  ui: {
    label: "Data Directory",
  },
};

export const tor_dnsport: NvramProperty<number> = {
  key: "tor_dnsport",
  description: "The local port on which Tor listens for DNS requests.",
  page: "advanced-tor.asp",
  type: "integer",
  defaultValue: 9053,
  validation: portValidator,
  ui: {
    label: "DNS Port",
  },
};

export const tor_enable: NvramProperty<boolean> = {
  key: "tor_enable",
  description: "Enables the Tor client to start on boot.",
  page: "advanced-tor.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable on Start",
  },
};

export const tor_iface: NvramProperty<
  "br0" | "br1" | "br2" | "br3" | "custom"
> = {
  key: "tor_iface",
  description:
    "Specifies which LAN interface's traffic should be redirected through Tor.",
  page: "advanced-tor.asp",
  type: "enum",
  defaultValue: "br0",
  ui: {
    label: "Redirect all users from",
  },
};

export const tor_ports: NvramProperty<string> = {
  key: "tor_ports",
  description:
    "Specifies which TCP ports to redirect through Tor. Can be a preset or custom.",
  page: "advanced-tor.asp",
  type: "enum",
  defaultValue: "80",
  ui: {
    label: "Redirect TCP Ports",
    options: [
      { value: "80", label: "HTTP only (TCP 80)" },
      { value: "80,443", label: "HTTP/HTTPS (TCP 80,443)" },
      { value: "custom", label: "Selected Ports" },
    ],
  },
};

export const tor_ports_custom: NvramProperty<string> = {
  key: "tor_ports_custom",
  description:
    "A comma-separated list or range of TCP ports to redirect, used when 'tor_ports' is 'custom'.",
  page: "advanced-tor.asp",
  type: "string",
  defaultValue: "80,443,8080:8880",
  ui: {
    state: {
      dependsOn: ["tor_ports"],
      evaluator: (values) =>
        values["tor_ports"] === "custom" ? "visible" : "hidden",
    },
  },
};

export const tor_socksport: NvramProperty<number> = {
  key: "tor_socksport",
  description: "The local port on which Tor provides a SOCKS proxy.",
  page: "advanced-tor.asp",
  type: "integer",
  defaultValue: 9050,
  validation: portValidator,
  ui: {
    label: "Socks Port",
  },
};

export const tor_solve_only: NvramProperty<boolean> = {
  key: "tor_solve_only",
  description:
    "If enabled, Tor is only used to resolve .onion/.exit domains via its DNS port and does not act as a transparent proxy.",
  page: "advanced-tor.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Only solve .onion/.exit domains",
  },
};

export const tor_transport: NvramProperty<number> = {
  key: "tor_transport",
  description: "The local port on which Tor provides a transparent proxy.",
  page: "advanced-tor.asp",
  type: "integer",
  defaultValue: 9040,
  validation: portValidator,
  ui: {
    label: "Trans Port",
  },
};

export const tor_users: NvramProperty<string> = {
  key: "tor_users",
  description:
    "A comma-separated list of IP addresses or ranges whose traffic should be redirected through Tor, used when 'tor_iface' is 'custom'.",
  page: "advanced-tor.asp",
  type: "string",
  defaultValue: "192.168.1.0/24",
  ui: {
    state: {
      dependsOn: ["tor_iface"],
      evaluator: (values) =>
        values["tor_iface"] === "custom" ? "visible" : "hidden",
    },
  },
};

interface TriggeredForwardRule {
  enabled: boolean;
  protocol: 1 | 2 | 3; // TCP, UDP, Both
  trigger_ports: string;
  forwarded_ports: string;
  description: string;
}
export const trigforward: NvramProperty<TriggeredForwardRule[]> = {
  key: "trigforward",
  description: "A list of triggered port forwarding rules.",
  page: "forward-triggered.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        enabled: { type: "boolean", label: "Enabled", defaultValue: false },
        protocol: { type: "integer", label: "Protocol", defaultValue: 3 },
        trigger_ports: {
          type: "string",
          label: "Trigger Ports",
          defaultValue: "",
        },
        forwarded_ports: {
          type: "string",
          label: "Forwarded Ports",
          defaultValue: "",
        },
        description: {
          type: "string",
          label: "Description",
          defaultValue: "",
        },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split(">")
        .filter((v) => v)
        .map((v) => {
          const p = v.split("<");
          if (p.length !== 5) return null;
          return {
            enabled: p[0] === "1",
            protocol: parseInt(p[1]!, 10) as any,
            trigger_ports: p[2]!.replace(/:/g, "-"),
            forwarded_ports: p[3]!.replace(/:/g, "-"),
            description: p[4]!,
          };
        })
        .filter((v) => v !== null) as TriggeredForwardRule[],
    fromUi: (value) =>
      value
        .map(
          (v) =>
            `${v.enabled ? "1" : "0"}<${v.protocol}<${(
              v.trigger_ports || ""
            ).replace(/-/g, ":")}<${(v.forwarded_ports || "").replace(
              /-/g,
              ":",
            )}<${v.description}`,
        )
        .join(">"),
  },
  ui: {
    label: "Triggered Port Forwarding",
  },
};

export const ttb_css: NvramProperty<string> = {
  key: "ttb_css",
  description:
    "The name of the theme to fetch from TomatoThemeBase when 'web_css' is set to 'online'.",
  page: "admin-access.asp",
  type: "string",
  defaultValue: "example",
  ui: {
    label: "TTB theme name",
    state: {
      dependsOn: ["web_css"],
      evaluator: (values) =>
        values["web_css"] === "online" ? "visible" : "hidden",
    },
  },
};

export const ttb_loc: NvramProperty<string> = {
  key: "ttb_loc",
  description:
    "The local folder where the online theme from TomatoThemeBase should be saved. Defaults to /tmp if empty.",
  page: "admin-access.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "TTB save folder",
    state: {
      dependsOn: ["web_css"],
      evaluator: (values) =>
        values["web_css"] === "online" ? "visible" : "hidden",
    },
  },
};

export const ttb_url: NvramProperty<string> = {
  key: "ttb_url",
  description:
    "A space-separated list of mirror URLs for the TomatoThemeBase service.",
  page: "admin-access.asp",
  type: "string",
  defaultValue: "http://ttb.mooo.com http://ttb.ath.cx http://ttb.ddnsfree.com",
  ui: {
    label: "TTB URL",
    state: {
      dependsOn: ["web_css"],
      evaluator: (values) =>
        values["web_css"] === "online" ? "visible" : "hidden",
    },
  },
};

export const udpxy_clients: NvramProperty<number> = {
  key: "udpxy_clients",
  description:
    "The maximum number of clients that can connect to the Udpxy service.",
  page: "advanced-firewall.asp",
  type: "integer",
  defaultValue: 3,
  validation: rangeValidator(1, 5000),
  ui: {
    label: "Max clients",
  },
};

export const udpxy_enable: NvramProperty<boolean> = {
  key: "udpxy_enable",
  description: "Enables the Udpxy UDP-to-HTTP multicast proxy service.",
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable Udpxy",
  },
};

const udpxyLanProperty = (lanIndex: 0 | 1 | 2 | 3): NvramProperty<boolean> => ({
  key: `udpxy_lan${lanIndex === 0 ? "" : lanIndex}`,
  description: `Makes the Udpxy service available on the LAN${lanIndex} (br${lanIndex}) interface.`,
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: `LAN${lanIndex}`,
  },
});
export const udpxy_lan = udpxyLanProperty(0);
export const udpxy_lan1 = udpxyLanProperty(1);
export const udpxy_lan2 = udpxyLanProperty(2);
export const udpxy_lan3 = udpxyLanProperty(3);

export const udpxy_port: NvramProperty<number> = {
  key: "udpxy_port",
  description: "The TCP port on which the Udpxy service listens.",
  page: "advanced-firewall.asp",
  type: "integer",
  defaultValue: 4022,
  validation: portValidator,
  ui: {
    label: "Udpxy port",
  },
};

export const udpxy_stats: NvramProperty<boolean> = {
  key: "udpxy_stats",
  description: "Enables the Udpxy status page.",
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Enable client statistics",
  },
};

export const udpxy_wanface: NvramProperty<string> = {
  key: "udpxy_wanface",
  description:
    "The upstream interface for multicast traffic. If empty, the default WAN interface is used.",
  page: "advanced-firewall.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Upstream interface",
  },
};

export const upnp_custom: NvramProperty<string> = {
  key: "upnp_custom",
  description: "Custom configuration options for the MiniUPnPd service.",
  page: "forward-upnp.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Custom Configuration",
  },
};

export const upnp_enable: NvramProperty<number> = {
  key: "upnp_enable",
  description:
    "A bitmask to enable UPnP services: 1 for UPnP IGD, 2 for PCP/NAT-PMP. 3 enables both.",
  page: "forward-upnp.asp",
  type: "integer",
  defaultValue: 0,
};

const upnpLanProperty = (lanIndex: 0 | 1 | 2 | 3): NvramProperty<boolean> => ({
  key: `upnp_lan${lanIndex === 0 ? "" : lanIndex}`,
  description: `Enables UPnP/PCP services on the LAN${lanIndex} (br${lanIndex}) interface.`,
  page: "forward-upnp.asp",
  type: "boolean",
  defaultValue: lanIndex === 0 ? false : undefined, // Assuming default is likely for br0 only if any
  transform: booleanTransformer,
  ui: {
    label: `LAN${lanIndex}`,
  },
});
export const upnp_lan = upnpLanProperty(0);
export const upnp_lan1 = upnpLanProperty(1);
export const upnp_lan2 = upnpLanProperty(2);
export const upnp_lan3 = upnpLanProperty(3);

export const upnp_secure: NvramProperty<boolean> = {
  key: "upnp_secure",
  description:
    "Enables secure mode for UPnP, preventing clients from creating port forwards for other devices on the network. The UI logic is inverted: checkbox 'Allow third-party forwarding' being checked means this is '0'.",
  page: "forward-upnp.asp",
  type: "boolean",
  defaultValue: true, // secure by default
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Allow third-party forwarding", // Inverted label
  },
};

export const usb_apcupsd: NvramProperty<boolean> = {
  key: "usb_apcupsd",
  description: "Enables the APCUPSD daemon for monitoring a connected APC UPS.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Run APCUPSD Daemon",
  },
};

export const usb_apcupsd_custom: NvramProperty<boolean> = {
  key: "usb_apcupsd_custom",
  description:
    "If enabled, uses a custom apcupsd.conf file located at /etc/apcupsd.conf.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Custom Config File",
  },
};

export const usb_automount: NvramProperty<boolean> = {
  key: "usb_automount",
  description:
    "Automatically mounts all recognized partitions on connected USB storage devices to subdirectories in /mnt.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Automount",
  },
};

export const usb_enable: NvramProperty<boolean> = {
  key: "usb_enable",
  description: "Globally enables core USB support.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Core USB Support",
  },
};

export const usb_fs_exfat: NvramProperty<boolean> = {
  key: "usb_fs_exfat",
  description: "Enables kernel support for the exFAT filesystem.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "exFAT",
  },
};

export const usb_fs_ext4: NvramProperty<boolean> = {
  key: "usb_fs_ext4",
  description: "Enables kernel support for Ext2/3/4 filesystems.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Ext2 / Ext3 / Ext4 *",
  },
};

export const usb_fs_fat: NvramProperty<boolean> = {
  key: "usb_fs_fat",
  description: "Enables kernel support for FAT16/FAT32 filesystems.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "FAT",
  },
};

export const usb_fs_hfs: NvramProperty<boolean> = {
  key: "usb_fs_hfs",
  description: "Enables kernel support for HFS/HFS+ filesystems.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "HFS / HFS+",
  },
};

export const usb_fs_ntfs: NvramProperty<boolean> = {
  key: "usb_fs_ntfs",
  description: "Enables support for the NTFS filesystem.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "NTFS",
  },
};

export const usb_fs_zfs: NvramProperty<boolean> = {
  key: "usb_fs_zfs",
  description: "Enables kernel support for the ZFS filesystem.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "ZFS",
  },
};

export const usb_fs_zfs_automount: NvramProperty<boolean> = {
  key: "usb_fs_zfs_automount",
  description: "Automatically mount all ZFS partitions.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "ZFS Automount",
  },
};

export const usb_hfs_driver: NvramProperty<"kernel"> = {
  key: "usb_hfs_driver",
  description: "Selects the driver to use for HFS/HFS+ support.",
  page: "nas-usb.asp",
  type: "enum",
  defaultValue: "kernel",
  ui: {
    label: "HFS/HFS+ Driver",
    options: [{ value: "kernel", label: "Open HFS/HFS+ driver" }],
  },
};

export const usb_mmc: NvramProperty<string> = {
  key: "usb_mmc",
  description:
    "Enables support for MMC/SD card readers. (Value seems to be empty, may just be a flag).",
  page: "nas-usb.asp",
  type: "string",
  defaultValue: "",
};

export const usb_ntfs_driver: NvramProperty<"ntfs3g" | "paragon"> = {
  key: "usb_ntfs_driver",
  description: "Selects the driver to use for NTFS support.",
  page: "nas-usb.asp",
  type: "enum",
  defaultValue: "ntfs3g",
  ui: {
    label: "NTFS Driver",
    options: [
      { value: "ntfs3g", label: "Open NTFS-3G driver" },
      { value: "paragon", label: "Paragon driver" },
    ],
  },
};

export const usb_ohci: NvramProperty<string> = {
  key: "usb_ohci",
  description:
    "Enables the OHCI controller for USB 1.1 support. A value of -1 indicates the setting is not applicable for the hardware.",
  page: "nas-usb.asp",
  type: "string",
  defaultValue: "0",
  ui: {
    label: "OHCI",
  },
};

export const usb_printer: NvramProperty<boolean> = {
  key: "usb_printer",
  description: "Enables USB printer support.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "USB Printer Support",
  },
};

export const usb_printer_bidirect: NvramProperty<boolean> = {
  key: "usb_printer_bidirect",
  description:
    "Enables bidirectional communication with the connected USB printer.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Bidirectional copying",
  },
};

export const usb_storage: NvramProperty<boolean> = {
  key: "usb_storage",
  description: "Enables support for USB mass storage devices.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "USB Storage Support",
  },
};

export const usb_uhci: NvramProperty<string> = {
  key: "usb_uhci",
  description:
    "Enables the UHCI controller for USB 1.1 support. A value of -1 indicates the setting is not applicable for the hardware.",
  page: "nas-usb.asp",
  type: "string",
  defaultValue: "-1",
  ui: {
    label: "UHCI",
  },
};

export const usb_usb2: NvramProperty<boolean> = {
  key: "usb_usb2",
  description: "Enables the EHCI controller for USB 2.0 support.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "USB 2.0 Support",
  },
};

export const usb_usb3: NvramProperty<boolean> = {
  key: "usb_usb3",
  description:
    "Enables the XHCI controller for USB 3.0 support. A value of -1 indicates the setting is not applicable.",
  page: "nas-usb.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "USB 3.0 Support",
  },
};

// --- Helper Types & Functions ---

// Re-usable type for VLAN unit numbers (0-15)
type VlanUnit =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;
const vlanUnits: VlanUnit[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
];

// Re-usable type for OpenVPN client unit numbers
type VpnClientUnit = 1 | 2 | 3;
const vpnClientUnits: VpnClientUnit[] = [1, 2, 3];

// Re-usable type for OpenVPN server unit numbers
type VpnServerUnit = 1 | 2;
const vpnServerUnits: VpnServerUnit[] = [1, 2];

// Re-usable type for WAN unit strings ('', '2', '3', '4')
type WanUnit = "" | "2" | "3" | "4";
const wanUnits: WanUnit[] = ["", "2", "3", "4"];
const wanUnitToNumber = (unit: WanUnit): number =>
  unit === "" ? 1 : parseInt(unit, 10);

// --- NVRAM Catalog ---

export const vlanHwname: PatternedNvramProperty<{ unit: VlanUnit }, string> = {
  getKey: ({ unit }) => `vlan${unit}hwname`,
  regex: /^vlan(\d{1,2})hwname$/,
  parameters: {
    unit: { type: "integer", description: "VLAN Index (0-15)", range: [0, 15] },
  },
  description:
    "The hardware name (e.g., 'et0') associated with a specific VLAN. This is typically set programmatically by the firmware based on the router model and is not user-editable via the UI.",
  page: "advanced-vlan.asp",
  type: "string",
};

export const vlanPorts: PatternedNvramProperty<{ unit: VlanUnit }, string> = {
  getKey: ({ unit }) => `vlan${unit}ports`,
  regex: /^vlan(\d{1,2})ports$/,
  parameters: {
    unit: { type: "integer", description: "VLAN Index (0-15)", range: [0, 15] },
  },
  description:
    "A space-separated string defining which physical ports are members of this VLAN. A 't' suffix indicates a tagged port, and a '*' indicates the default VLAN for untagged traffic.",
  page: "advanced-vlan.asp",
  type: "string",
};

export const vlanVid: PatternedNvramProperty<{ unit: VlanUnit }, number> = {
  getKey: ({ unit }) => `vlan${unit}vid`,
  regex: /^vlan(\d{1,2})vid$/,
  parameters: {
    unit: { type: "integer", description: "VLAN Index (0-15)", range: [0, 15] },
  },
  description:
    "The 802.1Q VLAN ID (VID) for this VLAN interface. An empty value or '0' typically means the VID is the same as the VLAN index.",
  page: "advanced-vlan.asp",
  type: "integer",
  validation: (value) =>
    (value >= 0 && value <= 4094) || "Valid VLAN ID range is 0-4094.",
};

export const vpn_client_eas: NvramProperty<string> = {
  key: "vpn_client_eas",
  description:
    "A comma-separated list of OpenVPN client instance numbers that should be enabled on startup.",
  page: "vpn-client.asp",
  type: "string",
  defaultValue: "",
};

export const vpn_client_addr: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_addr`,
  regex: /^vpn_client(\d)_addr$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "The remote server's IP address or hostname for the OpenVPN client.",
  page: "vpn-client.asp",
  type: "string",
  validation: (value) => {
    if (value === "") return true; // Can be empty if not enabled
    const ipRegex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const domainRegex = /^[a-zA-Z0-9.-]+$/;
    return (
      ipRegex.test(value) ||
      domainRegex.test(value) ||
      "Invalid server address."
    );
  },
  ui: {
    label: "Server Address/Port",
  },
};

export const vpn_client_adns: PatternedNvramProperty<
  { unit: VpnClientUnit },
  "0" | "1" | "2" | "3"
> = {
  getKey: ({ unit }) => `vpn_client${unit}_adns`,
  regex: /^vpn_client(\d)_adns$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "Controls how DNS servers pushed by the OpenVPN server are handled.",
  page: "vpn-client.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Accept DNS configuration",
    options: [
      { value: "0", label: "Disabled" },
      { value: "1", label: "Relaxed" },
      { value: "2", label: "Strict" },
      { value: "3", label: "Exclusive" },
    ],
  },
};

export const vpn_client_br: PatternedNvramProperty<
  { unit: VpnClientUnit },
  "br0" | "br1" | "br2" | "br3"
> = {
  getKey: ({ unit }) => `vpn_client${unit}_br`,
  regex: /^vpn_client(\d)_br$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "Specifies which LAN bridge to bridge with when the interface type is TAP.",
  page: "vpn-client.asp",
  type: "enum",
  defaultValue: "br0",
  ui: {
    label: "Bridge TAP with",
    options: [
      { value: "br0", label: "LAN (br0)*" },
      { value: "br1", label: "LAN1 (br1)" },
      { value: "br2", label: "LAN2 (br2)" },
      { value: "br3", label: "LAN3 (br3)" },
    ],
  },
};

export const vpn_client_bridge: PatternedNvramProperty<
  { unit: VpnClientUnit },
  boolean
> = {
  getKey: ({ unit }) => `vpn_client${unit}_bridge`,
  regex: /^vpn_client(\d)_bridge$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "Indicates if the OpenVPN server is on the same subnet (bridged mode) for TAP interfaces.",
  page: "vpn-client.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Server is on the same subnet",
  },
};

export const vpn_client_ca: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_ca`,
  regex: /^vpn_client(\d)_ca$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The Certificate Authority (CA) certificate for TLS mode.",
  page: "vpn-client.asp",
  type: "string",
  ui: {
    label: "Certificate Authority",
  },
};

export const vpn_client_cipher: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_cipher`,
  regex: /^vpn_client(\d)_cipher$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "The data channel cipher to use for the OpenVPN client connection.",
  page: "vpn-client.asp",
  type: "enum",
  defaultValue: "default",
  ui: {
    label: "Cipher",
    options: [
      { value: "default", label: "Use Default" },
      { value: "none", label: "None" },
      { value: "CHACHA20-POLY1305", label: "CHACHA20-POLY1305" },
      { value: "AES-128-CBC", label: "AES-128-CBC" },
      { value: "AES-128-CFB", label: "AES-128-CFB" },
      { value: "AES-128-OFB", label: "AES-128-OFB" },
      { value: "AES-192-CBC", label: "AES-192-CBC" },
      { value: "AES-192-CFB", label: "AES-192-CFB" },
      { value: "AES-192-OFB", label: "AES-192-OFB" },
      { value: "AES-256-CBC", label: "AES-256-CBC" },
      { value: "AES-256-CFB", label: "AES-256-CFB" },
      { value: "AES-256-OFB", label: "AES-256-OFB" },
      { value: "AES-128-GCM", label: "AES-128-GCM" },
      { value: "AES-192-GCM", label: "AES-192-GCM" },
      { value: "AES-256-GCM", label: "AES-256-GCM" },
      { value: "BF-CBC", label: "BF-CBC" },
      { value: "BF-CFB", label: "BF-CFB" },
      { value: "BF-OFB", label: "BF-OFB" },
      { value: "DES-CBC", label: "DES-CBC" },
      { value: "DES-CFB", label: "DES-CFB" },
      { value: "DES-EDE3-CBC", label: "DES-EDE3-CBC" },
      { value: "DES-EDE3-CFB", label: "DES-EDE3-CFB" },
      { value: "DES-EDE3-OFB", label: "DES-EDE3-OFB" },
      { value: "DES-EDE-CBC", label: "DES-EDE-CBC" },
      { value: "DES-EDE-CFB", label: "DES-EDE-CFB" },
      { value: "DES-EDE-OFB", label: "DES-EDE-OFB" },
      { value: "DES-OFB", label: "DES-OFB" },
      { value: "DESX-CBC", label: "DESX-CBC" },
      { value: "CAST5-CBC", label: "CAST5-CBC" },
      { value: "CAST5-CFB", label: "CAST5-CFB" },
      { value: "CAST5-OFB", label: "CAST5-OFB" },
    ],
  },
};

export const vpn_client_cn: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_cn`,
  regex: /^vpn_client(\d)_cn$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "The specific Common Name, CN Prefix, or Subject to verify against the server certificate.",
  page: "vpn-client.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: ":",
    state: {
      dependsOn: ["vpn_client{unit}_tlsvername"],
      evaluator: (values) =>
        values["vpn_client{unit}_tlsvername"] === "0" ? "hidden" : "visible",
    },
  },
};

export const vpn_client_comp: PatternedNvramProperty<
  { unit: VpnClientUnit },
  "-1" | "no" | "lz4" | "lz4-v2" | "stub" | "stub-v2"
> = {
  getKey: ({ unit }) => `vpn_client${unit}_comp`,
  regex: /^vpn_client(\d)_comp$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The compression algorithm to use for the VPN connection.",
  page: "vpn-client.asp",
  type: "enum",
  defaultValue: "-1",
  ui: {
    label: "Compression",
    options: [
      { value: "-1", label: "Disabled" },
      { value: "no", label: "None" },
      { value: "lz4", label: "LZ4" },
      { value: "lz4-v2", label: "LZ4-V2" },
      { value: "stub", label: "Stub" },
      { value: "stub-v2", label: "Stub-V2" },
    ],
  },
};

export const vpn_client_crt: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_crt`,
  regex: /^vpn_client(\d)_crt$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The client certificate for TLS mode.",
  page: "vpn-client.asp",
  type: "string",
  ui: {
    label: "Client Certificate",
  },
};

export const vpn_client_crypt: PatternedNvramProperty<
  { unit: VpnClientUnit },
  "tls" | "secret" | "custom"
> = {
  getKey: ({ unit }) => `vpn_client${unit}_crypt`,
  regex: /^vpn_client(\d)_crypt$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The authorization mode for the OpenVPN client.",
  page: "vpn-client.asp",
  type: "enum",
  defaultValue: "tls",
  ui: {
    label: "Authorization Mode",
    options: [
      { value: "tls", label: "TLS" },
      { value: "secret", label: "Static Key" },
      { value: "custom", label: "Custom" },
    ],
  },
};

export const vpn_client_custom: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_custom`,
  regex: /^vpn_client(\d)_custom$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "Custom OpenVPN configuration options for the client.",
  page: "vpn-client.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Custom Configuration",
  },
};

export const vpn_client_digest: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_digest`,
  regex: /^vpn_client(\d)_digest$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "The authentication digest/hash algorithm to use for the OpenVPN client.",
  page: "vpn-client.asp",
  type: "enum",
  defaultValue: "default",
  ui: {
    label: "Auth digest",
    options: [
      { value: "default", label: "Use Default" },
      { value: "none", label: "None" },
      { value: "SHA1", label: "SHA1" },
      { value: "SHA224", label: "SHA224" },
      { value: "SHA256", label: "SHA256" },
      { value: "SHA384", label: "SHA384" },
      { value: "SHA512", label: "SHA512" },
      { value: "MD5", label: "MD5" },
      { value: "RSA-MD4", label: "RSA-MD4" },
      { value: "RIPEMD160", label: "RIPEMD160" },
      { value: "DSA", label: "DSA" },
      { value: "DSA-SHA", label: "DSA-SHA" },
      { value: "DSA-SHA1", label: "DSA-SHA1" },
      { value: "DSA-SHA1-old", label: "DSA-SHA1-old" },
      { value: "ecdsa-with-SHA1", label: "ecdsa-with-SHA1" },
      { value: "RSA-MD5", label: "RSA-MD5" },
      { value: "RSA-RIPEMD160", label: "RSA-RIPEMD160" },
      { value: "RSA-SHA", label: "RSA-SHA" },
      { value: "RSA-SHA1", label: "RSA-SHA1" },
      { value: "RSA-SHA1-2", label: "RSA-SHA1-2" },
      { value: "RSA-SHA224", label: "RSA-SHA224" },
      { value: "RSA-SHA256", label: "RSA-SHA256" },
      { value: "RSA-SHA384", label: "RSA-SHA384" },
      { value: "RSA-SHA512", label: "RSA-SHA512" },
      { value: "SHA", label: "SHA" },
      { value: "MD4", label: "MD4" },
    ],
  },
};

export const vpn_client_firewall: PatternedNvramProperty<
  { unit: VpnClientUnit },
  "auto" | "custom"
> = {
  getKey: ({ unit }) => `vpn_client${unit}_firewall`,
  regex: /^vpn_client(\d)_firewall$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "Firewall rule creation mode for the VPN client.",
  page: "vpn-client.asp",
  type: "enum",
  defaultValue: "auto",
  ui: {
    label: "Firewall",
    options: [
      { value: "auto", label: "Automatic" },
      { value: "custom", label: "Custom" },
    ],
  },
};

export const vpn_client_fw: PatternedNvramProperty<
  { unit: VpnClientUnit },
  boolean
> = {
  getKey: ({ unit }) => `vpn_client${unit}_fw`,
  regex: /^vpn_client(\d)_fw$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "Enables inbound firewall rules for the VPN tunnel.",
  page: "vpn-client.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Inbound Firewall",
  },
};

export const vpn_client_gw: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_gw`,
  regex: /^vpn_client(\d)_gw$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "Specifies a gateway for TAP mode when 'Redirect Internet traffic' is not 'No'.",
  page: "vpn-client.asp",
  type: "ip",
  defaultValue: "",
  validation: (value) =>
    value === "" ||
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      value,
    ) ||
    "Invalid IP address.",
  ui: {
    label: "Gateway",
  },
};

export const vpn_client_hmac: PatternedNvramProperty<
  { unit: VpnClientUnit },
  "-1" | "0" | "1" | "2" | "3" | "4"
> = {
  getKey: ({ unit }) => `vpn_client${unit}_hmac`,
  regex: /^vpn_client(\d)_hmac$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "TLS control channel security mode (tls-auth/tls-crypt).",
  page: "vpn-client.asp",
  type: "enum",
  defaultValue: "-1",
  ui: {
    label: "TLS control channel security (tls-auth/tls-crypt)",
    options: [
      { value: "-1", label: "Disabled" },
      { value: "2", label: "Bi-directional Auth" },
      { value: "0", label: "Incoming Auth (0)" },
      { value: "1", label: "Outgoing Auth (1)" },
      { value: "3", label: "Encrypt Channel" },
      { value: "4", label: "Encrypt Channel V2" },
    ],
  },
};

export const vpn_client_if: PatternedNvramProperty<
  { unit: VpnClientUnit },
  "tun" | "tap"
> = {
  getKey: ({ unit }) => `vpn_client${unit}_if`,
  regex: /^vpn_client(\d)_if$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The virtual network interface type for the OpenVPN client.",
  page: "vpn-client.asp",
  type: "enum",
  defaultValue: "tun",
  ui: {
    label: "Interface Type",
    options: [
      { value: "tap", label: "TAP" },
      { value: "tun", label: "TUN" },
    ],
  },
};

export const vpn_client_key: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_key`,
  regex: /^vpn_client(\d)_key$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The client's private key for TLS mode.",
  page: "vpn-client.asp",
  type: "string",
  ui: {
    label: "Client Key",
  },
};

export const vpn_client_local: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_local`,
  regex: /^vpn_client(\d)_local$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The local endpoint IP address for the VPN tunnel.",
  page: "vpn-client.asp",
  type: "ip",
  validation: (value) =>
    value === "" ||
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      value,
    ) ||
    "Invalid IP address.",
  ui: {
    label: "Local/remote endpoint addresses",
  },
};

export const vpn_client_nat: PatternedNvramProperty<
  { unit: VpnClientUnit },
  boolean
> = {
  getKey: ({ unit }) => `vpn_client${unit}_nat`,
  regex: /^vpn_client(\d)_nat$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "Creates a NAT (Network Address Translation) rule on the VPN tunnel, allowing LAN clients to access the internet through the VPN.",
  page: "vpn-client.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "Create NAT on tunnel",
  },
};

export const vpn_client_ncp_ciphers: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_ncp_ciphers`,
  regex: /^vpn_client(\d)_ncp_ciphers$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "A colon-separated list of allowed data channel ciphers for Negotiable Crypto Parameters (NCP).",
  page: "vpn-client.asp",
  type: "string",
  defaultValue:
    "CHACHA20-POLY1305:AES-128-GCM:AES-256-GCM:AES-128-CBC:AES-256-CBC",
  ui: {
    label: "Data ciphers",
  },
};

export const vpn_client_nm: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_nm`,
  regex: /^vpn_client(\d)_nm$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The netmask for the VPN tunnel's local endpoint.",
  page: "vpn-client.asp",
  type: "netmask",
  defaultValue: "255.255.255.0",
  validation: netmaskValidator,
  ui: {
    label: "Tunnel address/netmask",
  },
};

export const vpn_client_password: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_password`,
  regex: /^vpn_client(\d)_password$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The password for username/password authentication.",
  page: "vpn-client.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Password:",
  },
};

export const vpn_client_poll: PatternedNvramProperty<
  { unit: VpnClientUnit },
  number
> = {
  getKey: ({ unit }) => `vpn_client${unit}_poll`,
  regex: /^vpn_client(\d)_poll$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "The interval in minutes to check if the VPN client is running and restart it if it's down. 0 disables the check.",
  page: "vpn-client.asp",
  type: "integer",
  defaultValue: 0,
  validation: rangeValidator(0, 30),
  ui: {
    label: "Poll Interval",
  },
};

export const vpn_client_port: PatternedNvramProperty<
  { unit: VpnClientUnit },
  number
> = {
  getKey: ({ unit }) => `vpn_client${unit}_port`,
  regex: /^vpn_client(\d)_port$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The port number of the remote OpenVPN server.",
  page: "vpn-client.asp",
  type: "integer",
  defaultValue: 1194,
  validation: portValidator,
  ui: {
    label: "Server Address/Port",
  },
};

export const vpn_client_proto: PatternedNvramProperty<
  { unit: VpnClientUnit },
  "udp" | "tcp-client" | "udp4" | "tcp4-client" | "udp6" | "tcp6-client"
> = {
  getKey: ({ unit }) => `vpn_client${unit}_proto`,
  regex: /^vpn_client(\d)_proto$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The transport protocol to use for the VPN connection.",
  page: "vpn-client.asp",
  type: "enum",
  defaultValue: "udp",
  ui: {
    label: "Protocol",
    options: [
      { value: "udp", label: "UDP" },
      { value: "tcp-client", label: "TCP" },
      { value: "udp4", label: "UDP4" },
      { value: "tcp4-client", label: "TCP4" },
      { value: "udp6", label: "UDP6" },
      { value: "tcp6-client", label: "TCP6" },
    ],
  },
};

export const vpn_client_remote: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_remote`,
  regex: /^vpn_client(\d)_remote$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The remote endpoint IP address for the VPN tunnel.",
  page: "vpn-client.asp",
  type: "ip",
  validation: (value) =>
    value === "" ||
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      value,
    ) ||
    "Invalid IP address.",
  ui: {
    label: "Local/remote endpoint addresses",
  },
};

export const vpn_client_reneg: PatternedNvramProperty<
  { unit: VpnClientUnit },
  number
> = {
  getKey: ({ unit }) => `vpn_client${unit}_reneg`,
  regex: /^vpn_client(\d)_reneg$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "TLS renegotiation time in seconds. -1 uses the OpenVPN default.",
  page: "vpn-client.asp",
  type: "integer",
  defaultValue: -1,
  validation: (value) =>
    (value >= -1 && value <= 2147483647) || "Invalid renegotiation time.",
  ui: {
    label: "TLS Renegotiation Time",
  },
};

export const vpn_client_retry: PatternedNvramProperty<
  { unit: VpnClientUnit },
  number
> = {
  getKey: ({ unit }) => `vpn_client${unit}_retry`,
  regex: /^vpn_client(\d)_retry$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "Connection retry interval in seconds. -1 means infinite retries.",
  page: "vpn-client.asp",
  type: "integer",
  defaultValue: 30,
  validation: (value) =>
    (value >= -1 && value <= 32767) || "Invalid retry interval.",
  ui: {
    label: "Connection retry",
  },
};

export const vpn_client_rgw: PatternedNvramProperty<
  { unit: VpnClientUnit },
  "0" | "1" | "2" | "3"
> = {
  getKey: ({ unit }) => `vpn_client${unit}_rgw`,
  regex: /^vpn_client(\d)_rgw$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "Controls if and how internet traffic should be redirected through the VPN tunnel.",
  page: "vpn-client.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Redirect Internet traffic",
    options: [
      { value: "0", label: "No" },
      { value: "1", label: "All" },
      { value: "2", label: "Routing Policy" },
      { value: "3", label: "Routing Policy (strict)" },
    ],
  },
};

export const vpn_client_routing_val: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_routing_val`,
  regex: /^vpn_client(\d)_routing_val$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "Stores the routing policy rules as a structured string for the client.",
  page: "vpn-client.asp",
  type: "structured-string",
  defaultValue: "",
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        enabled: { type: "boolean", label: "Enabled", defaultValue: false },
        ruleType: {
          type: "integer",
          label: "Rule Type",
          defaultValue: 1,
        },
        match: {
          type: "string",
          label: "Match Value",
          defaultValue: "",
        },
        killSwitch: {
          type: "boolean",
          label: "Kill Switch",
          defaultValue: false,
        },
      },
    },
  },
};

export const vpn_client_static: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_static`,
  regex: /^vpn_client(\d)_static$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The static key used for 'Static Key' authorization mode.",
  page: "vpn-client.asp",
  type: "string",
  ui: {
    label: "Static Key",
  },
};

export const vpn_client_tlsremote: PatternedNvramProperty<
  { unit: VpnClientUnit },
  boolean
> = {
  getKey: ({ unit }) => `vpn_client${unit}_tlsremote`,
  regex: /^vpn_client(\d)_tlsremote$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "Enables verification of the server certificate's extended key usage (remote-cert-tls server).",
  page: "vpn-client.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Verify Certificate (remote-cert-tls server)",
  },
};

export const vpn_client_tlsvername: PatternedNvramProperty<
  { unit: VpnClientUnit },
  "0" | "1" | "2" | "3"
> = {
  getKey: ({ unit }) => `vpn_client${unit}_tlsvername`,
  regex: /^vpn_client(\d)_tlsvername$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "Specifies the method for verifying the server certificate's name (verify-x509-name).",
  page: "vpn-client.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Verify Server Certificate Name (verify-x509-name)",
    options: [
      { value: "0", label: "No" },
      { value: "1", label: "Common Name" },
      { value: "2", label: "Common Name Prefix" },
      { value: "3", label: "Subject" },
    ],
  },
};

export const vpn_client_userauth: PatternedNvramProperty<
  { unit: VpnClientUnit },
  boolean
> = {
  getKey: ({ unit }) => `vpn_client${unit}_userauth`,
  regex: /^vpn_client(\d)_userauth$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "Enables username and password authentication in addition to TLS certificates.",
  page: "vpn-client.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Username/Password Authentication",
  },
};

export const vpn_client_username: PatternedNvramProperty<
  { unit: VpnClientUnit },
  string
> = {
  getKey: ({ unit }) => `vpn_client${unit}_username`,
  regex: /^vpn_client(\d)_username$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description: "The username for username/password authentication.",
  page: "vpn-client.asp",
  type: "string",
  defaultValue: "",
  ui: {
    label: "Username:",
  },
};

export const vpn_client_useronly: PatternedNvramProperty<
  { unit: VpnClientUnit },
  boolean
> = {
  getKey: ({ unit }) => `vpn_client${unit}_useronly`,
  regex: /^vpn_client(\d)_useronly$/,
  parameters: {
    unit: {
      type: "integer",
      description: "Client instance number",
      range: [1, 3],
    },
  },
  description:
    "If enabled, authentication is based solely on username/password, and client certificate/key are not used.",
  page: "vpn-client.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Username Authen. Only",
  },
};

// --- Reusable Types for VPN Server ---
interface VpnServerCcdEntry {
  id: number;
  enabled: boolean;
  commonName: string;
  subnet: string;
  netmask: string;
  push: boolean;
}

interface VpnServerUserEntry {
  id: number;
  enabled: boolean;
  username: string;
  password: string;
}

// --- Reusable Helper Functions ---

const getWanPrefix = (unit: number): string =>
  unit > 1 ? `wan${unit}` : "wan";

const vpnServerUserTransformer: ValueTransformer<VpnServerUserEntry[]> = {
  toUi: (value) => {
    return value
      .split(">")
      .filter((v) => v)
      .map((v, i) => {
        const parts = v.split("<");
        return {
          id: i + 1,
          enabled: parts[0] === "1",
          username: parts[1] || "",
          password: parts[2] || "",
        };
      });
  },
  fromUi: (value) => {
    return value
      .map((v) => `${v.enabled ? "1" : "0"}<${v.username}<${v.password}`)
      .join(">");
  },
};

const vpnServerCcdTransformer: ValueTransformer<VpnServerCcdEntry[]> = {
  toUi: (value) => {
    return value
      .split(">")
      .filter((v) => v)
      .map((v, i) => {
        const parts = v.split("<");
        return {
          id: i + 1,
          enabled: parts[0] === "1",
          commonName: parts[1] || "",
          subnet: parts[2] || "",
          netmask: parts[3] || "",
          push: parts[4] === "1",
        };
      });
  },
  fromUi: (value) => {
    return value
      .map(
        (v) =>
          `${v.enabled ? "1" : "0"}<${v.commonName}<${v.subnet}<${v.netmask}<${
            v.push ? "1" : "0"
          }`,
      )
      .join(">");
  },
};

// --- NVRAM Catalog Constants ---

export const vpn_server_dns: NvramProperty<string[]> = {
  key: "vpn_server_dns",
  description:
    "A comma-separated list of OpenVPN server instances that should respond to DNS queries from clients.",
  page: "vpn-server.asp",
  type: "list",
  defaultValue: [],
  transform: {
    toUi: (v) => v.split(",").filter((i) => i),
    fromUi: (v) => v.join(","),
  },
  ui: {
    label: "Respond to DNS",
  },
};

export const vpn_server_eas: NvramProperty<string[]> = {
  key: "vpn_server_eas",
  description:
    "A comma-separated list of OpenVPN server instances that should start on boot.",
  page: "vpn-server.asp",
  type: "list",
  defaultValue: [],
  transform: {
    toUi: (v) => v.split(",").filter((i) => i),
    fromUi: (v) => v.join(","),
  },
  ui: {
    label: "Enable on Start",
  },
};

const vpnServerPatternedProperty = <T>(
  suffix: string,
  base: Omit<
    PatternedNvramProperty<{ unit: 1 | 2 }, T>,
    "getKey" | "regex" | "parameters"
  >,
): PatternedNvramProperty<{ unit: 1 | 2 }, T> => ({
  ...base,
  getKey: (params) => `vpn_server${params.unit}_${suffix}`,
  regex: new RegExp(`^vpn_server([12])_${suffix}$`),
  parameters: {
    unit: {
      type: "integer",
      description: "OpenVPN Server instance number (1 or 2)",
      range: [1, 2],
    },
  },
});

export const vpn_server_br = vpnServerPatternedProperty<
  "br0" | "br1" | "br2" | "br3"
>("br", {
  description: "Specifies which LAN bridge to bridge the TAP interface with.",
  page: "vpn-server.asp",
  type: "enum",
  defaultValue: "br0",
  ui: {
    label: "Bridge TAP with",
    options: [
      { value: "br0", label: "LAN0 (br0)*" },
      { value: "br1", label: "LAN1 (br1)" },
      { value: "br2", label: "LAN2 (br2)" },
      { value: "br3", label: "LAN3 (br3)" },
    ],
  },
});

export const vpn_server_c2c = vpnServerPatternedProperty<boolean>("c2c", {
  description: "Allow client-to-client traffic within the VPN.",
  page: "vpn-server.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Allow Client<->Client" },
});

export const vpn_server_ca = vpnServerPatternedProperty<string>("ca", {
  description:
    "The Certificate Authority (CA) certificate for the OpenVPN server.",
  page: "vpn-server.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Certificate Authority" },
});

export const vpn_server_ca_key = vpnServerPatternedProperty<string>("ca_key", {
  description:
    "The Certificate Authority (CA) private key, used for generating new client certificates.",
  page: "vpn-server.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Certificate Authority Key" },
});

export const vpn_server_ccd = vpnServerPatternedProperty<boolean>("ccd", {
  description: "Enable management of client-specific configurations.",
  page: "vpn-server.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Manage Client-Specific Options" },
});

export const vpn_server_ccd_excl = vpnServerPatternedProperty<boolean>(
  "ccd_excl",
  {
    description:
      "If enabled, only clients defined in the Client-Specific Configuration list are allowed to connect.",
    page: "vpn-server.asp",
    type: "boolean",
    defaultValue: false,
    transform: booleanTransformer,
    ui: { label: "Allow Only These Clients" },
  },
);

export const vpn_server_ccd_val = vpnServerPatternedProperty<
  VpnServerCcdEntry[]
>("ccd_val", {
  description:
    "List of client-specific configurations (Common Name, Subnet, Netmask, Push Routes).",
  page: "vpn-server.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        enabled: { type: "boolean", label: "Enabled", defaultValue: false },
        commonName: {
          type: "string",
          label: "Common Name",
          defaultValue: "",
        },
        subnet: { type: "string", label: "Subnet", defaultValue: "" },
        netmask: { type: "string", label: "Netmask", defaultValue: "" },
        push: { type: "boolean", label: "Push Route", defaultValue: false },
      },
    },
  },
  transform: vpnServerCcdTransformer,
});

export const vpn_server_cipher = vpnServerPatternedProperty<string>("cipher", {
  description: "The data channel cipher to use for the OpenVPN server.",
  page: "vpn-server.asp",
  type: "enum",
  defaultValue: "AES-128-CBC",
  ui: {
    label: "Cipher",
    options: [
      { value: "default", label: "Use Default" },
      { value: "none", label: "None" },
      { value: "CHACHA20-POLY1305", label: "CHACHA20-POLY1305" },
      { value: "AES-128-CBC", label: "AES-128-CBC" },
      { value: "AES-128-CFB", label: "AES-128-CFB" },
      { value: "AES-128-OFB", label: "AES-128-OFB" },
      { value: "AES-192-CBC", label: "AES-192-CBC" },
      { value: "AES-192-CFB", label: "AES-192-CFB" },
      { value: "AES-192-OFB", label: "AES-192-OFB" },
      { value: "AES-256-CBC", label: "AES-256-CBC" },
      { value: "AES-256-CFB", label: "AES-256-CFB" },
      { value: "AES-256-OFB", label: "AES-256-OFB" },
      { value: "AES-128-GCM", label: "AES-128-GCM" },
      { value: "AES-192-GCM", label: "AES-192-GCM" },
      { value: "AES-256-GCM", label: "AES-256-GCM" },
      { value: "BF-CBC", label: "BF-CBC" },
      { value: "BF-CFB", label: "BF-CFB" },
      { value: "BF-OFB", label: "BF-OFB" },
      { value: "DES-CBC", label: "DES-CBC" },
      { value: "DES-CFB", label: "DES-CFB" },
      { value: "DES-EDE3-CBC", label: "DES-EDE3-CBC" },
      { value: "DES-EDE3-CFB", label: "DES-EDE3-CFB" },
      { value: "DES-EDE3-OFB", label: "DES-EDE3-OFB" },
      { value: "DES-EDE-CBC", label: "DES-EDE-CBC" },
      { value: "DES-EDE-CFB", label: "DES-EDE-CFB" },
      { value: "DES-EDE-OFB", label: "DES-EDE-OFB" },
      { value: "DES-OFB", label: "DES-OFB" },
      { value: "DESX-CBC", label: "DESX-CBC" },
      { value: "CAST5-CBC", label: "CAST5-CBC" },
      { value: "CAST5-CFB", label: "CAST5-CFB" },
      { value: "CAST5-OFB", label: "CAST5-OFB" },
      { value: "CAMELLIA-128-CBC", label: "CAMELLIA-128-CBC" },
      { value: "CAMELLIA-192-CBC", label: "CAMELLIA-192-CBC" },
      { value: "CAMELLIA-256-CBC", label: "CAMELLIA-256-CBC" },
    ],
  },
});

export const vpn_server_comp = vpnServerPatternedProperty<
  "-1" | "no" | "lz4" | "lz4-v2" | "stub" | "stub-v2"
>("comp", {
  description: "Specifies the compression algorithm for the VPN tunnel.",
  page: "vpn-server.asp",
  type: "enum",
  defaultValue: "-1",
  ui: {
    label: "Compression",
    options: [
      { value: "-1", label: "Disabled" },
      { value: "no", label: "None" },
      { value: "lz4", label: "LZ4" },
      { value: "lz4-v2", label: "LZ4-V2" },
    ],
  },
});

export const vpn_server_crl = vpnServerPatternedProperty<string>("crl", {
  description: "The Certificate Revocation List (CRL) file content.",
  page: "vpn-server.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "CRL file" },
});

export const vpn_server_crt = vpnServerPatternedProperty<string>("crt", {
  description: "The server's public certificate.",
  page: "vpn-server.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Server Certificate" },
});

export const vpn_server_crypt = vpnServerPatternedProperty<
  "tls" | "secret" | "custom"
>("crypt", {
  description: "The primary authorization mode for the VPN server.",
  page: "vpn-server.asp",
  type: "enum",
  defaultValue: "tls",
  ui: {
    label: "Authorization Mode",
    options: [
      { value: "tls", label: "TLS" },
      { value: "secret", label: "Static Key" },
      { value: "custom", label: "Custom" },
    ],
  },
});

export const vpn_server_custom = vpnServerPatternedProperty<string>("custom", {
  description: "Custom OpenVPN server configuration options.",
  page: "vpn-server.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Custom Configuration" },
});

export const vpn_server_dh = vpnServerPatternedProperty<string>("dh", {
  description: "Diffie-Hellman parameters for key exchange.",
  page: "vpn-server.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Diffie-Hellman parameters" },
});

export const vpn_server_dhcp = vpnServerPatternedProperty<boolean>("dhcp", {
  description:
    "Enable DHCP on the TAP interface to assign addresses to clients.",
  page: "vpn-server.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: { label: "Client address pool" },
});

export const vpn_server_digest = vpnServerPatternedProperty<string>("digest", {
  description:
    "The authentication digest/hash algorithm to use for the OpenVPN server.",
  page: "vpn-server.asp",
  type: "enum",
  defaultValue: "default",
  ui: {
    label: "Auth digest",
    options: [
      { value: "default", label: "Use Default" },
      { value: "none", label: "None" },
      { value: "SHA1", label: "SHA1" },
      { value: "SHA224", label: "SHA224" },
      { value: "SHA256", label: "SHA256" },
      { value: "SHA384", label: "SHA384" },
      { value: "SHA512", label: "SHA512" },
      { value: "MD5", label: "MD5" },
      { value: "RSA-MD4", label: "RSA-MD4" },
      { value: "RIPEMD160", label: "RIPEMD160" },
    ],
  },
});

export const vpn_server_ecdh = vpnServerPatternedProperty<boolean>("ecdh", {
  description:
    "Use Elliptic Curve Diffie-Hellman (ECDH) keys instead of standard RSA/DH.",
  page: "vpn-server.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "use ECDH keys" },
});

export const vpn_server_firewall = vpnServerPatternedProperty<
  "auto" | "external" | "custom"
>("firewall", {
  description:
    "Controls how firewall rules are automatically configured for the VPN server.",
  page: "vpn-server.asp",
  type: "enum",
  defaultValue: "auto",
  ui: {
    label: "Firewall",
    options: [
      { value: "auto", label: "Automatic" },
      { value: "external", label: "External Only" },
      { value: "custom", label: "Custom" },
    ],
  },
});

export const vpn_server_hmac = vpnServerPatternedProperty<
  "-1" | "0" | "1" | "2" | "3" | "4"
>("hmac", {
  description: "TLS control channel security mode (tls-auth/tls-crypt).",
  page: "vpn-server.asp",
  type: "enum",
  defaultValue: "-1",
  ui: {
    label: "TLS control channel security",
    options: [
      { value: "-1", label: "Disabled" },
      { value: "2", label: "Bi-directional Auth" },
      { value: "0", label: "Incoming Auth (0)" },
      { value: "1", label: "Outgoing Auth (1)" },
      { value: "3", label: "Encrypt Channel" },
      { value: "4", label: "Encrypt Channel V2" },
    ],
  },
});

export const vpn_server_if = vpnServerPatternedProperty<"tun" | "tap">("if", {
  description: "The virtual network interface type for the VPN.",
  page: "vpn-server.asp",
  type: "enum",
  defaultValue: "tun",
  ui: {
    label: "Interface Type",
    options: [
      { value: "tap", label: "TAP" },
      { value: "tun", label: "TUN" },
    ],
  },
});

export const vpn_server_key = vpnServerPatternedProperty<string>("key", {
  description: "The server's private key.",
  page: "vpn-server.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Server Key" },
});

export const vpn_server_local = vpnServerPatternedProperty<string>("local", {
  description: "The local endpoint IP address for a TUN-based Static Key VPN.",
  page: "vpn-server.asp",
  type: "ip",
  defaultValue: "10.6.0.1", // Default for server 1
  ui: { label: "Local/remote endpoint addresses" },
});

export const vpn_server_ncp_ciphers = vpnServerPatternedProperty<string>(
  "ncp_ciphers",
  {
    description:
      "A colon-separated list of allowed data ciphers for Negotiable Crypto Parameters (NCP).",
    page: "vpn-server.asp",
    type: "string",
    defaultValue:
      "CHACHA20-POLY1305:AES-128-GCM:AES-256-GCM:AES-128-CBC:AES-256-CBC",
    ui: { label: "Data ciphers" },
  },
);

export const vpn_server_nm = vpnServerPatternedProperty<string>("nm", {
  description: "The netmask for the VPN subnet.",
  page: "vpn-server.asp",
  type: "netmask",
  defaultValue: "255.255.255.0",
  ui: { label: "VPN subnet/netmask" },
});

export const vpn_server_nocert = vpnServerPatternedProperty<boolean>("nocert", {
  description:
    "Allow clients to connect using only username/password authentication, without a client certificate.",
  page: "vpn-server.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Allow Only User/Pass (without cert) Auth" },
});

export const vpn_server_pdns = vpnServerPatternedProperty<boolean>("pdns", {
  description: "Push the router's DNS server address to connecting clients.",
  page: "vpn-server.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Advertise DNS to clients" },
});

export const vpn_server_plan = vpnServerPatternedProperty<boolean>("plan", {
  description:
    "Push the LAN0 (br0) route to clients, allowing them to access the LAN.",
  page: "vpn-server.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: { label: "Push LAN0 (br0) to clients" },
});

export const vpn_server_plan1 = vpnServerPatternedProperty<boolean>("plan1", {
  description: "Push the LAN1 (br1) route to clients.",
  page: "vpn-server.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Push LAN1 (br1) to clients" },
});

export const vpn_server_plan2 = vpnServerPatternedProperty<boolean>("plan2", {
  description: "Push the LAN2 (br2) route to clients.",
  page: "vpn-server.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Push LAN2 (br2) to clients" },
});

export const vpn_server_plan3 = vpnServerPatternedProperty<boolean>("plan3", {
  description: "Push the LAN3 (br3) route to clients.",
  page: "vpn-server.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Push LAN3 (br3) to clients" },
});

export const vpn_server_poll = vpnServerPatternedProperty<number>("poll", {
  description:
    "Interval in minutes to check and restart the server if it's down. 0 disables this.",
  page: "vpn-server.asp",
  type: "integer",
  defaultValue: 0,
  validation: rangeValidator(0, 30),
  ui: { label: "Poll Interval" },
});

export const vpn_server_port = vpnServerPatternedProperty<number>("port", {
  description:
    "The port on which the OpenVPN server will listen for connections.",
  page: "vpn-server.asp",
  type: "integer",
  defaultValue: 1194, // Default for server 1
  validation: portValidator,
  ui: { label: "Port" },
});

export const vpn_server_proto = vpnServerPatternedProperty<
  "udp" | "tcp-server" | "udp4" | "tcp4-server" | "udp6" | "tcp6-server"
>("proto", {
  description: "The transport protocol for the VPN server.",
  page: "vpn-server.asp",
  type: "enum",
  defaultValue: "udp",
  ui: {
    label: "Protocol",
    options: [
      { value: "udp", label: "UDP" },
      { value: "tcp-server", label: "TCP" },
      { value: "udp4", label: "UDP4" },
      { value: "tcp4-server", label: "TCP4" },
      { value: "udp6", label: "UDP6" },
      { value: "tcp6-server", label: "TCP6" },
    ],
  },
});

export const vpn_server_r1 = vpnServerPatternedProperty<string>("r1", {
  description: "The starting IP address of the client address pool.",
  page: "vpn-server.asp",
  type: "ip",
  defaultValue: "192.168.1.50",
  ui: { label: "Client address pool" },
});

export const vpn_server_r2 = vpnServerPatternedProperty<string>("r2", {
  description: "The ending IP address of the client address pool.",
  page: "vpn-server.asp",
  type: "ip",
  defaultValue: "192.168.1.55",
  ui: { label: "Client address pool" },
});

export const vpn_server_remote = vpnServerPatternedProperty<string>("remote", {
  description: "The remote endpoint IP address for a TUN-based Static Key VPN.",
  page: "vpn-server.asp",
  type: "ip",
  defaultValue: "10.6.0.2", // Default for server 1
  ui: { label: "Local/remote endpoint addresses" },
});

export const vpn_server_reneg = vpnServerPatternedProperty<number>("reneg", {
  description:
    "TLS renegotiation time in seconds. -1 uses the OpenVPN default.",
  page: "vpn-server.asp",
  type: "integer",
  defaultValue: -1,
  validation: rangeValidator(-1, 2147483647),
  ui: { label: "TLS Renegotiation Time" },
});

export const vpn_server_rgw = vpnServerPatternedProperty<boolean>("rgw", {
  description: "Direct all client internet traffic through the VPN.",
  page: "vpn-server.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Direct clients to redirect Internet traffic" },
});

export const vpn_server_sn = vpnServerPatternedProperty<string>("sn", {
  description: "The subnet for the VPN.",
  page: "vpn-server.asp",
  type: "ip",
  defaultValue: "10.6.0.0", // Default for server 1
  ui: { label: "VPN subnet/netmask" },
});

export const vpn_server_static = vpnServerPatternedProperty<string>("static", {
  description: "The static key for a Static Key or TLS-Auth/Crypt VPN.",
  page: "vpn-server.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Static Key" },
});

export const vpn_server_userpass = vpnServerPatternedProperty<boolean>(
  "userpass",
  {
    description: "Enable username/password authentication for clients.",
    page: "vpn-server.asp",
    type: "boolean",
    defaultValue: false,
    transform: booleanTransformer,
    ui: { label: "Allow User/Pass Auth" },
  },
);

export const vpn_server_users_val = vpnServerPatternedProperty<
  VpnServerUserEntry[]
>("users_val", {
  description: "List of users for username/password authentication.",
  page: "vpn-server.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        enabled: { type: "boolean", label: "Enabled", defaultValue: false },
        username: { type: "string", label: "Username", defaultValue: "" },
        password: {
          type: "string",
          label: "Password",
          defaultValue: "",
          optional: true,
        },
      },
    },
  },
  transform: vpnServerUserTransformer,
});

export const wait_time: NvramProperty<number> = {
  key: "wait_time",
  description:
    "The delay in seconds before the bootloader (CFE) starts booting the firmware. Allows for recovery.",
  page: "advanced-misc.asp",
  type: "integer",
  defaultValue: 3,
  validation: rangeValidator(3, 20),
  ui: {
    label: "Boot Wait Time *",
    options: [
      3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ].map((v) => ({ value: v, label: `${v} seconds` })),
  },
};

export const wan_addget = vpnServerPatternedProperty<boolean>("addget", {
  description:
    "When enabled, DNS servers received from the WAN DHCP server are added to the list of user-entered DNS servers.",
  page: "advanced-dhcpdns.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Use received DNS with user-entered DNS",
    state: {
      dependsOn: [
        "wan{unit}_proto",
        "dnscrypt_proxy",
        "dnscrypt_priority",
        "stubby_proxy",
        "stubby_priority",
      ],
      evaluator: (values) => {
        const proto = values["wan{unit}_proto"];
        if (
          proto === "disabled" ||
          (values["dnscrypt_proxy"] === "1" &&
            values["dnscrypt_priority"] === "2") ||
          (values["stubby_proxy"] === "1" && values["stubby_priority"] === "2")
        ) {
          return "disabled";
        }
        return "enabled";
      },
    },
  },
});

const wanPatternedProperty = <T>(
  suffix: string,
  base: Omit<
    PatternedNvramProperty<{ unit: 1 | 2 | 3 | 4 }, T>,
    "getKey" | "regex" | "parameters"
  >,
): PatternedNvramProperty<{ unit: 1 | 2 | 3 | 4 }, T> => ({
  ...base,
  getKey: (params) => `${getWanPrefix(params.unit)}_${suffix}`,
  regex: new RegExp(`^wan[2-4]?_${suffix}$`),
  parameters: {
    unit: {
      type: "integer",
      description: "WAN instance number (1-4)",
      range: [1, 4],
    },
  },
});

export const wan_ck_pause = wanPatternedProperty<boolean>("ck_pause", {
  description:
    "Disables the MultiWAN watchdog for this specific WAN interface.",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Disable Watchdog",
    state: {
      dependsOn: ["mwan_cktime"],
      evaluator: (values) =>
        values.mwan_cktime === "0" ? "disabled" : "enabled",
    },
  },
});

export const wan_ckmtd = wanPatternedProperty<"1" | "2" | "3">("ckmtd", {
  description:
    "The method used by the MultiWAN watchdog to check for internet connectivity.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "2",
  ui: {
    label: "Watchdog Mode",
    options: [
      { value: "1", label: "Ping" },
      { value: "2", label: "Traceroute*" },
      { value: "3", label: "Curl" },
    ],
    state: {
      dependsOn: ["mwan_cktime", "wan{unit}_ck_pause"],
      evaluator: (values) =>
        values.mwan_cktime === "0" || values["wan{unit}_ck_pause"] === "1"
          ? "disabled"
          : "enabled",
    },
  },
});

export const wan_dhcp_pass: NvramProperty<boolean> = {
  key: "wan_dhcp_pass",
  description:
    "Accept/process packets from DHCP servers whose IP is different from the one advertised within the DHCP messages. Enabling this lowers security.",
  page: "advanced-firewall.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Allow DHCP spoofing" },
};

export const wan_dns = wanPatternedProperty<string[]>("dns", {
  description:
    "A space-separated list of static DNS servers for this WAN interface.",
  page: "basic-network.asp",
  type: "list",
  transform: {
    toUi: (v) => v.split(" "),
    fromUi: (v) => v.join(" "),
  },
});

export const wan_dns_auto = wanPatternedProperty<boolean>("dns_auto", {
  description:
    "If enabled, automatically use DNS servers provided by the ISP for this WAN interface.",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "DNS Server",
    options: [
      { value: true, label: "Auto" },
      { value: false, label: "Manual" },
    ],
  },
});

export const wan_domain = wanPatternedProperty<string>("domain", {
  description:
    "The domain name for the router, often sent to the ISP's DHCP server.",
  page: "basic-ident.asp",
  type: "string",
  defaultValue: "",
  validation: (value) =>
    /^[a-zA-Z0-9_\-\.]+$/.test(value) || value === "" || "Invalid domain name.",
  ui: { label: "Domain Name" },
});

export const wan_gateway = wanPatternedProperty<string>("gateway", {
  description: "The gateway IP address for a static IP configuration.",
  page: "basic-network.asp",
  type: "ip",
  defaultValue: "0.0.0.0",
  ui: { label: "Gateway" },
});

export const wan_gateway_get = wanPatternedProperty<string>("gateway_get", {
  description:
    "Read-only value representing the gateway IP address currently obtained from the ISP.",
  page: "status-devices.asp",
  type: "ip",
});

export const wan_hilink_ip = wanPatternedProperty<string>("hilink_ip", {
  description:
    "IP address of a Huawei HiLink (stick) modem for status querying. 0.0.0.0 to disable.",
  page: "basic-network.asp",
  type: "ip",
  defaultValue: "0.0.0.0",
  ui: {
    label: "Query HiLink Modem IP",
    state: {
      dependsOn: ["wan{unit}_proto"],
      evaluator: (values) =>
        ["lte", "ppp3g"].includes(values["wan{unit}_proto"] || "")
          ? "enabled"
          : "disabled",
    },
  },
});

export const wan_hostname = wanPatternedProperty<string>("hostname", {
  description: "The hostname for the router, sent to the ISP's DHCP server.",
  page: "basic-ident.asp",
  type: "string",
  defaultValue: "router",
  validation: (value) =>
    /^[a-zA-Z0-9_\-]+$/.test(value) || value === "" || "Invalid hostname.",
  ui: { label: "Hostname" },
});

export const wan_hwaddr = wanPatternedProperty<string>("hwaddr", {
  description:
    "Read-only value showing the current MAC address of the WAN interface.",
  page: "status-devices.asp",
  type: "mac",
});

export const wan_iface = wanPatternedProperty<string>("iface", {
  description:
    "The actual kernel network interface name for the WAN connection (e.g., vlan2, ppp0). Read-only.",
  page: "advanced-routing.asp",
  type: "string",
});

export const wan_ifname = wanPatternedProperty<string>("ifname", {
  description:
    "The base physical interface name for the WAN connection (e.g., vlan2, eth1). Read-only.",
  page: "advanced-routing.asp",
  type: "string",
});

export const wan_ifnames = wanPatternedProperty<string>("ifnames", {
  description:
    "A space-separated list of all associated interfaces for this logical WAN. Read-only.",
  page: "status-devices.asp",
  type: "string",
});

export const wan_ifnameX = wanPatternedProperty<string>("ifnameX", {
  description:
    "The VLAN interface name assigned to this WAN (e.g., vlan2). Configured via the VLAN page.",
  page: "advanced-vlan.asp",
  type: "string",
});

export const wan_ipaddr = wanPatternedProperty<string>("ipaddr", {
  description:
    "The IP address for a static IP configuration or the currently assigned IP.",
  page: "basic-network.asp",
  type: "ip",
  defaultValue: "0.0.0.0",
  ui: { label: "IP Address" },
});

export const wan_l2tp_server_ip = wanPatternedProperty<string>(
  "l2tp_server_ip",
  {
    description: "The IP address or domain name of the L2TP server.",
    page: "basic-network.asp",
    type: "string",
    defaultValue: "",
    ui: { label: "L2TP Server" },
  },
);

export const wan_mac = wanPatternedProperty<string>("mac", {
  description:
    "The MAC address to use for the WAN interface. If empty, the default hardware MAC is used.",
  page: "advanced-mac.asp",
  type: "mac",
  defaultValue: "",
  ui: { label: "WAN Port" },
});

export const wan_modem_apn = wanPatternedProperty<string>("modem_apn", {
  description: "The Access Point Name (APN) for a 3G/LTE modem connection.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "internet",
  ui: { label: "APN" },
});

export const wan_modem_band = wanPatternedProperty<string>("modem_band", {
  description: "Specifies the preferred LTE band for a non-HiLink modem.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "7FFFFFFFFFFFFFFF",
  ui: {
    label: "LTE Band",
    options: [
      { value: "7FFFFFFFFFFFFFFF", label: "All supported*" },
      { value: "80000", label: "B20 (800 MHz)" },
      { value: "80", label: "B8 (900 MHz)" },
      { value: "4", label: "B3 (1800 MHz)" },
      { value: "1", label: "B1 (2100 MHz)" },
      { value: "40", label: "B7 (2600 MHz)" },
    ],
  },
});

export const wan_modem_dev = wanPatternedProperty<string>("modem_dev", {
  description: "The device file for the 3G modem (e.g., /dev/ttyUSB0).",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "/dev/ttyUSB0",
  ui: {
    label: "Modem device",
    options: [
      { value: "/dev/ttyUSB0", label: "/dev/ttyUSB0" },
      { value: "/dev/ttyUSB1", label: "/dev/ttyUSB1" },
      { value: "/dev/ttyUSB2", label: "/dev/ttyUSB2" },
      { value: "/dev/ttyUSB3", label: "/dev/ttyUSB3" },
      { value: "/dev/ttyUSB4", label: "/dev/ttyUSB4" },
      { value: "/dev/ttyUSB5", label: "/dev/ttyUSB5" },
      { value: "/dev/ttyUSB6", label: "/dev/ttyUSB6" },
      { value: "/dev/ttyACM0", label: "/dev/ttyACM0" },
    ],
  },
});

export const wan_modem_init = wanPatternedProperty<string>("modem_init", {
  description: "The initialization string (AT command) for a 3G modem.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "*99#",
  ui: { label: "Modem init string" },
});

export const wan_modem_ipaddr = wanPatternedProperty<string>("modem_ipaddr", {
  description:
    "IP address to route modem's web interface, must be in a different subnet. 0.0.0.0 to disable.",
  page: "basic-network.asp",
  type: "ip",
  defaultValue: "0.0.0.0",
  ui: { label: "Route Modem IP" },
});

export const wan_modem_pin = wanPatternedProperty<string>("modem_pin", {
  description: "The PIN code for the SIM card in the 3G/LTE modem.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "PIN Code" },
});

export const wan_modem_roam = wanPatternedProperty<"0" | "1" | "2" | "3">(
  "modem_roam",
  {
    description: "Controls the modem's roaming behavior.",
    page: "basic-network.asp",
    type: "enum",
    defaultValue: "2",
    ui: {
      label: "Roaming",
      options: [
        { value: "2", label: "No change*" },
        { value: "1", label: "Supported" },
        { value: "0", label: "Disabled" },
        { value: "3", label: "Roam only" },
      ],
    },
  },
);

export const wan_modem_speed = wanPatternedProperty<
  "00" | "030201" | "0302" | "03" | "02"
>("modem_speed", {
  description: "Sets the preferred network type for non-HiLink modems.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "00",
  ui: {
    label: "Network Type",
    options: [
      { value: "00", label: "Auto" },
      { value: "030201", label: "4G/3G/2G" },
      { value: "0302", label: "4G/3G only" },
      { value: "03", label: "4G only" },
      { value: "02", label: "3G only" },
    ],
  },
});

export const wan_modem_type = wanPatternedProperty<string>("modem_type", {
  description: "Specifies the type of 3G/LTE modem being used.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
});

export const wan_mtu = wanPatternedProperty<number>("mtu", {
  description: "The Maximum Transmission Unit for the WAN interface.",
  page: "basic-network.asp",
  type: "integer",
  defaultValue: 1500,
  validation: rangeValidator(576, 1500),
  ui: {
    state: {
      dependsOn: ["wan{unit}_mtu_enable"],
      evaluator: (values) =>
        values["wan{unit}_mtu_enable"] === "1" ? "enabled" : "disabled",
    },
  },
});

export const wan_mtu_enable = wanPatternedProperty<"0" | "1">("mtu_enable", {
  description: "Enables manual configuration of the MTU for the WAN interface.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "MTU",
    options: [
      { value: "0", label: "Default" },
      { value: "1", label: "Manual" },
    ],
  },
});

export const wan_netmask = wanPatternedProperty<string>("netmask", {
  description: "The subnet mask for a static IP configuration.",
  page: "basic-network.asp",
  type: "netmask",
  defaultValue: "0.0.0.0",
  ui: { label: "Subnet Mask" },
});

export const wan_ppp_custom = wanPatternedProperty<string>("ppp_custom", {
  description:
    "Custom options to pass to the pppd daemon for PPPoE/PPTP/L2TP connections.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Options" },
});

export const wan_ppp_demand = wanPatternedProperty<"0" | "1">("ppp_demand", {
  description: "Controls the connection mode for PPP-based connections.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Connect Mode",
    options: [
      { value: "1", label: "Connect On Demand" },
      { value: "0", label: "Keep Alive" },
    ],
  },
});

export const wan_ppp_demand_dnsip = wanPatternedProperty<string>(
  "ppp_demand_dnsip",
  {
    description:
      "An IP address to ping to trigger a 'Connect on Demand' connection.",
    page: "basic-network.asp",
    type: "ip",
    defaultValue: "198.51.100.1",
    ui: { label: "IP to trigger Connect" },
  },
);

export const wan_ppp_get_ip = wanPatternedProperty<string>("ppp_get_ip", {
  description:
    "Read-only value of the local IP address assigned by the PPP server.",
  page: "status-devices.asp",
  type: "ip",
});

export const wan_ppp_idletime = wanPatternedProperty<number>("ppp_idletime", {
  description:
    "The maximum idle time in minutes before a 'Connect on Demand' connection is dropped.",
  page: "basic-network.asp",
  type: "integer",
  defaultValue: 5,
  validation: rangeValidator(3, 1440),
  ui: { label: "Max Idle Time" },
});

export const wan_ppp_mlppp = wanPatternedProperty<boolean>("ppp_mlppp", {
  description: "Enables Single Line Multilink PPP.",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Single Line MLPPP" },
});

export const wan_ppp_passwd = wanPatternedProperty<string>("ppp_passwd", {
  description:
    "The password for a PPP-based connection (PPPoE, PPTP, L2TP, 3G).",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Password" },
});

export const wan_ppp_redialperiod = wanPatternedProperty<number>(
  "ppp_redialperiod",
  {
    description:
      "The interval in seconds between redial attempts for 'Keep Alive' connections.",
    page: "basic-network.asp",
    type: "integer",
    defaultValue: 20,
    validation: rangeValidator(1, 86400),
    ui: { label: "Redial Interval" },
  },
);

export const wan_ppp_service = wanPatternedProperty<string>("ppp_service", {
  description: "The service name for a PPPoE connection (optional).",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Service Name" },
});

export const wan_ppp_username = wanPatternedProperty<string>("ppp_username", {
  description:
    "The username for a PPP-based connection (PPPoE, PPTP, L2TP, 3G).",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Username" },
});

export const wan_pppoe_lef = wanPatternedProperty<number>("pppoe_lef", {
  description:
    "LCP Echo Failure limit. After this many unanswered echo requests, the connection is considered down.",
  page: "basic-network.asp",
  type: "integer",
  defaultValue: 5,
  validation: rangeValidator(1, 10),
  ui: { label: "LCP Echo Link fail limit" },
});

export const wan_pppoe_lei = wanPatternedProperty<number>("pppoe_lei", {
  description:
    "LCP Echo Interval in seconds. Sends an echo request to the peer to check link status.",
  page: "basic-network.asp",
  type: "integer",
  defaultValue: 10,
  validation: rangeValidator(1, 60),
  ui: { label: "LCP Echo Interval" },
});

export const wan_pptp_dhcp = wanPatternedProperty<boolean>("pptp_dhcp", {
  description:
    "For PPTP/L2TP, enables obtaining an IP address via DHCP over the tunnel.",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Use DHCP" },
});

export const wan_pptp_server_ip = wanPatternedProperty<string>(
  "pptp_server_ip",
  {
    description: "The IP address or domain name of the PPTP server.",
    page: "basic-network.asp",
    type: "string",
    defaultValue: "",
    ui: { label: "PPTP Gateway" },
  },
);

export const wan_proto = wanPatternedProperty<
  "dhcp" | "pppoe" | "static" | "pptp" | "l2tp" | "ppp3g" | "lte" | "disabled"
>("proto", {
  description: "The connection protocol for the WAN interface.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "dhcp",
  ui: {
    label: "Type",
    options: [
      { value: "dhcp", label: "DHCP" },
      { value: "pppoe", label: "PPPoE" },
      { value: "static", label: "Static" },
      { value: "pptp", label: "PPTP" },
      { value: "l2tp", label: "L2TP" },
      { value: "ppp3g", label: "3G Modem" },
      { value: "lte", label: "4G/LTE" },
      { value: "disabled", label: "Disabled" },
    ],
  },
});

export const wan_qos_encap = wanPatternedProperty<"0" | "1" | "2">(
  "qos_encap",
  {
    description: "The link encapsulation type for QoS calculations.",
    page: "qos-settings.asp",
    type: "enum",
    defaultValue: "0",
    ui: {
      options: [
        { value: "0", label: "None" },
        { value: "1", label: "ATM (ADSL)" },
        { value: "2", label: "PTM (most VDSL2)" },
      ],
    },
  },
);

export const wan_qos_ibw = wanPatternedProperty<number>("qos_ibw", {
  description:
    "The maximum available inbound (download) bandwidth in kbit/s for QoS.",
  page: "qos-settings.asp",
  type: "integer",
  defaultValue: 16000,
  validation: rangeValidator(10, 99999999),
  ui: { label: "Inbound Bandwidth" },
});

export const wan_qos_obw = wanPatternedProperty<number>("qos_obw", {
  description:
    "The maximum available outbound (upload) bandwidth in kbit/s for QoS.",
  page: "qos-settings.asp",
  type: "integer",
  defaultValue: 700,
  validation: rangeValidator(10, 99999999),
  ui: { label: "Outbound Bandwidth" },
});

export const wan_qos_overhead = wanPatternedProperty<string>("qos_overhead", {
  description:
    "The link-layer overhead value for QoS calculations, dependent on the encapsulation type.",
  page: "qos-settings.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    options: [
      { value: "0", label: "None" },
      { value: "8", label: "8-RFC2684/RFC1483 Routed VC-Mux" },
      { value: "10", label: "10-PPPoA VC-Mux" },
      { value: "14", label: "14-PPPoA LLC/Snap" },
      { value: "16", label: "16-RFC2684/RFC1483 Routed LLC/Snap" },
      { value: "24", label: "24-RFC2684/RFC1483 Bridged VC-Mux" },
      { value: "30", label: "30-PPPoE PTM (VDSL2)" },
      { value: "32", label: "32-PPPoE VC-Mux" },
      { value: "32", label: "32-RFC2684/RFC1483 Bridged LLC/Snap" },
      { value: "34", label: "34-PPPoE PTM (VDSL2) + VLAN" },
      { value: "40", label: "40-PPPoE LLC/Snap" },
      { value: "48", label: "48-PPPoE LLC/Snap + VLAN" },
    ],
  },
});

export const wan_speed: NvramProperty<"0" | "1" | "2" | "3" | "4"> = {
  key: "wan_speed",
  description: "Manually sets the speed and duplex of the WAN port.",
  page: "advanced-misc.asp",
  type: "enum",
  defaultValue: "4",
  ui: {
    label: "WAN Port Speed *",
    options: [
      { value: "0", label: "10Mbps Full" },
      { value: "1", label: "10Mbps Half" },
      { value: "2", label: "100Mbps Full" },
      { value: "3", label: "100Mbps Half" },
      { value: "4", label: "Autonegotiation" },
    ],
  },
};

export const wan_sta = wanPatternedProperty<string>("sta", {
  description:
    "Specifies which wireless interface to use for a Wireless Client mode WAN connection.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Wireless Client Mode" },
});

export const wan_status_script = wanPatternedProperty<boolean>(
  "status_script",
  {
    description:
      "If enabled, executes a custom script (/www/user/cgi-bin/wan{unit}_status.sh) to display status on the Overview page.",
    page: "basic-network.asp",
    type: "boolean",
    defaultValue: false,
    transform: booleanTransformer,
    ui: { label: "Call Custom Status Script" },
  },
);

export const wan_weight = wanPatternedProperty<number>("weight", {
  description:
    "The weight of this WAN interface for load balancing. A higher value means more traffic. 0 means failover only.",
  page: "basic-network.asp",
  type: "integer",
  defaultValue: 1,
  validation: rangeValidator(0, 256),
  ui: {
    label: "Load Balance Weight",
    state: {
      dependsOn: ["mwan_num"],
      evaluator: (values) =>
        parseInt(values.mwan_num || "0", 10) > 1 ? "visible" : "hidden",
    },
  },
});

export const wan_wins: NvramProperty<string> = {
  key: "wan_wins",
  description:
    "The IP address of the WINS server to be provided to DHCP clients on the LAN.",
  page: "advanced-dhcpdns.asp",
  type: "ip",
  defaultValue: "0.0.0.0",
  validation: (value) =>
    value === "0.0.0.0" ||
    /^((\d{1,3}\.){3}\d{1,3})?$/.test(value) ||
    "Invalid IP address.",
  ui: { label: "WINS (for DHCP)" },
};

// --- NVRAM Catalog (Continued) ---

export const web_adv_scripts: NvramProperty<boolean> = {
  key: "web_adv_scripts",
  description:
    "Enables dynamic, JavaScript-based charts for Bandwidth, IP Traffic, and Wireless pages, supported only by modern browsers.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Dynamic BW/IPT/WL charts",
    state: {
      dependsOn: ["web_css"],
      evaluator: (values) =>
        values["web_css"]?.includes("at-") ? "visible" : "hidden",
    },
  },
};

export const web_css: NvramProperty<string> = {
  key: "web_css",
  description: "Selects the visual theme for the FreshTomato web interface.",
  page: "admin-access.asp",
  type: "enum",
  defaultValue: "default",
  ui: {
    label: "Theme UI",
    options: [
      { value: "default", label: "Default" },
      { value: "usbred", label: "USB Red" },
      { value: "red", label: "Tomato" },
      { value: "black", label: "Black" },
      { value: "blue", label: "Blue" },
      { value: "bluegreen", label: "Blue & Green (Lighter)" },
      { value: "bluegreen2", label: "Blue & Green (Darker)" },
      { value: "brown", label: "Brown" },
      { value: "cyan", label: "Cyan" },
      { value: "olive", label: "Olive" },
      { value: "pumpkin", label: "Pumpkin" },
      { value: "asus", label: "Asus RT-N16" },
      { value: "rtn66u", label: "Asus RT-N66U" },
      { value: "asusred", label: "Asus Red" },
      { value: "linksysred", label: "Linksys Red" },
      { value: "at-dark", label: "Advanced Dark" },
      { value: "at-red", label: "Advanced Red" },
      { value: "at-blue", label: "Advanced Blue" },
      { value: "at-green", label: "Advanced Green" },
      { value: "ext/custom", label: "Custom (ext/custom.css)" },
      { value: "online", label: "Online from TTB (TomatoThemeBase)" },
    ],
  },
};

export const web_dir: NvramProperty<"default" | "jffs" | "opt" | "tmp"> = {
  key: "web_dir",
  description: "Sets the file system path for the web interface's UI files.",
  page: "admin-access.asp",
  type: "enum",
  defaultValue: "default",
  ui: {
    label: "UI files path",
    options: [
      { value: "default", label: "Default: /www" },
      { value: "jffs", label: "Custom: /jffs/www (Experts Only!)" },
      { value: "opt", label: "Custom: /opt/www (Experts Only!)" },
      { value: "tmp", label: "Custom: /tmp/www (Experts Only!)" },
    ],
  },
};

export const web_mx: NvramProperty<string[]> = {
  key: "web_mx",
  description:
    "A comma-separated list of top-level menu categories that should be expanded by default on page load.",
  page: "admin-access.asp",
  type: "list",
  defaultValue: ["status", "bwm"],
  transform: {
    toUi: (value) => value.split(","),
    fromUi: (value) => value.join(","),
  },
  ui: {
    label: "Open Menus",
  },
};

export const web_wl_filter: NvramProperty<boolean> = {
  key: "web_wl_filter",
  description:
    "Controls access to the web admin interface from wireless clients. '1' means access is DISALLOWED, '0' means allowed.",
  page: "admin-access.asp",
  type: "boolean",
  defaultValue: false,
  transform: {
    toUi: (v) => v === "1",
    fromUi: (v) => (v ? "1" : "0"),
  },
  ui: {
    label: "Allow Wireless Access", // The UI checkbox is inverted. Checked means '0'.
  },
};

export const webmon_bkp: NvramProperty<boolean> = {
  key: "webmon_bkp",
  description: "Enables daily backup of Web Monitor data at midnight.",
  page: "admin-log.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Daily Backup",
    state: {
      dependsOn: ["log_wm"],
      evaluator: (values) =>
        values["log_wm"] === "1" ? "enabled" : "disabled",
    },
  },
};

export const webmon_dir: NvramProperty<string> = {
  key: "webmon_dir",
  description: "Specifies the directory to store Web Monitor backups.",
  page: "admin-log.asp",
  type: "string",
  defaultValue: "/tmp",
  ui: {
    label: "Backup Directory",
    state: {
      dependsOn: ["log_wm", "webmon_bkp"],
      evaluator: (values) =>
        values["log_wm"] === "1" && values["webmon_bkp"] === "1"
          ? "enabled"
          : "disabled",
    },
  },
};

export const webmon_shrink: NvramProperty<boolean> = {
  key: "webmon_shrink",
  description:
    "If enabled, clears the current Web Monitor data after it has been backed up.",
  page: "admin-log.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: {
    label: "Clear Data After Backup",
    state: {
      dependsOn: ["log_wm", "webmon_bkp"],
      evaluator: (values) =>
        values["log_wm"] === "1" && values["webmon_bkp"] === "1"
          ? "enabled"
          : "disabled",
    },
  },
};

// --- Wireguard Patterned Properties ---
type WgUnitParam = { unit: 0 | 1 | 2 };

const wgProperty = <T>(
  keySuffix: string,
  base: Omit<
    PatternedNvramProperty<WgUnitParam, T>,
    "getKey" | "regex" | "parameters"
  >,
): PatternedNvramProperty<WgUnitParam, T> => ({
  getKey: (params) => `wg${params.unit}_${keySuffix}`,
  regex: new RegExp(`^wg([0-2])_${keySuffix}$`),
  parameters: {
    unit: {
      type: "integer",
      description: "The Wireguard interface index.",
      range: [0, 2],
    },
  },
  ...base,
});

export const wg_adns: NvramProperty<number[]> = {
  key: "wg_adns",
  description:
    "A comma-separated list of Wireguard interface indices (0, 1, 2) that should respond to DNS requests.",
  page: "vpn-wireguard.asp",
  type: "list",
  defaultValue: [],
  transform: {
    toUi: (v) =>
      v
        .split(",")
        .filter((s) => s !== "")
        .map((s) => parseInt(s, 10)),
    fromUi: (v) => v.join(","),
  },
};

export const wg_aip = wgProperty<string>("aip", {
  description:
    "Additional Allowed IPs for the router's side of the peer configuration, used when generating peer configs.",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Allowed IPs" },
});

export const wg_com = wgProperty<"0" | "1" | "2" | "3">("com", {
  description:
    "Defines the Type of VPN, controlling peer interaction behavior.",
  page: "vpn-wireguard.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Type of VPN",
    options: [
      { value: "0", label: "Internal - Hub (this device) and Spoke (peers)" },
      { value: "1", label: "Internal - Full Mesh (defined Endpoint only)" },
      { value: "2", label: "Internal - Full Mesh" },
      { value: "3", label: "External - VPN Provider" },
    ],
  },
});

export const wg_dns = wgProperty<string>("dns", {
  description:
    "Comma-separated list of DNS servers to be used by the Wireguard interface itself.",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "DNS Servers (out)" },
});

export const wg_enable = wgProperty<boolean>("enable", {
  description: "Enables the Wireguard interface to start on boot.",
  page: "vpn-wireguard.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Enable on Start" },
});

export const wg_endpoint = wgProperty<string>("endpoint", {
  description:
    "Composite string for the router's public endpoint. Format: 'mode|custom_value'. Mode 0=FQDN, 1=WAN IP, 2=Custom.",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "0",
  ui: { label: "Endpoint" },
});

export const wg_file = wgProperty<string>("file", {
  description:
    "Path to a wg-quick compatible configuration file. If specified, all other settings for this interface are ignored.",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Config file" },
});

export const wg_firewall = wgProperty<"auto" | "custom">("firewall", {
  description:
    "Controls how firewall rules for the Wireguard interface are managed.",
  page: "vpn-wireguard.asp",
  type: "enum",
  defaultValue: "auto",
  ui: {
    label: "Firewall",
    options: [
      { value: "auto", label: "Automatic" },
      { value: "custom", label: "Custom" },
    ],
  },
});

export const wg_fw = wgProperty<boolean>("fw", {
  description: "Enables the inbound firewall on the Wireguard tunnel.",
  page: "vpn-wireguard.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: { label: "Inbound Firewall" },
});

export const wg_fwmark = wgProperty<string>("fwmark", {
  description:
    "Firewall mark for policy-based routing with the Wireguard interface. Hexadecimal value or 0.",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "0",
  ui: { label: "FWMark" },
});

export const wg_ip = wgProperty<string>("ip", {
  description:
    "Comma-separated list of IP addresses in CIDR format for the Wireguard interface.",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "10.11.0.1/24", // Default is patterned
  ui: { label: "VPN Interface IP" },
});

export const wg_ka = wgProperty<number>("ka", {
  description:
    "PersistentKeepalive interval in seconds for peers. 0 disables it.",
  page: "vpn-wireguard.asp",
  type: "integer",
  defaultValue: 0,
  validation: rangeValidator(0, 99),
  ui: { label: "Router behind NAT" },
});

export const wg_key = wgProperty<string>("key", {
  description: "The private key for the Wireguard interface, in Base64 format.",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Private Key" },
});

export const wg_lan = wgProperty<number>("lan", {
  description:
    "A bitmask indicating which LAN bridges (br0-br3) should be pushed to clients. 1=LAN0, 2=LAN1, 4=LAN2, 8=LAN3.",
  page: "vpn-wireguard.asp",
  type: "integer",
  defaultValue: 0,
});

export const wg_mtu = wgProperty<number>("mtu", {
  description: "Maximum Transmission Unit for the Wireguard interface.",
  page: "vpn-wireguard.asp",
  type: "integer",
  defaultValue: 1420,
  validation: rangeValidator(0, 1500),
  ui: { label: "MTU" },
});

export const wg_nat = wgProperty<boolean>("nat", {
  description: "Creates a NAT rule on the Wireguard tunnel.",
  page: "vpn-wireguard.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: { label: "Create NAT on tunnel" },
});

export const wg_peer_dns = wgProperty<string>("peer_dns", {
  description:
    "Comma-separated list of DNS servers to be pushed to Wireguard peers.",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "DNS Servers for Peers" },
});

// This is a complex structured string. A full transform is lengthy but would be similar to adblock_blacklist.
export const wg_peers = wgProperty<string>("peers", {
  description:
    "Stores the list of peers for the Wireguard interface as a composite string.",
  page: "vpn-wireguard.asp",
  type: "structured-string",
  defaultValue: "",
  ui: { label: "Peers" },
  structuredSchema: {
    kind: "array",
    items: {
      type: "string",
      label: "Peer Entry",
      defaultValue: "",
    },
  },
});

export const wg_poll = wgProperty<number>("poll", {
  description:
    "The interval in minutes for checking the Wireguard connection status. 0 disables polling.",
  page: "vpn-wireguard.asp",
  type: "integer",
  defaultValue: 0,
  validation: rangeValidator(0, 1440),
  ui: { label: "Poll Interval" },
});

export const wg_port = wgProperty<string>("port", {
  description:
    "The listening port for the Wireguard interface. Empty means default (51820 + unit).",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "",
  validation: (v) =>
    v === "" ||
    (parseInt(v) >= 1 && parseInt(v) <= 65535) ||
    "Must be a valid port or empty.",
  ui: { label: "Port" },
});

export const wg_postdown = wgProperty<string>("postdown", {
  description:
    "A custom script to run after the Wireguard interface is brought down.",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Post-Down Script" },
});

export const wg_postup = wgProperty<string>("postup", {
  description:
    "A custom script to run after the Wireguard interface is brought up.",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Post-Up Script" },
});

export const wg_predown = wgProperty<string>("predown", {
  description:
    "A custom script to run before the Wireguard interface is brought down.",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Pre-Down Script" },
});

export const wg_preup = wgProperty<string>("preup", {
  description:
    "A custom script to run before the Wireguard interface is brought up.",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Pre-Up Script" },
});

export const wg_rgw = wgProperty<boolean>("rgw", {
  description:
    "If enabled, all traffic from peers is forwarded through the router's Wireguard interface.",
  page: "vpn-wireguard.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Forward all peer traffic" },
});

export const wg_rgwr = wgProperty<"1" | "2" | "3">("rgwr", {
  description:
    "Redirects Internet traffic for the 'External - VPN Provider' mode.",
  page: "vpn-wireguard.asp",
  type: "enum",
  defaultValue: "1",
  ui: {
    label: "Redirect Internet traffic",
    options: [
      { value: "1", label: "All" },
      { value: "2", label: "Routing Policy" },
      { value: "3", label: "Routing Policy (strict)" },
    ],
  },
});

export const wg_route = wgProperty<string>("route", {
  description:
    "Composite string for routing mode. Format: 'mode|custom_table'. Mode 0=Off, 1=Auto, 2=Custom.",
  page: "vpn-wireguard.asp",
  type: "string",
  defaultValue: "1",
  ui: { label: "Routing Mode" },
});

export const wg_routing_val = wgProperty<string>("routing_val", {
  description:
    "Stores the list of routing policy rules for the Wireguard interface as a composite string.",
  page: "vpn-wireguard.asp",
  type: "structured-string",
  defaultValue: "",
  ui: { label: "Routing Policy Rules" },
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        enabled: { type: "boolean", label: "Enabled", defaultValue: false },
        ruleType: {
          type: "integer",
          label: "Rule Type",
          defaultValue: 1,
        },
        match: {
          type: "string",
          label: "Match Value",
          defaultValue: "",
        },
        killSwitch: {
          type: "boolean",
          label: "Kill Switch",
          defaultValue: false,
        },
      },
    },
  },
});

// --- Wireless Patterned Properties ---
type WlIfaceParam = { iface: string };

const wlProperty = <T>(
  keySuffix: string,
  base: Omit<
    PatternedNvramProperty<WlIfaceParam, T>,
    "getKey" | "regex" | "parameters"
  >,
): PatternedNvramProperty<WlIfaceParam, T> => ({
  getKey: (params) => `wl${params.iface}_${keySuffix}`,
  regex: new RegExp(`^wl([\\d\\.]*?)_${keySuffix}$`),
  parameters: {
    iface: {
      type: "string",
      description:
        "The wireless interface identifier (e.g., '', '0', '1', '0.1').",
    },
  },
  ...base,
});

export const wl_ap_isolate = wlProperty<boolean>("ap_isolate", {
  description:
    "Isolates wireless clients from each other on the same interface.",
  page: "advanced-wlanvifs.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "AP Isolation" },
});

export const wl_atf = wlProperty<boolean>("atf", {
  description:
    "Enables Air Time Fairness, which attempts to provide equal airtime access to all clients.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Air Time Fairness" },
});

export const wl_auth = wlProperty<boolean>("auth", {
  description:
    "Sets the authentication type for legacy security modes like WEP. '0' for Auto/Open, '1' for Shared Key.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Authentication Type" },
});

export const wl_auth_mode = wlProperty<"none" | "radius">("auth_mode", {
  description:
    "Internal setting to differentiate between standard modes and Radius.",
  page: "advanced-wlanvifs.asp",
  type: "enum",
  defaultValue: "none",
});

export const wl_bcn = wlProperty<number>("bcn", {
  description: "Beacon interval in milliseconds.",
  page: "advanced-wireless.asp",
  type: "integer",
  defaultValue: 100,
  validation: rangeValidator(1, 65535, "beacon interval"),
  ui: { label: "Beacon Interval" },
});

export const wl_bss_enabled = wlProperty<boolean>("bss_enabled", {
  description:
    "Internal setting to control if a virtual wireless interface is enabled.",
  page: "advanced-wlanvifs.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
});

export const wl_bss_maxassoc = wlProperty<number>("bss_maxassoc", {
  description:
    "Maximum number of clients that can associate with this wireless interface.",
  page: "advanced-wireless.asp",
  type: "integer",
  defaultValue: 128,
  validation: rangeValidator(0, 255, "maximum clients"),
  ui: { label: "Maximum Clients" },
});

export const wl_btc_mode = wlProperty<"0" | "1" | "2">("btc_mode", {
  description:
    "Bluetooth Coexistence mode to mitigate interference between Wi-Fi and Bluetooth.",
  page: "advanced-wireless.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Bluetooth Coexistence",
    options: [
      { value: "0", label: "Disable *" },
      { value: "1", label: "Enable" },
      { value: "2", label: "Preemption" },
    ],
  },
});

export const wl_channel = wlProperty<string>("channel", {
  description: "The wireless channel for the interface. '0' means Auto.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "6",
  ui: { label: "Channel" },
});

export const wl_clap_hwaddr = wlProperty<string>("clap_hwaddr", {
  description:
    "The MAC address of the upstream AP to connect to in Wireless Client modes (STA, WET, PSTA). Usually not needed.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  validation: (v) =>
    v === "" ||
    !!v.match(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/) ||
    "Invalid MAC address.",
  ui: { label: "AP MAC Address to connect" },
});

export const wl_closed = wlProperty<boolean>("closed", {
  description: "Hides the SSID from being broadcast. '1' means hidden.",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Broadcast" }, // Inverted logic in UI
});

export const wl_corerev = wlProperty<string>("corerev", {
  description: "Read-only value indicating the wireless chip's core revision.",
  page: "advanced-wireless.asp",
  type: "string",
});

export const wl_country_code = wlProperty<string>("country_code", {
  description: "Specifies the wireless country code for regulatory compliance.",
  page: "advanced-wireless.asp",
  type: "string",
  defaultValue: "US",
  ui: { label: "Country / Region" },
});

export const wl_country_rev = wlProperty<number>("country_rev", {
  description:
    "Specifies the wireless country revision number for regulatory compliance.",
  page: "advanced-wireless.asp",
  type: "integer",
  defaultValue: 0,
  validation: rangeValidator(0, 999),
  ui: { label: "Country Rev" },
});

export const wl_crypto = wlProperty<"aes" | "tkip" | "tkip+aes">("crypto", {
  description: "The encryption algorithm for WPA/WPA2 security modes.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "aes",
  ui: {
    label: "Encryption",
    options: [
      { value: "tkip", label: "TKIP" },
      { value: "aes", label: "AES" },
      { value: "tkip+aes", label: "TKIP / AES" },
    ],
  },
});

export const wl_distance = wlProperty<string>("distance", {
  description:
    "Sets the ACK timing based on distance in meters. '0' uses the default.",
  page: "advanced-wireless.asp",
  type: "string",
  defaultValue: "",
  validation: (v) =>
    v === "" ||
    (parseInt(v) >= 0 && parseInt(v) <= 99999) ||
    "Valid range: 0 - 99999 meters.",
  ui: { label: "Distance / ACK Timing" },
});

export const wl_dtim = wlProperty<number>("dtim", {
  description: "DTIM (Delivery Traffic Indication Message) Interval.",
  page: "advanced-wireless.asp",
  type: "integer",
  defaultValue: 1,
  validation: rangeValidator(1, 255),
  ui: { label: "DTIM Interval" },
});

export const wl_frag = wlProperty<number>("frag", {
  description: "Fragmentation Threshold.",
  page: "advanced-wireless.asp",
  type: "integer",
  defaultValue: 2346,
  validation: rangeValidator(256, 2346),
  ui: { label: "Fragmentation Threshold" },
});

export const wl_frameburst = wlProperty<"on" | "off">("frameburst", {
  description: "Enables or disables frame bursting.",
  page: "advanced-wireless.asp",
  type: "enum",
  defaultValue: "off",
  ui: {
    label: "Frame Burst",
    options: [
      { value: "off", label: "Disable *" },
      { value: "on", label: "Enable" },
    ],
  },
});

export const wl_gmode_protection = wlProperty<"off" | "auto">(
  "gmode_protection",
  {
    description: "CTS (Clear-to-Send) Protection Mode.",
    page: "advanced-wireless.asp",
    type: "enum",
    defaultValue: "off",
    ui: {
      label: "CTS Protection Mode",
      options: [
        { value: "off", label: "Disable *" },
        { value: "auto", label: "Auto" },
      ],
    },
  },
);

export const wl_hwaddr = wlProperty<string>("hwaddr", {
  description: "The MAC address of the wireless interface.",
  page: "advanced-mac.asp",
  type: "mac",
  defaultValue: "00:00:00:00:00:00",
  ui: { label: "MAC Address" },
});

export const wl_ifname = wlProperty<string>("ifname", {
  description: "The kernel network interface name (e.g., eth1, eth2, wl0.1).",
  page: "advanced-wlanvifs.asp",
  type: "string",
});

export const wl_igs = wlProperty<boolean>("igs", {
  description:
    "IGMP Snooping. This is an internal setting often tied to Wireless Multicast Forwarding.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
});

export const wl_itxbf = wlProperty<boolean>("itxbf", {
  description: "Enables Implicit TX Beamforming.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: { label: "Universal/Implicit beamforming" },
});

export const wl_key = wlProperty<string>("key", {
  description: "The currently active WEP key index (1-4).",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "1",
  ui: { label: "Active WEP Key" },
});

export const wl_key1 = wlProperty<string>("key1", {
  description: "WEP key 1.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Key 1" },
});

export const wl_key2 = wlProperty<string>("key2", {
  description: "WEP key 2.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Key 2" },
});

export const wl_key3 = wlProperty<string>("key3", {
  description: "WEP key 3.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Key 3" },
});

export const wl_key4 = wlProperty<string>("key4", {
  description: "WEP key 4.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Key 4" },
});

export const wl_lazywds = wlProperty<boolean>("lazywds", {
  description: "Enables 'lazy' WDS mode, allowing any WDS peer to connect.",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "WDS Mode" },
});

export const wl_macaddr = wlProperty<string>("macaddr", {
  description:
    "The MAC address of the wireless interface (older/alternative key to wl_hwaddr).",
  page: "advanced-mac.asp",
  type: "mac",
});

export const wl_macmode = wlProperty<"disabled" | "deny" | "allow">("macmode", {
  description: "Wireless MAC filter mode.",
  page: "advanced-wlanvifs.asp",
  type: "enum",
  defaultValue: "disabled",
  ui: {
    label: "Wireless Filter",
    options: [
      { value: "disabled", label: "Disabled" },
      { value: "deny", label: "Block" },
      { value: "allow", label: "Permit" },
    ],
  },
});

export const wl_maxassoc = wlProperty<number>("maxassoc", {
  description: "Alias for wl_bss_maxassoc. Maximum number of clients.",
  page: "advanced-wireless.asp",
  type: "integer",
  defaultValue: 128,
  validation: rangeValidator(1, 255),
  ui: { label: "Maximum Clients" },
});

export const wl_mfp = wlProperty<"0" | "1" | "2">("mfp", {
  description: "802.11w Protected Management Frames (PMF) setting.",
  page: "advanced-wireless.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Protected Management Frames",
    options: [
      { value: "0", label: "Disable *" },
      { value: "1", label: "Capable" },
      { value: "2", label: "Required" },
    ],
  },
});

export const wl_mimo_preamble = wlProperty<"auto" | "mm" | "gf" | "gfbcm">(
  "mimo_preamble",
  {
    description: "802.11n preamble type.",
    page: "advanced-wireless.asp",
    type: "enum",
    defaultValue: "mm",
    ui: {
      label: "802.11n Preamble",
      options: [
        { value: "auto", label: "Auto" },
        { value: "mm", label: "Mixed Mode *" },
        { value: "gf", label: "Green Field" },
        { value: "gfbcm", label: "GF-BRCM" },
      ],
    },
  },
);

export const wl_mitigation = wlProperty<"0" | "1" | "2" | "3" | "4">(
  "mitigation",
  {
    description: "Interference mitigation setting for non-AC PHYs.",
    page: "advanced-wireless.asp",
    type: "enum",
    defaultValue: "0",
    ui: {
      label: "Interference Mitigation",
      options: [
        { value: "0", label: "None *" },
        { value: "1", label: "Non-WLAN" },
        { value: "2", label: "WLAN Manual" },
        { value: "3", label: "WLAN Auto" },
        { value: "4", label: "WLAN Auto with Noise Reduction" },
      ],
    },
  },
);

export const wl_mitigation_ac = wlProperty<string>("mitigation_ac", {
  description: "Interference mitigation setting for AC PHYs.",
  page: "advanced-wireless.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "AC-PHY Interference Mitigation",
    options: [
      { value: "0", label: "None *" },
      { value: "1", label: "desense based on glitch count (opt. 1)" },
      { value: "2", label: "limit pktgain based on hwaci (opt. 2)" },
      { value: "4", label: "limit pktgain based on w2/nb (opt. 3)" },
      { value: "3", label: "opt. 1 AND opt. 2" },
      { value: "5", label: "opt. 1 AND opt. 3" },
      { value: "6", label: "opt. 2 AND opt. 3" },
      { value: "7", label: "opt. 1 AND opt. 2 AND opt. 3" },
    ],
  },
});

export const wl_mode = wlProperty<string>("mode", {
  description: "Wireless interface operational mode.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "ap",
  ui: { label: "Wireless Mode" },
});

export const wl_mrate = wlProperty<string>("mrate", {
  description: "Multicast rate in bps. '0' for auto.",
  page: "advanced-wireless.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Multicast Rate",
    options: [
      { value: "0", label: "Auto *" },
      { value: "1000000", label: "1 Mbps" },
      { value: "2000000", label: "2 Mbps" },
      { value: "5500000", label: "5.5 Mbps" },
      { value: "6000000", label: "6 Mbps" },
      { value: "9000000", label: "9 Mbps" },
      { value: "11000000", label: "11 Mbps" },
      { value: "12000000", label: "12 Mbps" },
      { value: "18000000", label: "18 Mbps" },
      { value: "24000000", label: "24 Mbps" },
      { value: "36000000", label: "36 Mbps" },
      { value: "48000000", label: "48 Mbps" },
      { value: "54000000", label: "54 Mbps" },
    ],
  },
});

export const wl_mu_features = wlProperty<string>("mu_features", {
  description: "Internal setting related to MU-MIMO features.",
  page: "advanced-wireless.asp",
  type: "string",
  defaultValue: "",
});

export const wl_mumimo = wlProperty<string>("mumimo", {
  description: "Enables or disables MU-MIMO.",
  page: "advanced-wireless.asp",
  type: "string",
  defaultValue: "",
});

export const wl_nband = wlProperty<"1" | "2" | "">("nband", {
  description: "Wireless band selection. '1' for 5GHz, '2' for 2.4GHz.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "2",
  ui: {
    label: "Radio Band",
    options: [
      { label: "Default", value: "" },
      { label: "5GHz", value: "1" },
      { label: "2.4GHz", value: "2" },
    ],
  },
});

export const wl_nbw_cap = wlProperty<string>("nbw_cap", {
  description: "Wireless channel width capability.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "1",
  ui: { label: "Channel Width" },
});

export const wl_nctrlsb = wlProperty<"lower" | "upper">("nctrlsb", {
  description: "Control sideband for 40/80MHz channels.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "lower",
  ui: { label: "Control Sideband" },
});

export const wl_net_mode = wlProperty<string>("net_mode", {
  description: "Wireless network mode (e.g., mixed, b-only, n-only).",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "mixed",
  ui: {
    label: "Wireless Network Mode",
    options: [
      { label: "mixed", value: "mixed" },
      { label: "b-only", value: "b-only" },
      { label: "g-only", value: "g-only" },
      { label: "a-only", value: "a-only" },
      { label: "bg-mixed", value: "bg-mixed" },
      { label: "nac-mixed", value: "nac-mixed" },
      { label: "ac-only", value: "ac-only" },
      { label: "disabled", value: "disabled" },
    ],
  },
});

export const wl_obss_coex = wlProperty<boolean>("obss_coex", {
  description: "Enables Overlapping BSS Coexistence for 802.11n.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Overlapping BSS Coexistence" },
});

export const wl_optimizexbox = wlProperty<boolean>("optimizexbox", {
  description: "Enables optimizations for Xbox wireless traffic.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Optimized for Xbox" },
});

export const wl_passphrase = wlProperty<string>("passphrase", {
  description: "Passphrase used to generate WEP keys.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Passphrase" },
});

export const wl_phytype = wlProperty<string>("phytype", {
  description:
    "Read-only value indicating the physical layer type (e.g., n, v for AC).",
  page: "advanced-wireless.asp",
  type: "string",
});

export const wl_plcphdr = wlProperty<"long" | "short">("plcphdr", {
  description: "PLCP header type.",
  page: "advanced-wireless.asp",
  type: "enum",
  defaultValue: "long",
  ui: {
    label: "Preamble",
    options: [
      { value: "long", label: "Long *" },
      { value: "short", label: "Short" },
    ],
  },
});

export const wl_psta_inact = wlProperty<string>("psta_inact", {
  description:
    "Inactivity timer in seconds for Media Bridge (psta) mode. 0 to disable.",
  page: "advanced-wireless.asp",
  type: "string",
  defaultValue: "0",
  validation: (v) =>
    v === "0" ||
    (parseInt(v) >= 60 && parseInt(v) <= 3600) ||
    "Valid range: 60 - 3600 seconds, or 0 to disable.",
  ui: { label: "Inactivity Timer" },
});

export const wl_radio = wlProperty<boolean>("radio", {
  description: "Enables or disables the wireless radio for an interface.",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: { label: "Enable Wireless" },
});

export const wl_radius_ipaddr = wlProperty<string>("radius_ipaddr", {
  description: "IP address of the RADIUS server.",
  page: "basic-network.asp",
  type: "ip",
  defaultValue: "",
  ui: { label: "Radius Server" },
});

export const wl_radius_key = wlProperty<string>("radius_key", {
  description: "Shared secret key for the RADIUS server.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  ui: { label: "Shared Key" },
});

export const wl_radius_port = wlProperty<number>("radius_port", {
  description: "Port of the RADIUS server.",
  page: "basic-network.asp",
  type: "integer",
  defaultValue: 1812,
  validation: portValidator,
  ui: { label: "" },
});

export const wl_rate = wlProperty<string>("rate", {
  description: "Fixed transmission rate in bps. '0' for auto.",
  page: "advanced-wireless.asp",
  type: "enum",
  defaultValue: "0",
  ui: {
    label: "Transmission Rate",
    options: [
      { value: "0", label: "Auto *" },
      { value: "1000000", label: "1 Mbps" },
      { value: "2000000", label: "2 Mbps" },
      { value: "5500000", label: "5.5 Mbps" },
      { value: "6000000", label: "6 Mbps" },
      { value: "9000000", label: "9 Mbps" },
      { value: "11000000", label: "11 Mbps" },
      { value: "12000000", label: "12 Mbps" },
      { value: "18000000", label: "18 Mbps" },
      { value: "24000000", label: "24 Mbps" },
      { value: "36000000", label: "36 Mbps" },
      { value: "48000000", label: "48 Mbps" },
      { value: "54000000", label: "54 Mbps" },
    ],
  },
});

export const wl_rateset = wlProperty<"default" | "12" | "all">("rateset", {
  description: "Controls the set of basic rates advertised by the AP.",
  page: "advanced-wireless.asp",
  type: "enum",
  defaultValue: "default",
  ui: {
    label: "Basic Rate",
    options: [
      { value: "default", label: "Default *" },
      { value: "12", label: "1-2 Mbps" },
      { value: "all", label: "All" },
    ],
  },
});

export const wl_reg_mode = wlProperty<"off" | "d" | "h">("reg_mode", {
  description: "Wireless regulatory mode.",
  page: "advanced-wireless.asp",
  type: "enum",
  defaultValue: "off",
  ui: {
    label: "Regulatory Mode",
    options: [
      { value: "off", label: "Off *" },
      { value: "d", label: "802.11d" },
      { value: "h", label: "802.11h" },
    ],
  },
});

export const wl_rts = wlProperty<number>("rts", {
  description: "RTS (Request to Send) Threshold.",
  page: "advanced-wireless.asp",
  type: "integer",
  defaultValue: 2347,
  validation: rangeValidator(0, 2347),
  ui: { label: "RTS Threshold" },
});

export const wl_ssid = wlProperty<string>("ssid", {
  description:
    "The Service Set Identifier (network name) for the wireless interface.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "FreshTomato24",
  validation: (v) =>
    (v.length >= 1 && v.length <= 32) ||
    "SSID must be between 1 and 32 characters.",
  ui: { label: "SSID" },
});

export const wl_turbo_qam = wlProperty<"0" | "1">("turbo_qam", {
  description:
    "Enables TurboQAM (256-QAM) for higher speeds on 802.11n networks.",
  page: "advanced-wireless.asp",
  type: "enum",
  defaultValue: "1",
  ui: {
    label: "Modulation Scheme (Requires Wireless Network Mode set to Auto)",
    options: [
      { value: "0", label: "Up to MCS 7 (802.11n)" },
      { value: "1", label: "Up to MCS 9 (TurboQAM/256-QAM) *" },
    ],
  },
});

export const wl_txbf = wlProperty<boolean>("txbf", {
  description: "Enables explicit TX Beamforming.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: { label: "Explicit beamforming" },
});

export const wl_txbf_bfe_cap = wlProperty<boolean>("txbf_bfe_cap", {
  description: "Internal setting for Beamformee capability.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
});

export const wl_txbf_bfr_cap = wlProperty<boolean>("txbf_bfr_cap", {
  description: "Internal setting for Beamformer capability.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
});

export const wl_txbf_imp = wlProperty<boolean>("txbf_imp", {
  description:
    "Internal setting for Implicit TX Beamforming, linked to `wl_itxbf`.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
});

export const wl_txpwr = wlProperty<string>("txpwr", {
  description: "Transmit power in mW. '0' for country default.",
  page: "advanced-wireless.asp",
  type: "string",
  defaultValue: "0",
  ui: { label: "Transmit Power" },
});

export const wl_unit: NvramProperty<string> = {
  key: "wl_unit",
  description:
    "Represents the currently selected wireless unit in the web interface for context. Not a saved setting.",
  page: "about.asp", // and many others
  type: "string",
};

export const wl_user_rssi = wlProperty<string>("user_rssi", {
  description:
    "Roaming Assistant threshold. Disconnects clients with RSSI below this value. '0' to disable.",
  page: "advanced-wireless.asp",
  type: "string",
  defaultValue: "0",
  validation: (v) =>
    v === "0" ||
    (parseInt(v) >= -90 && parseInt(v) <= -45) ||
    "Valid range: -90 to -45, or 0 to disable.",
  ui: { label: "Roaming Assistant" },
});

export const wl_vifs = wlProperty<string>("vifs", {
  description:
    "A space-separated list of virtual wireless interfaces (e.g., 'wl0.1 wl0.2') belonging to a primary interface.",
  page: "advanced-wlanvifs.asp",
  type: "string",
  defaultValue: "",
});

export const wl_wds = wlProperty<string>("wds", {
  description: "A space-separated list of MAC addresses of WDS peers.",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
});

export const wl_wds_enable = wlProperty<boolean>("wds_enable", {
  description: "Enables WDS (Wireless Distribution System) mode.",
  page: "basic-network.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
});

export const wl_wep_bit = wlProperty<"64" | "128">("wep_bit", {
  description: "WEP key length.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "128",
  ui: {
    label: "Encryption",
    options: [
      { value: "128", label: "128-bits" },
      { value: "64", label: "64-bits" },
    ],
  },
});

export const wl_wme = wlProperty<"auto" | "off" | "on">("wme", {
  description: "WMM (Wireless Multimedia Extensions) setting.",
  page: "advanced-wireless.asp",
  type: "enum",
  defaultValue: "on",
  ui: {
    label: "WMM",
    options: [
      { value: "auto", label: "Auto" },
      { value: "off", label: "Disable" },
      { value: "on", label: "Enable *" },
    ],
  },
});

export const wl_wme_apsd = wlProperty<"on" | "off">("wme_apsd", {
  description: "Automatic Power Save Delivery (APSD) mode for WMM.",
  page: "advanced-wireless.asp",
  type: "enum",
  defaultValue: "on",
  ui: {
    label: "APSD Mode",
    options: [
      { value: "off", label: "Disable" },
      { value: "on", label: "Enable *" },
    ],
  },
});

export const wl_wme_no_ack = wlProperty<"on" | "off">("wme_no_ack", {
  description: "WMM No-Acknowledgement mode.",
  page: "advanced-wireless.asp",
  type: "enum",
  defaultValue: "off",
  ui: {
    label: "No ACK",
    options: [
      { value: "off", label: "Disable *" },
      { value: "on", label: "Enable" },
    ],
  },
});

export const wl_wmf_bss_enable = wlProperty<boolean>("wmf_bss_enable", {
  description: "Enables Wireless Multicast Forwarding (WMF).",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
  ui: { label: "Wireless Multicast Forwarding" },
});

export const wl_wmf_igmpq_filter = wlProperty<boolean>("wmf_igmpq_filter", {
  description: "Internal setting for WMF IGMP query filtering.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
});

export const wl_wmf_mdata_sendup = wlProperty<boolean>("wmf_mdata_sendup", {
  description: "Internal setting for WMF multicast data send-up.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
});

export const wl_wmf_ucast_upnp = wlProperty<boolean>("wmf_ucast_upnp", {
  description: "Internal setting for WMF unicast UPnP.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
});

export const wl_wmf_ucigmp_query = wlProperty<boolean>("wmf_ucigmp_query", {
  description: "Internal setting for WMF unicast IGMP query.",
  page: "advanced-wireless.asp",
  type: "boolean",
  defaultValue: false,
  transform: booleanTransformer,
});

export const wl_wpa_gtk_rekey = wlProperty<number>("wpa_gtk_rekey", {
  description: "WPA Group Key Renewal interval in seconds.",
  page: "basic-network.asp",
  type: "integer",
  defaultValue: 3600,
  validation: rangeValidator(0, 2592000),
  ui: { label: "Group Key Renewal" },
});

export const wl_maclist: PatternedNvramProperty<WlIfaceParam, string[]> = {
  getKey: (params) => `wl${params.iface}_maclist`,
  regex: /^wl(\d+(\.\d+)?)_maclist$/,
  parameters: {
    iface: {
      type: "string",
      description: "The wireless interface identifier.",
    },
  },
  description:
    "A space-separated list of MAC addresses for the wireless filter.",
  page: "basic-wfilter.asp",
  type: "list",
  defaultValue: [],
  transform: {
    toUi: (v) => v.split(/\s+/).filter((mac) => mac),
    fromUi: (v) => v.join(" "),
  },
  ui: { label: "MAC Address List" },
};

export const wl_security_mode: PatternedNvramProperty<WlIfaceParam, string> = {
  getKey: (params) => `wl${params.iface}_security_mode`,
  regex: /^wl(\d+(\.\d+)?)_security_mode$/,
  parameters: {
    iface: {
      type: "string",
      description: "The wireless interface identifier.",
    },
  },
  description: "Specifies the wireless security mode.",
  page: "basic-network.asp",
  type: "enum",
  defaultValue: "disabled",
  ui: {
    label: "Security",
    options: [
      { value: "disabled", label: "Disabled" },
      { value: "wep", label: "WEP (legacy)" },
      { value: "wpa_personal", label: "WPA Personal (deprecated)" },
      { value: "wpa_enterprise", label: "WPA Enterprise (deprecated)" },
      { value: "wpa2_personal", label: "WPA2 Personal" },
      { value: "wpa2_enterprise", label: "WPA2 Enterprise" },
      { value: "wpaX_personal", label: "WPA / WPA2 Personal (deprecated)" },
      { value: "wpaX_enterprise", label: "WPA / WPA2 Enterprise (deprecated)" },
      { value: "radius", label: "Radius" },
    ],
  },
};

export const wl_wpa_psk: PatternedNvramProperty<WlIfaceParam, string> = {
  getKey: (params) => `wl${params.iface}_wpa_psk`,
  regex: /^wl(\d+(\.\d+)?)_wpa_psk$/,
  parameters: {
    iface: {
      type: "string",
      description: "The wireless interface identifier.",
    },
  },
  description: "The WPA/WPA2 Pre-Shared Key (password).",
  page: "basic-network.asp",
  type: "string",
  defaultValue: "",
  validation: (v) => {
    if (v.length > 0 && v.length < 8)
      return "Key must be at least 8 characters.";
    if (v.length > 64) return "Key must be no more than 64 characters.";
    if (v.length === 64 && !/^[0-9a-fA-F]+$/.test(v))
      return "A 64-character key must be hexadecimal.";
    return true;
  },
  ui: {
    label: "Shared Key",
    state: {
      dependsOn: ["wl{iface}_security_mode"],
      evaluator: (values) =>
        values["wl{iface}_security_mode"]?.includes("personal")
          ? "visible"
          : "hidden",
    },
  },
};

export const wlx_hpamp: NvramProperty<boolean> = {
  key: "wlx_hpamp",
  description: "Enables or disables the High Power Amplifier.",
  page: "advanced-wireless.asp",
  type: "boolean",
  transform: booleanTransformer,
  defaultValue: true,
  ui: {
    label: "Amplifier",
    options: [
      { value: false, label: "Disable" },
      { value: true, label: "Enable *" },
    ],
  },
};

export const wlx_hperx: NvramProperty<boolean> = {
  key: "wlx_hperx",
  description: "Enables or disables Enhanced RX Sensitivity.",
  page: "advanced-wireless.asp",
  type: "boolean",
  transform: booleanTransformer,
  defaultValue: false,
  ui: {
    label: "Enhanced RX Sensitivity",
    options: [
      { value: false, label: "Disable *" },
      { value: true, label: "Enable" },
    ],
  },
};

export const zfs_mount_script: NvramProperty<string> = {
  key: "zfs_mount_script",
  description:
    "A custom script to run for mounting ZFS partitions when automatic mounting is disabled.",
  page: "nas-usb.asp",
  type: "multiline-string",
  defaultValue: "",
  validation: (v) =>
    v.length <= 2048 || "Script cannot exceed 2048 characters.",
  ui: {
    label: "ZFS Custom Mounting",
    state: {
      dependsOn: [
        "usb_enable",
        "usb_storage",
        "usb_fs_zfs",
        "usb_fs_zfs_automount",
      ],
      evaluator: (v) =>
        v.usb_enable === "1" &&
        v.usb_storage === "1" &&
        v.usb_fs_zfs === "1" &&
        v.usb_fs_zfs_automount === "0"
          ? "visible"
          : "hidden",
    },
  },
};

// Missing definition in nvram.ts
export const script_mwanup: NvramProperty<string> = {
  key: "script_mwanup",
  description:
    "A shell script that is executed after a MultiWAN interface comes up. The active WAN number is passed as $1.",
  page: "admin-scripts.asp",
  type: "multiline-string",
  defaultValue: "",
  ui: {
    label: "MultiWAN Up",
  },
};

interface StubbyResolver {
  ip: string;
  port: number;
  domain: string;
  pinset: string;
}
export const stubby_resolvers: NvramProperty<StubbyResolver[]> = {
  key: "stubby_resolvers",
  description:
    "List of upstream resolvers for Stubby (DNS-over-TLS), stored in a custom composite format.",
  page: "advanced-dhcpdns.asp",
  type: "structured-string",
  defaultValue: [],
  structuredSchema: {
    kind: "array",
    items: {
      kind: "object",
      fields: {
        ip: { type: "string", label: "IP Address", defaultValue: "" },
        port: { type: "integer", label: "Port", defaultValue: 853 },
        domain: { type: "string", label: "Domain", defaultValue: "" },
        pinset: { type: "string", label: "Pinset", defaultValue: "" },
      },
    },
  },
  transform: {
    toUi: (value) =>
      value
        .split("<")
        .filter((v) => v)
        .map((v) => {
          const parts = v.split(">");
          return {
            ip: parts[0] || "",
            port: parts[1] ? parseInt(parts[1], 10) : 853, // Default port if empty
            domain: parts[2] || "",
            pinset: parts[3] || "",
          };
        }),
    fromUi: (value) =>
      value
        .map(
          (v) =>
            `<${v.ip}>${v.port === 853 ? "" : v.port}>${v.domain}>${v.pinset}`,
        )
        .join(""),
  },
  ui: {
    label: "Upstream resolvers",
  },
};

export const ipv6_rtr_addr_auto: NvramProperty<boolean> = {
  key: "ipv6_rtr_addr_auto",
  description:
    "Controls whether the IPv6 Router LAN address is automatically determined (1) or manually specified (0).",
  page: "basic-ipv6.asp",
  type: "boolean",
  defaultValue: true,
  transform: booleanTransformer,
  ui: {
    label: "IPv6 Router LAN Address Mode",
    options: [
      { value: true, label: "Default" },
      { value: false, label: "Manual" },
    ],
  },
};

interface DdnsConfig {
  service: string;
  user_pass: string;
  host: string;
  wildcard: boolean;
  mx: string;
  backup_mx: boolean;
  custom_token: string;
}
export const ddnsx: PatternedNvramProperty<
  { index: 0 | 1 | 2 | 3 },
  DdnsConfig
> = {
  getKey: (params) => `ddnsx${params.index}`,
  regex: /^ddnsx([0-3])$/,
  parameters: {
    index: { type: "integer", description: "DDNS client index (0-3)" },
  },
  description:
    "Configuration for a Dynamic DNS client instance. Stored as a composite string.",
  page: "basic-ddns.asp",
  type: "structured-string",
  defaultValue: {
    service: "",
    user_pass: "",
    host: "",
    wildcard: false,
    mx: "",
    backup_mx: false,
    custom_token: "",
  },
  structuredSchema: {
    kind: "object",
    fields: {
      service: { type: "string", label: "Service", defaultValue: "" },
      user_pass: { type: "string", label: "User/Pass", defaultValue: "" },
      host: { type: "string", label: "Host", defaultValue: "" },
      wildcard: {
        type: "boolean",
        label: "Wildcard",
        defaultValue: false,
      },
      mx: { type: "string", label: "Mail Exchanger", defaultValue: "" },
      backup_mx: {
        type: "boolean",
        label: "Backup MX",
        defaultValue: false,
      },
      custom_token: {
        type: "string",
        label: "Custom Token",
        defaultValue: "",
      },
    },
  },
  transform: {
    toUi: (value: NvramValue): DdnsConfig => {
      const parts = value.split("<");
      return {
        service: parts[0] || "",
        user_pass: parts[1] || "",
        host: parts[2] || "",
        wildcard: parts[3] === "1",
        mx: parts[4] || "",
        backup_mx: parts[5] === "1",
        custom_token: parts[6] || "",
      };
    },
    fromUi: (value: DdnsConfig): NvramValue => {
      return [
        value.service,
        value.user_pass,
        value.host,
        value.wildcard ? "1" : "0",
        value.mx,
        value.backup_mx ? "1" : "0",
        value.custom_token,
      ].join("<");
    },
  },
};
