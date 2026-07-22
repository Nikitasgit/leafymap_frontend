import type { TFunction } from "i18next";

export const validationT = (t: TFunction): TFunction<"validation"> =>
  ((key: string, options?: Record<string, unknown>) =>
    t(`validation:${key}`, options)) as TFunction<"validation">;
