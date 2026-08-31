import { AxiosError } from "axios";
import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";
import type { ApiErrorResponse } from "@/shared/api/client";
import { getErrorMessage } from "./getErrorMessage";

const tIdentity = ((key: string) => key) as TFunction;

const tWithDefault = ((key: string, options?: { defaultValue?: string }) => {
  if (key === "errors:UNTRANSLATED") {
    return options?.defaultValue ?? "";
  }
  return key;
}) as TFunction;

const axiosError = (data: ApiErrorResponse): AxiosError<ApiErrorResponse> =>
  new AxiosError<ApiErrorResponse>(
    "Request failed",
    "ERR_BAD_REQUEST",
    undefined,
    undefined,
    {
      data,
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {} as never,
    },
  );

describe("getErrorMessage", () => {
  it("prefers a translated error code", () => {
    const error = axiosError({
      code: "AUTH_INVALID_CREDENTIALS",
      message: "Les identifiants sont incorrects",
    });

    expect(getErrorMessage(error, tIdentity)).toBe(
      "errors:AUTH_INVALID_CREDENTIALS",
    );
  });

  it("falls back to the API message when the code has no translation", () => {
    const error = axiosError({
      code: "UNTRANSLATED",
      message: "Message API",
    });

    expect(getErrorMessage(error, tWithDefault)).toBe("Message API");
  });

  it("uses the first validation message when there is no code or message", () => {
    const error = axiosError({
      data: { email: "email invalide" },
    });

    expect(getErrorMessage(error, tIdentity)).toBe("email invalide");
  });

  it("uses Error.message for non-axios errors", () => {
    expect(getErrorMessage(new Error("boom"), tIdentity)).toBe("boom");
  });

  it("uses the fallback or INTERNAL_SERVER_ERROR", () => {
    expect(getErrorMessage({}, tIdentity, "custom")).toBe("custom");
    expect(getErrorMessage({}, tIdentity)).toBe("errors:INTERNAL_SERVER_ERROR");
  });
});
