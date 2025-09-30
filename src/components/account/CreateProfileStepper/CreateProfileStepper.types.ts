import { Location } from "@/types/common";
import { DefaultSchedule, Period } from "@/types/place/schedule";
import { Partnership } from "@/types/partnerships";
import { User } from "@/types/user";
import { Place } from "@/types/place";
import { SubCategory } from "@/types/categories";

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
            | null
            | SubCategory[];
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
  User,
  "userType" | "creatorName" | "description" | "creatorCategories" | "website"
>;
