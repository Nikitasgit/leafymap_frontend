import { Location } from "@/types/common";
import { DefaultSchedule, Period } from "@/types/place/schedule";
import { Partnership } from "@/types/partnerships";
import { User } from "@/types/user";
import { Place } from "@/types/place";

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

export type onNextHandler = () => void;
export type onBackHandler = () => void;

export type InitialPlaceData = Pick<
  Place,
  "location" | "defaultSchedule" | "placeCategory" | "placeType" | "active"
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
