import { Location } from "@/types/common";
import { DefaultSchedule, Period } from "@/types/place/schedule";
import { PlaceType } from "@/types/place/placeCaterories";
import { Partnership } from "@/types/partnerships";

export interface NewProfileFormData {
  userType: string;
  name: string;
  description: string;
  category: string;
  phone: string;
  email: string;
  website: string;
  defaultSchedule?: DefaultSchedule;
  partnerships: Partnership[];
  placeCategory?: string;
  placeType?: PlaceType[];
  location?: Location | null;
  placeId?: string;
  placeActive?: boolean;
}

export interface PlaceFormData {
  userType: "creator" | "organizer" | "guest";
  name: string;
  description: string;
  location: {
    id: string;
    label: string;
    coordinates: [number, number];
    type: "Point";
  };
  defaultSchedule: DefaultSchedule;
  placeCategory: string;
  phone: string;
  email: string;
  website: string;
  partnerships: Partnership[];
  placeType: PlaceType[];
}

export type FormDataChangeHandler = (
  e:
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    | {
        target: {
          name: string;
          value:
            | string
            | Location
            | string[]
            | Partnership[]
            | File
            | DefaultSchedule
            | Period[]
            | boolean
            | null;
        };
      }
) => void;

export type onNextHandler = () => void;
export type onBackHandler = () => void;
