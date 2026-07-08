import { FormDataChangeHandler } from "@/components/account/CreateProfileStepper";

export interface PlaceTypeSelectorInputProps {
  value: string[];
  onChange: FormDataChangeHandler;
  error?: boolean;
}
