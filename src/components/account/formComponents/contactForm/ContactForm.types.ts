import {
  InitialCreatorData,
  InitialPlaceData,
} from "../../CreateProfileStepper/CreateProfileStepper.types";
import { FormDataChangeHandler } from "../../CreateProfileStepper/CreateProfileStepper.types";

export interface PlaceContactFormProps {
  place: InitialPlaceData;
  onPlaceChange: FormDataChangeHandler;
  errors?: Record<string, string>;
}

export interface UserContactFormProps {
  user: InitialCreatorData;
  onUserChange: FormDataChangeHandler;
  errors?: Record<string, string>;
}
