import { Location } from "@/types/common";
import { DefaultSchedule, Period } from "@/types/place/schedule";
import { Collaborator, CreatedCollaborator } from "@/types/place/collaborators";
import { PlaceType } from "@/types/place/placeCaterories";

export interface NewProfileFormData {
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
  placeType: PlaceType[];
  location: Location | null;
  placeId?: string;
  placeActive?: boolean;
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
  image: string;
  collaborators: {
    _id: string;
    username: string;
    image: string;
  }[];
  createdCollaborators: {
    name: string;
    categoryId: string;
    id: string;
    _id: string;
  }[];
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
            | Collaborator[]
            | CreatedCollaborator[]
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
