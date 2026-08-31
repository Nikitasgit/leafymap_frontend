import { describe, expect, it } from "vitest";
import { tStub } from "@/test/tStub";
import {
  createValidateLoginData,
  createValidateRegisterData,
  createValidateRequestPasswordResetData,
  createValidateResetPasswordData,
} from "./authValidations";

const loginPassword = "x";
const validPassword = ["Valid", "Pass", "1x"].join("");
const otherValidPassword = ["Valid", "Pass", "2x"].join("");
const tooShortPassword = ["A", "b", "1"].join("");
const lettersOnlyPassword = "a".repeat(10);

describe("createValidateLoginData", () => {
  const validate = createValidateLoginData(tStub);

  it("accepts an email identifier", () => {
    const result = validate({
      identifier: "user@example.com",
      password: loginPassword,
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("accepts a username identifier", () => {
    const result = validate({
      identifier: "e2e_user",
      password: loginPassword,
    });

    expect(result.isValid).toBe(true);
  });

  it("rejects an empty identifier", () => {
    const result = validate({ identifier: "", password: loginPassword });

    expect(result.isValid).toBe(false);
    expect(result.errors.identifier).toBe("auth.identifier.invalid");
  });

  it("rejects an invalid identifier", () => {
    const result = validate({ identifier: "no spaces", password: loginPassword });

    expect(result.isValid).toBe(false);
    expect(result.errors.identifier).toBe("auth.identifier.invalid");
  });

  it("rejects an empty password", () => {
    const result = validate({
      identifier: "user@example.com",
      password: "",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe("auth.password.required");
  });
});

describe("createValidateRegisterData", () => {
  const validate = createValidateRegisterData(tStub);
  const valid = {
    email: "user@example.com",
    password: validPassword,
    confirmPassword: validPassword,
    acceptedCGU: true,
    emailNotifications: false,
  };

  it("accepts a complete registration", () => {
    expect(validate(valid).isValid).toBe(true);
  });

  it("rejects a missing email", () => {
    const result = validate({ ...valid, email: "" });

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe("common.email.invalid");
  });

  it("rejects a password that is too short", () => {
    const result = validate({
      ...valid,
      password: tooShortPassword,
      confirmPassword: tooShortPassword,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe("auth.password.minLength");
  });

  it("rejects a password without complexity", () => {
    const result = validate({
      ...valid,
      password: lettersOnlyPassword,
      confirmPassword: lettersOnlyPassword,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe("auth.password.complexity");
  });

  it("rejects a password confirmation mismatch", () => {
    const result = validate({
      ...valid,
      confirmPassword: otherValidPassword,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.confirmPassword).toBe("auth.passwordConfirm.mismatch");
  });

  it("rejects when CGU are not accepted", () => {
    const result = validate({ ...valid, acceptedCGU: false });

    expect(result.isValid).toBe(false);
    expect(result.errors.acceptedCGU).toBe("auth.cgu.required");
  });
});

describe("createValidateRequestPasswordResetData", () => {
  const validate = createValidateRequestPasswordResetData(tStub);

  it("accepts a valid email", () => {
    expect(validate({ email: "user@example.com" }).isValid).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = validate({ email: "not-an-email" });

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe("common.email.invalid");
  });
});

describe("createValidateResetPasswordData", () => {
  const validate = createValidateResetPasswordData(tStub);

  it("accepts a matching reset", () => {
    const result = validate({
      token: "reset-token",
      newPassword: validPassword,
      confirmPassword: validPassword,
    });

    expect(result.isValid).toBe(true);
  });

  it("rejects a missing token", () => {
    const result = validate({
      token: "",
      newPassword: validPassword,
      confirmPassword: validPassword,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.token).toBe("auth.token.required");
  });

  it("rejects a confirmation mismatch", () => {
    const result = validate({
      token: "reset-token",
      newPassword: validPassword,
      confirmPassword: otherValidPassword,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.confirmPassword).toBe("auth.passwordConfirm.mismatch");
  });
});
