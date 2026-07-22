export function resolveRefId(
  ref: string | { id: string } | null | undefined,
): string | null {
  if (ref == null) return null;
  if (typeof ref === "string") return ref;
  return ref.id ?? null;
}

/**
 * Returns the populated object when the ref is an object, otherwise null.
 */
export function resolveRefObject<T extends { id: string }>(
  ref: string | T | null | undefined,
): T | null {
  if (ref != null && typeof ref === "object") {
    return ref;
  }
  return null;
}
