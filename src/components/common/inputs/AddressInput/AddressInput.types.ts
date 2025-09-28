import { Location } from "@/types/common";

export interface AddressInputProps {
  onLocationSelect: (location: Location | null) => void;
  value?: string;
  selectedLocation?: Location | null;
  error?: boolean;
  errorMessage?: string;
}
