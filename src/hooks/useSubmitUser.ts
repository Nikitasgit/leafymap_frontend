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
    }).catch((err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.data) {
        if (err.response.data.data && Array.isArray(err.response.data.data)) {
          err.response.data.data.forEach((error: { message: string }) => {
            showError(error.message);
          });
        } else {
          showError(err.response.data.message);
        }
      }
    });
  };

  return { submitUser, isLoading };
};

export default useSubmitUser;
