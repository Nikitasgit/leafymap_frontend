export const DEFAULT_LOCATION = {
  latitude: 48.866667,
  longitude: 2.333333,
  zoom: 12,
};

export const FRANCE_VIEW = {
  center: [2.35, 46.2] as [number, number],
  zoom: 5.5,
};

export const USER_MARKER = {
  location: {
    coordinates: [2.333333, 48.866667],
  },
  placeCategory: { name: "workshop" },
  name: "Déplacez votre lieu",
  isSelected: true,
  id: "user-marker",
};
