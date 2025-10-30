/**
 * Defines the potential data types for a raw NVRAM value.
 */
export type NvramValue = string;
/**
 * Represents a single choice in an enum-style setting.
 */
export interface NvramOption<T extends string | number> {
  value: T;
  label: string;
}
/**
 * A validation function that checks a value against rules.
 * @param value The value to validate.
 * @param allValues A record of all current NVRAM settings for context-dependent validation.
 * @returns `true` if the value is valid, or an error message string if it is not.
 */
export type Validator<T> = (
  value: T,
  allValues: Record<string, NvramValue>,
) => true | string;
/**
 * A function that determines the UI state of a setting.
 * @param allValues A record of all current NVRAM settings.
 * @returns The state of the UI element.
 */
type UiStateEvaluator = (
  allValues: Record<string, NvramValue>,
) => "visible" | "hidden" | "enabled" | "disabled";
/**
 * Defines functions to transform values between their raw NVRAM string representation
 * and a more developer-friendly, structured format (e.g., boolean, object, array).
 */
export interface ValueTransformer<T> {
  /** Converts from the raw NVRAM string to the structured type. */
  toUi: (value: NvramValue) => T;
  /** Converts from the structured type back to the raw NVRAM string. */
  fromUi: (value: T) => NvramValue;
}

/** Primitive values supported in structured schemas. */
export type StructuredPrimitiveType = "string" | "number" | "integer" | "boolean";

export interface StructuredPrimitiveField {
  type: StructuredPrimitiveType;
  label?: string;
  /**
   * Default value used when creating new records.
   * Should match the specified primitive type.
   */
  defaultValue?: string | number | boolean;
  /** When true, the field may be omitted from the UI. */
  optional?: boolean;
}

export interface StructuredObjectSchemaDefinition {
  kind: "object";
  /**
   * Fixed set of scalar fields that make up the structured object.
   * Keys represent the NVRAM property names inside the structured value.
   */
  fields: {
    [key: string]: StructuredPrimitiveField;
  };
}

export interface StructuredArrayOfObjectsSchema {
  kind: "array";
  items: StructuredObjectSchemaDefinition;
}

export interface StructuredArrayOfPrimitivesSchema {
  kind: "array";
  items: StructuredPrimitiveField;
}

export type StructuredSchema =
  | StructuredObjectSchemaDefinition
  | StructuredArrayOfObjectsSchema
  | StructuredArrayOfPrimitivesSchema;
/**
 * Base interface for all NVRAM property definitions.
 */
interface NvramPropertyBase<T> {
  /** A human-readable description of the setting's purpose. */
  description: string;
  /** The primary .asp.html page where this setting is managed. */
  page: string;
  /** The data type used for the structured representation of the value. */
  type:
    | "boolean"
    | "integer"
    | "string"
    | "enum"
    | "ip"
    | "mac"
    | "netmask"
    | "structured-string"
    | "list"
    | "hex";
  /** An optional default value for the setting. */
  defaultValue?: T;
  /** An optional validation function for the structured value. */
  validation?: Validator<T>;
  /** Optional transformation logic for complex data types. */
  transform?: ValueTransformer<T>;
  /** Optional UI schema definition for structured values. */
  structuredSchema?: StructuredSchema;
  /** UI-specific metadata. */
  ui?: {
    /** The label displayed next to the control in the web interface. */
    label?: string;
    /** Defines UI state dependencies on other NVRAM settings. */
    state?: {
      dependsOn: string[];
      evaluator: UiStateEvaluator;
    };
    /** A list of choices for 'enum' type properties. */
    options?: ReadonlyArray<NvramOption<any>>;
    /** Suffix text displayed next to the UI control. */
    suffix?: string;
  };
}
/**
 * Represents a standard NVRAM property with a fixed key name.
 */
export interface NvramProperty<T = NvramValue> extends NvramPropertyBase<T> {
  key: string;
}
/**
 * Represents an NVRAM property that follows a dynamic naming pattern.
 */
export interface PatternedNvramProperty<
  P extends Record<string, any>,
  T = NvramValue,
> extends Omit<NvramPropertyBase<T>, "key"> {
  getKey: (params: P) => string;
  regex: RegExp;
  parameters: {
    [K in keyof P]: {
      type: "string" | "number" | "integer";
      description: string;
      range?: [number, number];
    };
  };
}

// --- Reusable Transformers ---

export const booleanTransformer: ValueTransformer<boolean> = {
  toUi: (value: NvramValue) => value === "1",
  fromUi: (value: boolean) => (value ? "1" : "0"),
};

/**
 * Transform for multiline script content that uses escape sequences.
 * Converts between encoded format (with \x0a, \x27, etc.) and readable UI format.
 */
export const multilineScriptTransformer: ValueTransformer<string> = {
  toUi: (raw: string): string => {
    // Decode hex escape sequences: \x0a -> newline, \x27 -> ', etc.
    // Note: \x5c must be decoded last to avoid interfering with other escape sequences
    return raw
      .replace(/\\x0a/g, '\n')
      .replace(/\\x09/g, '\t')
      .replace(/\\x22/g, '"')
      .replace(/\\x27/g, "'")
      .replace(/\\x5c/g, '\\');
  },
  fromUi: (ui: string): string => {
    // Encode special characters: newline -> \x0a, ' -> \x27, etc.
    // Note: backslash must be encoded first to avoid double-encoding
    return ui
      .replace(/\\/g, '\\x5c')
      .replace(/\n/g, '\\x0a')
      .replace(/\t/g, '\\x09')
      .replace(/"/g, '\\x22')
      .replace(/'/g, "\\x27");
  }
};

export const netmaskValidator: Validator<string> = (value) => {
  const parts = value.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255))
    return "Invalid netmask format.";
  const binStr = parts.map((p) => p.toString(2).padStart(8, "0")).join("");
  return (
    /^1*0*$/.test(binStr) || "Invalid netmask value (bits must be contiguous)."
  );
};

// --- Reusable Validators ---

export const rangeValidator = (
  min: number,
  max: number,
  name: string = "number",
) => {
  return ((value: number) => {
    if (isNaN(value) || value < min || value > max) {
      return `Invalid ${name}. Valid range: ${min}-${max}.`;
    }
    return true;
  }) satisfies Validator<number>;
};

export const portValidator = rangeValidator(1, 65535, "port");
export const pathValidator: Validator<string> = (value) =>
  value.startsWith("/") || "Path must start with the / root directory.";

export const buttonActionValidator: Validator<string> = (value) => {
  const validValues = ["0", "1", "2", "3", "4", "5"];
  return validValues.includes(value) || `Invalid action value: ${value}`;
};
