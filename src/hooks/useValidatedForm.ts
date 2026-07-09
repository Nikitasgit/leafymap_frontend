import { useCallback, useEffect, useState } from "react";
import { ZodError, ZodSchema } from "zod";

function zodErrorsToRecord(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.issues.forEach((issue) => {
    const field = issue.path.map(String).join(".");
    errors[field] = issue.message;
  });
  return errors;
}

export function useValidatedForm<T>(schema: ZodSchema<T>, initialValues: T) {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const validate = useCallback((): boolean => {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return true;
    }
    setErrors(zodErrorsToRecord(result.error));
    return false;
  }, [schema, values]);

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validate();
    }
  }, [hasAttemptedSubmit, validate]);

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
          setErrors(zodErrorsToRecord(result.error));
          onInvalid?.();
          return false;
        }
        setErrors({});
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
