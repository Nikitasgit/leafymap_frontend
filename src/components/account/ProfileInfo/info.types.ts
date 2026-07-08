import {
  FormDataChangeHandler,
  InitialCreatorData,
} from "../CreateProfileStepper";

export interface UserInfoProps {
  user: InitialCreatorData;
  onUserChange: FormDataChangeHandler;
  errors?: Record<string, string>;
  onPlaceChange: FormDataChangeHandler;
  showLegalName?: boolean;
}
