import { useCallback } from "react";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import useHandleApiErrors from "./useHandleApiErrors";

export type UseApiMutationOptions = {
  successMessage?: string;
  onError?: "toast" | "silent";
  rethrow?: boolean;
};

/**
 * Generic mutation wrapper: loading + success toast + API error handling.
 * Feature hooks become thin wrappers around this.
 */
export function useApiMutation<TArgs extends unknown[], TResult>(
  mutationFn: (...args: TArgs) => Promise<TResult>,
  options: UseApiMutationOptions = {},
) {
  const { isLoading, withLoading } = useLoading();
  const { showSuccess } = useToast();
  const { handleApiError } = useHandleApiErrors();
  const {
    successMessage,
    onError = "toast",
    rethrow = false,
  } = options;

  const mutate = useCallback(
    async (...args: TArgs): Promise<TResult | undefined> => {
      try {
        const result = await withLoading(() => mutationFn(...args));
        if (successMessage) {
          showSuccess(successMessage);
        }
        return result;
      } catch (err) {
        if (onError !== "silent") {
          handleApiError(err, undefined, true);
        }
        if (rethrow) {
          throw err;
        }
        return undefined;
      }
    },
    [
      mutationFn,
      withLoading,
      successMessage,
      showSuccess,
      onError,
      handleApiError,
      rethrow,
    ],
  );

  return { mutate, isLoading };
}
