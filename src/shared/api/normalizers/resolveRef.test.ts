import { describe, expect, it } from "vitest";
import { resolveRefId, resolveRefObject } from "./resolveRef";

describe("resolveRefId", () => {
  it("returns a string id as-is", () => {
    expect(resolveRefId("user-1")).toBe("user-1");
  });

  it("reads the id from a populated object", () => {
    expect(resolveRefId({ id: "user-1" })).toBe("user-1");
  });

  it("returns null for a missing ref", () => {
    expect(resolveRefId(null)).toBeNull();
    expect(resolveRefId(undefined)).toBeNull();
  });
});

describe("resolveRefObject", () => {
  it("returns the populated object", () => {
    const place = { id: "place-1", name: "Studio" };

    expect(resolveRefObject(place)).toEqual(place);
  });

  it("returns null for a string id", () => {
    expect(resolveRefObject("place-1")).toBeNull();
  });

  it("returns null for a missing ref", () => {
    expect(resolveRefObject(null)).toBeNull();
    expect(resolveRefObject(undefined)).toBeNull();
  });
});
