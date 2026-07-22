/**
 * Compares two entity ids (string or object with toString).
 * Returns true only when both are defined and represent the same value.
 */
export const isSameId = (
  a: string | undefined | null,
  b: string | undefined | null
): boolean => !!a && !!b && String(a) === String(b);
