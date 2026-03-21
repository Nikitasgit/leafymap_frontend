import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { DEFAULT_LOCATION } from "@/utils/constants";

export type MapViewState = {
  latitude: number;
  longitude: number;
  zoom: number;
};

const URL_SYNC_DEBOUNCE_MS = 500;
const PRECISION_LATLNG = 6;
const PRECISION_ZOOM = 2;

const DEFAULT_VIEW: MapViewState = {
  latitude: DEFAULT_LOCATION.latitude,
  longitude: DEFAULT_LOCATION.longitude,
  zoom: DEFAULT_LOCATION.zoom,
};

const GEO_OPTIONS_FAST: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 60000,
};

function parseFloatSafe(v: string | null): number | null {
  if (v === null) return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function readViewFromParams(params: URLSearchParams): MapViewState | null {
  const lat = parseFloatSafe(params.get("lat"));
  const lng = parseFloatSafe(params.get("lng"));
  const z = parseFloatSafe(params.get("z"));
  if (lat !== null && lng !== null && z !== null) {
    return { latitude: lat, longitude: lng, zoom: z };
  }
  return null;
}

/**
 * Manages the map view state and persists lat/lng/z in the URL query string.
 *
 * Initialization priority (evaluated once at mount):
 *  1. `lat`/`lng`/`z` present in URL  → restore that view
 *  2. nothing in URL, permission already granted → resolve position, then render
 *  3. nothing in URL, permission prompt/denied → render at Paris, let GeolocateControl handle it
 *
 * The `creator` param is handled separately by MapPageContainer; this hook
 * never reads or writes it.
 */
export function useMapViewState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialSnapshot = useMemo(() => {
    const hasCreator = searchParams.has("creator");
    const urlView = readViewFromParams(searchParams);
    return { hasCreator, urlView };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const needsGeolocation =
    !initialSnapshot.hasCreator && !initialSnapshot.urlView;

  const [viewState, setViewState] = useState<MapViewState>(
    initialSnapshot.urlView ?? DEFAULT_VIEW
  );
  const [isResolvingPosition, setIsResolvingPosition] = useState(needsGeolocation);

  // When geolocation permission is already granted, resolve user position
  // *before* the map renders to avoid the "Paris flash then fly" effect.
  // When permission is still "prompt" or "denied", give up immediately so the
  // map renders at Paris and lets GeolocateControl handle the prompt.
  useEffect(() => {
    if (!needsGeolocation) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setIsResolvingPosition(false);
      return;
    }

    let cancelled = false;

    const resolvePosition = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return;
          setViewState({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            zoom: DEFAULT_VIEW.zoom,
          });
          setIsResolvingPosition(false);
        },
        () => {
          if (cancelled) return;
          setIsResolvingPosition(false);
        },
        GEO_OPTIONS_FAST
      );
    };

    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          if (cancelled) return;
          if (result.state === "granted") {
            resolvePosition();
          } else {
            setIsResolvingPosition(false);
          }
        })
        .catch(() => {
          if (cancelled) return;
          setIsResolvingPosition(false);
        });
    } else {
      setIsResolvingPosition(false);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------
  // URL sync — refs keep the debounced callback identity stable so that
  // onViewStateChange never changes and doesn't trigger re-renders.
  // ------------------------------------------------------------------
  const searchParamsRef = useRef(searchParams);
  const pathnameRef = useRef(pathname);
  const routerRef = useRef(router);
  useEffect(() => { searchParamsRef.current = searchParams; }, [searchParams]);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);
  useEffect(() => { routerRef.current = router; }, [router]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  const syncViewToUrl = useCallback((vs: MapViewState) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      const params = new URLSearchParams(searchParamsRef.current.toString());
      params.set("lat", vs.latitude.toFixed(PRECISION_LATLNG));
      params.set("lng", vs.longitude.toFixed(PRECISION_LATLNG));
      params.set("z", vs.zoom.toFixed(PRECISION_ZOOM));
      routerRef.current.replace(
        `${pathnameRef.current}?${params.toString()}`,
        { scroll: false }
      );
    }, URL_SYNC_DEBOUNCE_MS);
  }, []);

  const onViewStateChange = useCallback(
    (vs: MapViewState) => {
      setViewState(vs);
      syncViewToUrl(vs);
    },
    [syncViewToUrl]
  );

  /**
   * Move camera to user on first fix — only when URL had no creator, no lat/lng/z
   * (first visit). If `creator` or saved view is present, false = dot only, no camera steal.
   */
  const shouldFollowUserOnGeolocate = needsGeolocation;

  return {
    viewState,
    onViewStateChange,
    shouldFollowUserOnGeolocate,
    isResolvingPosition,
  } as const;
}
