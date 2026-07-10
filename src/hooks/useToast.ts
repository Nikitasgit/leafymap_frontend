import { toast } from "sonner";

interface ToastFunctions {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const showSuccess = (message: string) => {
  toast.success(message);
};

const showError = (message: string) => {
  toast.error(message);
};

const showInfo = (message: string) => {
  toast.info(message);
};

export const useToast = (): ToastFunctions => ({
  showSuccess,
  showError,
  showInfo,
});
