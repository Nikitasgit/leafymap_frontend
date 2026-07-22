import { useCallback, useEffect, useState, type DependencyList } from "react";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export type UseApiQueryOptions<T> = {
  initialData: T;
  enabled?: boolean;
  deps: DependencyList;
  errorMessage: string;
};

/**
 * Generic query wrapper: state + loading + error toast + refetch.
 * Feature hooks become thin wrappers around this.
 */
export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  options: UseApiQueryOptions<T>,
) {
  const { initialData, enabled = true, deps, errorMessage } = options;
  const [data, setData] = useState<T>(initialData);
  const { isLoading, withLoading } = useLoading(enabled);
  const { showError } = useToast();
  const { t } = useTranslation();

  const load = useCallback(async () => {
    try {
      setData(await queryFn());
    } catch (err) {
      setData(initialData);
      showError(getErrorMessage(err, t, errorMessage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps driven by caller
  }, deps);

  useEffect(() => {
    if (!enabled) {
      setData(initialData);
      return;
    }
    withLoading(load);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps driven by caller
  }, deps);

  return { data, isLoading, refetch: load, setData };
}
