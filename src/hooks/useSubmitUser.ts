import axios from "axios";
import { useToast } from "@/hooks/useToast";
import { useLoading } from "@/hooks/useLoading";
import { User } from "@/types/user";

const useSubmitUser = () => {
  const { showSuccess, showError } = useToast();
  const { isLoading, withLoading } = useLoading();

  const submitUser = async (data: Partial<User>) => {
    return withLoading(async () => {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      showSuccess("Profil mis à jour avec succès !");
      return true;
    }).catch((err: unknown) => {
      console.log(err);
      if (axios.isAxiosError(err) && err.response?.data) {
        if (err.response.data.data) {
          Object.values(err.response.data.data).forEach((error: unknown) => {
            if (Array.isArray(error)) {
              error.forEach((e: string) => {
                showError(e);
              });
            } else if (typeof error === "string") {
              showError(error);
            }
          });
        } else {
          showError(err.response.data.message);
        }
      } else {
        showError("Une erreur inattendue s'est produite");
      }
    });
  };

  return { submitUser, isLoading };
};

export default useSubmitUser;
