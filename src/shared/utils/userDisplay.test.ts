import { describe, expect, it } from "vitest";
import { getAvatarLetter, getDisplayName } from "./userDisplay";

describe("getDisplayName", () => {
  it("prefers username", () => {
    expect(
      getDisplayName({
        username: "lea",
        firstname: "Léa",
        lastname: "Martin",
        email: "lea@example.com",
      }),
    ).toBe("lea");
  });

  it("uses firstname and lastname when username is missing", () => {
    expect(
      getDisplayName({
        firstname: "Léa",
        lastname: "Martin",
        email: "lea@example.com",
      }),
    ).toBe("Léa Martin");
  });

  it("falls back to email", () => {
    expect(getDisplayName({ email: "lea@example.com" })).toBe(
      "lea@example.com",
    );
  });

  it("uses the default fallback when user is empty", () => {
    expect(getDisplayName(null)).toBe("Utilisateur");
    expect(getDisplayName({}, "Invité")).toBe("Invité");
  });
});

describe("getAvatarLetter", () => {
  it("uses the first letter of the username", () => {
    expect(getAvatarLetter({ username: "lea" })).toBe("L");
  });

  it("uses the firstname when username is missing", () => {
    expect(getAvatarLetter({ firstname: "éa" })).toBe("É");
  });

  it("uses the email when name is missing", () => {
    expect(getAvatarLetter({ email: "user@example.com" })).toBe("U");
  });

  it("returns U when user is empty", () => {
    expect(getAvatarLetter(null)).toBe("U");
    expect(getAvatarLetter({})).toBe("U");
  });
});
