import {
  FormDataChangeHandler,
  InitialCreatorData,
} from "../createProfileStepper";

export interface UserInfoProps {
  user: InitialCreatorData;
  onUserChange: FormDataChangeHandler;
  errors?: Record<string, string>;
  showLegalName?: boolean;
}
