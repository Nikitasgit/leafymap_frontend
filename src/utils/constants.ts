// Map constants

export const DEFAULT_LOCATION = {
  latitude: 48.866667,
  longitude: 2.333333,
  zoom: 12,
};

export const USER_MARKER = {
  location: {
    coordinates: [2.333333, 48.866667],
  },
  placeCategory: { name: "workshop" },
  name: "Déplacez votre lieu",
  isSelected: true,
  _id: "user-marker",
};

// Event constants

export const ACTIVE_LIFECYCLE_STATUSES: ("upcoming" | "ongoing")[] = [
  "upcoming",
  "ongoing",
];
