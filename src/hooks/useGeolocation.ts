import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

export const useGeolocation = () => {
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    // browser does not support geolocation
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGeolocation((prev) => ({
        ...prev,
        error: "La géolocalisation n'est pas supportée par ce navigateur",
        isLoading: false,
      }));
      return;
    }

    // user shared their location
    const success = (position: GeolocationPosition) => {
      setGeolocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        isLoading: false,
      });
    };

    // user refused to share their location or the location is not available
    const error = (error: GeolocationPositionError) => {
      let errorMessage = "Erreur de géolocalisation";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Permission de géolocalisation refusée";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Position non disponible";
          break;
        case error.TIMEOUT:
          errorMessage = "Délai d'attente dépassé";
          break;
      }

      setGeolocation({
        latitude: null,
        longitude: null,
        error: errorMessage,
        isLoading: false,
      });
    };

    // options for the geolocation
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
    };

    // get user's location
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  return geolocation;
};
