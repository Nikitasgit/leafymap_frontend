import { PlaceType } from "@/types/place/placeCaterories";
import { FormDataChangeHandler } from "@/components/account/CreateProfileStepper/CreateProfileStepper.types";

export interface PlaceTypeSelectorInputProps {
  value: PlaceType[];
  onChange: FormDataChangeHandler;
  error?: boolean;
  errorMessage?: string;
}
