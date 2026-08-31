import { describe, expect, it } from "vitest";
import { tStub } from "@/test/tStub";
import {
  createDescriptionSchema,
  createEmailSchema,
  createFirstnameSchema,
  createLastnameSchema,
  createPhoneSchema,
  createWebsiteSchema,
} from "./commonValidations";

describe("createEmailSchema", () => {
  const schema = createEmailSchema(tStub);

  it("accepts a valid email", () => {
    expect(schema.safeParse("user@example.com").success).toBe(true);
  });

  it("rejects an empty email", () => {
    const result = schema.safeParse("");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("common.email.required");
    }
  });

  it("rejects an invalid email", () => {
    const result = schema.safeParse("not-an-email");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("common.email.invalid");
    }
  });
});

describe("createPhoneSchema", () => {
  const schema = createPhoneSchema(tStub);

  it("accepts an empty value", () => {
    expect(schema.safeParse("").success).toBe(true);
  });

  it("accepts 10 digits", () => {
    expect(schema.safeParse("0612345678").success).toBe(true);
  });

  it("rejects a non-digit phone", () => {
    const result = schema.safeParse("061234567");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("common.phone.tenDigits");
    }
  });
});

describe("createWebsiteSchema", () => {
  const schema = createWebsiteSchema(tStub);

  it("accepts an omitted value", () => {
    expect(schema.safeParse(undefined).success).toBe(true);
  });

  it("accepts a bare domain", () => {
    expect(schema.safeParse("leafymap.com").success).toBe(true);
  });

  it("accepts a url with protocol", () => {
    expect(schema.safeParse("https://leafymap.com").success).toBe(true);
  });

  it("rejects a value without a dot", () => {
    const result = schema.safeParse("notadomain");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("common.website.invalidUrl");
    }
  });
});

describe("createDescriptionSchema", () => {
  const schema = createDescriptionSchema(tStub);

  it("accepts a description within bounds", () => {
    expect(schema.safeParse("A valid description").success).toBe(true);
  });

  it("rejects a description that is too short", () => {
    const result = schema.safeParse("too short");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "common.description.minLength"
      );
    }
  });
});

describe("createFirstnameSchema and createLastnameSchema", () => {
  const firstname = createFirstnameSchema(tStub);
  const lastname = createLastnameSchema(tStub);

  it("accepts accented names", () => {
    expect(firstname.safeParse("Léa").success).toBe(true);
    expect(lastname.safeParse("O'Neil").success).toBe(true);
  });

  it("rejects an empty firstname", () => {
    const result = firstname.safeParse("");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("common.firstname.required");
    }
  });

  it("rejects invalid characters", () => {
    const result = lastname.safeParse("Name123");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "common.lastname.invalidChars"
      );
    }
  });
});
