import axios from "axios";
import { BaseProfileFormData } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useLoading } from "@/hooks/useLoading";
import { useCreatePartnerships } from "./useCreatePartnerships";

type UseCreateProfileReturn = {
  submitForm: (data: BaseProfileFormData, isUpdate: boolean) => Promise<void>;
  isLoading: boolean;
};

const useUpdateProfile = (): UseCreateProfileReturn => {
  const router = useRouter();
  const { createPartnerships } = useCreatePartnerships();
  const { showSuccess, showError } = useToast();
  const { isLoading, withLoading } = useLoading();

  const submitForm = async (data: BaseProfileFormData, isUpdate: boolean) => {
    const { partnerships, ...userData } = data;
    return withLoading(async () => {
      const { userType, name, description, phone, email, website, category } =
        userData;
      const requestData: Partial<BaseProfileFormData> = {
        userType,
        name,
        description,
        phone,
        email,
        website,
        category,
      };
      if (
        (userData.placeActive && userData.userType === "creator") ||
        userData.userType === "organizer"
      ) {
        const {
          location,
          placeCategory,
          defaultSchedule,
          placeActive,
          placeType,
        } = userData;

        requestData.location = location;
        requestData.placeCategory = placeCategory;
        requestData.defaultSchedule = defaultSchedule;
        requestData.placeActive = placeActive;
        requestData.placeType = placeType;
      }

      if (isUpdate) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/update-creator`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
      } else {
        const url =
          data.userType === "creator"
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/create-creator`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/users/create-organizer`;

        const response = await axios.post(url, requestData, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        const { place } = response.data.data;
        if (
          partnerships &&
          partnerships.length > 0 &&
          userData.userType === "organizer"
        ) {
          await createPartnerships(partnerships, place._id);
        }
      }

      showSuccess(
        isUpdate
          ? "Profil mis à jour avec succès !"
          : "Profil créé avec succès !"
      );
      router.push("/account");
    }).catch((err: unknown) => {
      console.error("API Error:", err);
      if (axios.isAxiosError(err) && err.response) {
        const responseData = err.response.data;
        if (responseData.error === "Validation error" && responseData.details) {
          const details = responseData.details;
          const errorMessages: string[] = [];
          Object.keys(details).forEach((field) => {
            if (Array.isArray(details[field])) {
              details[field].forEach((error: string) => {
                errorMessages.push(error);
              });
            }
          });
          if (errorMessages.length > 0) {
            errorMessages.forEach((message) => {
              showError(message);
            });
          } else {
            showError("Erreur de validation");
          }
        } else {
          const errorMessage =
            responseData.error ||
            responseData.message ||
            "Erreur lors de la soumission du profil";
          showError(errorMessage);
        }
      } else {
        showError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la soumission du profil"
        );
      }
    });
  };

  return { submitForm, isLoading };
};

export default useUpdateUser;
