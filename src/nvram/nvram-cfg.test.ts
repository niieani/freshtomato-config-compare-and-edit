import { expect, test, describe } from "bun:test";
import { decodeCfg, encodeCfg } from "./nvram-cfg";

const SAMPLE_CFG = "sample-files/sample.cfg";

const loadSample = async () => {
  const file = Bun.file(SAMPLE_CFG);
  return new Uint8Array(await file.arrayBuffer());
};

describe("decodeCfg", () => {
  test("parses HDR2 configuration exports", async () => {
    const data = await loadSample();
    const { header, entries, salt, fileLength } = decodeCfg(data);

    expect(header).toBe("HDR2");
    expect(typeof salt).toBe("number");
    const mwanCkdst = entries.mwan_ckdst;
    if (mwanCkdst === undefined) {
      throw new Error(
        "Expected entries.mwan_ckdst to be present in sample cfg",
      );
    }
    expect(fileLength).toBeGreaterThan(mwanCkdst.length);
    expect(mwanCkdst).toBe("1.1.1.1,google.com");
    expect(entries.wan2_dns).toBe("");
    expect(entries.wl_radius_port).toBe("1812");
  });
});

describe("encodeCfg", () => {
  const makeDeterministicRandom = () => {
    let value = 0;
    return () => {
      const next = value;
      value = (value + 1) & 0xff;
      return next;
    };
  };

  test("round-trips through HDR2 encoding/decoding", () => {
    const entries = {
      foo: "bar",
      multi: "line1\nline2",
      empty: "",
    };

    const encoded = encodeCfg(entries, {
      randomSource: makeDeterministicRandom(),
    });
    const { entries: decoded, header, salt } = decodeCfg(encoded);

    expect(header).toBe("HDR2");
    expect(typeof salt).toBe("number");
    expect(decoded).toEqual(entries);
  });

  test("supports HDR1 encoding", () => {
    const entries: Record<string, string> = {
      alpha: "beta",
      gamma: "delta",
    };

    const encoded = encodeCfg(entries, { format: "HDR1" });
    const { header, entries: decoded } = decodeCfg(encoded);

    expect(header).toBe("HDR1");
    expect(decoded).toEqual(entries);
  });
});
