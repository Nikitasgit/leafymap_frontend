import { describe, expect, it } from "vitest";
import {
  getLocaleSwitchPath,
  getLocalizedPath,
  stripLocaleFromPath,
} from "./getLocalizedPath";

describe("stripLocaleFromPath", () => {
  it("strips a locale prefix", () => {
    expect(stripLocaleFromPath("/fr/account")).toBe("/account");
    expect(stripLocaleFromPath("/en/auth/signin")).toBe("/auth/signin");
  });

  it("maps a locale root to /", () => {
    expect(stripLocaleFromPath("/fr")).toBe("/");
    expect(stripLocaleFromPath("/en")).toBe("/");
  });

  it("leaves a path without locale unchanged", () => {
    expect(stripLocaleFromPath("/account")).toBe("/account");
  });
});

describe("getLocalizedPath", () => {
  it("omits the prefix for the default locale", () => {
    expect(getLocalizedPath("/account", "fr")).toBe("/account");
    expect(getLocalizedPath("/fr/account", "fr")).toBe("/account");
  });

  it("prefixes a non-default locale", () => {
    expect(getLocalizedPath("/account", "en")).toBe("/en/account");
    expect(getLocalizedPath("/", "en")).toBe("/en");
  });
});

describe("getLocaleSwitchPath", () => {
  it("always prefixes the locale so the proxy can set the cookie", () => {
    expect(getLocaleSwitchPath("/account", "fr")).toBe("/fr/account");
    expect(getLocaleSwitchPath("/account", "en")).toBe("/en/account");
    expect(getLocaleSwitchPath("/", "fr")).toBe("/fr");
  });
});
