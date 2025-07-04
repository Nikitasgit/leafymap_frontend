import { toast } from "sonner";

interface ToastFunctions {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showLoading: (message: string) => string | number;
  dismissToast: (toastId: string) => void;
  showPromise: (
    promise: Promise<unknown>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => unknown;
}

export const useToast = (): ToastFunctions => {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  const showInfo = (message: string) => {
    toast.info(message);
  };

  const showLoading = (message: string) => {
    return toast.loading(message);
  };

  const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
  };

  const showPromise = (
    promise: Promise<unknown>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showLoading,
    dismissToast,
    showPromise,
  };
};
