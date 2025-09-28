import { Partnership } from "@/types/partnerships";
import { Location } from "@/types/common";
import {
  FormDataChangeHandler,
  InitialCreatorData,
  InitialPlaceData,
} from "../../TempName/CreateProfileStepper.types";

export interface ProfileFormStepProps {
  place: InitialPlaceData;
  user: InitialCreatorData;
  partnerships?: Partnership[];
  firstStep?: boolean;
  submitButtonText?: string;
  initialPlaceLocation?: Location | null;
  onPlaceChange: FormDataChangeHandler;
  onUserChange?: FormDataChangeHandler;
  onPartnershipsChange?: (partnerships: Partnership[]) => void;
  onSubmit: () => Promise<void>;
  onBack?: () => void;
}

export interface ProfileFormStepErrors {
  place: Record<string, string>;
  user: Record<string, string>;
}
