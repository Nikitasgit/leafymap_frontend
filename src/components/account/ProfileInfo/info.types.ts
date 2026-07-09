import {
  FormDataChangeHandler,
  InitialCreatorData,
} from "../CreateProfileStepper";

export interface UserInfoProps {
  user: InitialCreatorData;
  onUserChange: FormDataChangeHandler;
  errors?: Record<string, string>;
  showLegalName?: boolean;
}
