import {
  InitialCreatorData,
  FormDataChangeHandler,
} from "../CreateProfileStepper";

export interface UserContactFormProps {
  user: InitialCreatorData;
  onUserChange: FormDataChangeHandler;
  errors?: Record<string, string>;
}
