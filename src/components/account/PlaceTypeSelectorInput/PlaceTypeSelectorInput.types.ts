import { PlaceType } from "@/types/place/placeCaterories";
import { FormDataChangeHandler } from "@/components/account/TempName/CreateProfileStepper.types";

export interface PlaceTypeSelectorInputProps {
  value: PlaceType[];
  onChange: FormDataChangeHandler;
  error?: boolean;
  errorMessage?: string;
}
