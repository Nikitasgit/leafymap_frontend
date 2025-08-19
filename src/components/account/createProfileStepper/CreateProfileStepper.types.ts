import { Location } from "@/types/common";
import { DefaultSchedule, Period } from "@/types/place/schedule";
import { PlaceType } from "@/types/place/placeCaterories";
import { Partnership } from "@/types/partnerships";
import { Creator } from "@/types/user";
import { Place } from "@/types/place";

export interface BaseProfileFormData {
  userType: string;
  name: string;
  description: string;
  categories: string[];
  phone: string;
  email: string;
  website: string;
}

export interface PlaceFormData {
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

export type InitialPlaceData = Pick<
  Place,
  | "name"
  | "description"
  | "location"
  | "defaultSchedule"
  | "placeCategory"
  | "phone"
  | "email"
  | "website"
  | "placeType"
  | "active"
>;

export type InitialCreatorData = Pick<
  Creator,
  "userType" | "creatorName" | "description" | "creatorCategories" | "website"
>;
