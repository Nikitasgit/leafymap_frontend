import { useCallback, useMemo, useState } from "react";
import { ZodError, ZodSchema } from "zod";

function zodErrorsToRecord(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.issues.forEach((issue) => {
    const field = issue.path.map(String).join(".");
    errors[field] = issue.message;
  });
  return errors;
}

function computeErrors<T>(
  schema: ZodSchema<T>,
  values: T,
): Record<string, string> {
  const result = schema.safeParse(values);
  if (result.success) {
    return {};
  }
  return zodErrorsToRecord(result.error);
}

export function useValidatedForm<T>(schema: ZodSchema<T>, initialValues: T) {
  const [values, setValuesState] = useState<T>(initialValues);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const errors = useMemo(
    () =>
      hasAttemptedSubmit ? computeErrors(schema, values) : {},
    [hasAttemptedSubmit, schema, values],
  );

  const validate = useCallback((): boolean => {
    const result = schema.safeParse(values);
    return result.success;
  }, [schema, values]);

  const setField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValuesState((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const setValues = useCallback((updater: T | ((prev: T) => T)) => {
    setValuesState(updater);
  }, []);

  const handleSubmit = useCallback(
    (
      onValid: (values: T) => void | Promise<void>,
      onInvalid?: () => void,
    ) =>
      async (e?: React.FormEvent) => {
        e?.preventDefault();
        setHasAttemptedSubmit(true);
        const result = schema.safeParse(values);
        if (!result.success) {
          onInvalid?.();
          return false;
        }
        await onValid(result.data);
        return true;
      },
    [schema, values],
  );

  return {
    values,
    errors,
    hasAttemptedSubmit,
    setField,
    setValues,
    validate,
    handleSubmit,
  };
}
