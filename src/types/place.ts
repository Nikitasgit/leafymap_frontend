interface Location {
  type: "Point";
  coordinates: [number, number];
  label: string;
  id?: string;
}

interface ScheduleTimeRange {
  from: string;
  to: string;
}

interface DaySchedule {
  isClosed: boolean;
  timeRanges: ScheduleTimeRange[];
}

type DefaultSchedule = {
  [day: string]: DaySchedule;
};

interface Place {
  _id: string;
  title: string;
  description?: string;
  userId: string;
  location: Location;
  placeCategory: string; // ID of PlaceCategory
  categories: string[]; // Array of SubCategory IDs
  defaultSchedule?: DefaultSchedule;
  collaborators?: string[]; // Array of User IDs
  createdCollaborators?: string[]; // Array of User IDs
  isCreatorPlace?: boolean;
  phone?: string;
  email?: string;
  website?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type { Place };
