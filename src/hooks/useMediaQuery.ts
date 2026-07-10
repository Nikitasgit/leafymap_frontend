import { useSyncExternalStore } from "react";

function subscribeToMediaQuery(
  query: string,
  onStoreChange: () => void,
): () => void {
  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addEventListener("change", onStoreChange);
  return () => mediaQueryList.removeEventListener("change", onStoreChange);
}

function getMediaQuerySnapshot(query: string): boolean {
  return window.matchMedia(query).matches;
}

export function useMediaQuery(
  query: string,
  serverSnapshot = false,
): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribeToMediaQuery(query, onStoreChange),
    () => getMediaQuerySnapshot(query),
    () => serverSnapshot,
  );
}
