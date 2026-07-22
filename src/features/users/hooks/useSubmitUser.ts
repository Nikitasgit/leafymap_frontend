import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { updateUser } from "../api/usersApi";
import { User } from "../types";

const useSubmitUser = () => {
  const { mutate, isLoading } = useApiMutation(async (data: Partial<User>) => {
    await updateUser(data);
    return true as const;
  });

  return { submitUser: mutate, isLoading };
};

export default useSubmitUser;
