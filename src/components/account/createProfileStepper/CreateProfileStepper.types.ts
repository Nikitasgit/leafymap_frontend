import {
  DaySchedule,
  WeekDay,
} from "@/components/common/forms/timetable/TimeTable.types";
import { Location } from "@/types/map";

export type DefaultSchedule = Record<WeekDay, DaySchedule>;

export interface FormData {
  userType: string;
  image: string | File;
  name: string;
  description: string;
  category: string;
  phone: string;
  email: string;
  website: string;
  defaultSchedule: DefaultSchedule;
  collaborators: Collaborator[];
  createdCollaborators: CreatedCollaborator[];
  placeCategory: string;
  location: Location | null;
  placeId?: string;
}
export type Collaborator = {
  icon: string;
  label: string;
  id: string;
};
export type CreatedCollaborator = {
  name: string;
  category: string;
  id: string;
  _id?: string;
};

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
            | Collaborator[]
            | CreatedCollaborator[]
            | File
            | DefaultSchedule
            | null;
        };
      }
) => void;
