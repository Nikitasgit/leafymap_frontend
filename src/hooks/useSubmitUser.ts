import { apiClient } from "@/lib/api/client";
import { useLoading } from "@/hooks/useLoading";
import useHandleApiErrors from "./useHandleApiErrors";
import { User } from "@/types/user";

const useSubmitUser = () => {
  const { handleApiError } = useHandleApiErrors();
  const { isLoading, withLoading } = useLoading();

  const submitUser = async (data: Partial<User>) => {
    return withLoading(async () => {
      await apiClient.put("/api/users", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return true;
    }).catch((err: unknown) => {
      handleApiError(err, undefined, true);
    });
  };

  return { submitUser, isLoading };
};

export default useSubmitUser;
