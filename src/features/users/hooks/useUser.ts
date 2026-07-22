import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { fetchUserById } from "../api/usersApi";
import { UserPopulated } from "../types";

export const useUser = (userId?: string) => {
  const {
    data: user,
    isLoading,
    refetch,
  } = useApiQuery<UserPopulated | null>(
    async () => fetchUserById(userId as string),
    {
      initialData: null,
      enabled: !!userId,
      deps: [userId],
      errorMessage: "Erreur lors du chargement de l'utilisateur",
    },
  );

  return { user, isLoading, refetch };
};

export default useUser;
