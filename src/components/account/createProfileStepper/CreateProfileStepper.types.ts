import {
  DaySchedule,
  WeekDay,
} from "@/components/common/forms/timetable/TimeTable.types";
import { Location } from "@/types/map";
import { Collaborator } from "./steps/ActivityFormStep/formComponents/CreatePartner";

export type DefaultSchedule = Record<WeekDay, DaySchedule>;

export interface FormData {
  userType: string;
  name: string;
  description: string;
  category: string;
  location: Location | null;
  defaultSchedule: DefaultSchedule;
  placeCategory: string;
  phone: string;
  email: string;
  website: string;
  collaborators: string[];
  createdCollaborators: createdCollaborator[];
  profilePicture: string | File;
}

export type createdCollaborator = {
  name: string;
  category: string;
  id?: string;
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
            | Collaborator
            | Collaborator[]
            | File
            | DefaultSchedule
            | null;
        };
      }
) => void;
