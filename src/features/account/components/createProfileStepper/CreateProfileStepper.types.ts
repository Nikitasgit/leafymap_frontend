import { Location } from "@/shared/types/common";
import { DefaultSchedule, Period } from "@/features/places/types/schedule";
import type { Partnership } from "@/features/partnerships/types";
import { User } from "@/features/users/types";
import { Place } from "@/features/places/types/place";

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
      },
) => void;

export type InitialPlaceData = Pick<
  Place,
  | "name"
  | "description"
  | "location"
  | "defaultSchedule"
  | "placeCategory"
  | "active"
  | "phone"
  | "email"
  | "website"
>;

export type InitialCreatorData = Pick<
  User,
  | "userType"
  | "username"
  | "description"
  | "userCategory"
  | "website"
  | "phone"
  | "firstname"
  | "lastname"
>;
