import {
  FormDataChangeHandler,
  InitialPlaceData,
  InitialCreatorData,
} from "../../CreateProfileStepper/CreateProfileStepper.types";

export interface PlaceInfoProps {
  place: InitialPlaceData;
  onPlaceChange: FormDataChangeHandler;
  errors?: Record<string, string>;
}

export interface UserInfoProps {
  user: InitialCreatorData;
  onUserChange: FormDataChangeHandler;
  errors?: Record<string, string>;
  onPlaceChange: FormDataChangeHandler;
}
