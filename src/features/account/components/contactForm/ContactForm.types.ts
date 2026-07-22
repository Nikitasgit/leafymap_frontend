import {
  InitialCreatorData,
  FormDataChangeHandler,
} from "../createProfileStepper";

export interface UserContactFormProps {
  user: InitialCreatorData;
  onUserChange: FormDataChangeHandler;
  errors?: Record<string, string>;
}
