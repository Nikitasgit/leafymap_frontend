import { Location } from "@/shared/types/common";
import {
  FormDataChangeHandler,
  InitialCreatorData,
  InitialPlaceData,
} from "../../createProfileStepper";

export interface ProfileFormStepProps {
  place?: InitialPlaceData;
  user: InitialCreatorData;
  firstStep?: boolean;
  submitButtonText?: string;
  initialPlaceLocation?: Location | null;
  onPlaceChange: FormDataChangeHandler;
  onUserChange?: FormDataChangeHandler;
  onSubmit: () => Promise<void>;
  onBack?: () => void;
  showPlaceForm?: boolean;
  showPlaceRadioYesOrNo?: boolean;
  hideUserLegalName?: boolean;
}

export interface ProfileFormStepErrors {
  place: Record<string, string>;
  user: Record<string, string>;
}
