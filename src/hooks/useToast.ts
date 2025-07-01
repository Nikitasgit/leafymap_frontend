import { toast } from "sonner";

export const useToast = () => {
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
