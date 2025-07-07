import axios from "axios";
import { NewProfileFormData } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { fetchUser } from "@/store/userSlice";
import { useAppDispatch } from "@/store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useLoading } from "@/hooks/useLoading";

type UseCreateProfileReturn = {
  submitForm: (data: NewProfileFormData, isUpdate: boolean) => Promise<void>;
  isLoading: boolean;
};

const useUpdateUser = (): UseCreateProfileReturn => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { isLoading, withLoading } = useLoading();

  const submitForm = async (data: NewProfileFormData, isUpdate: boolean) => {
    return withLoading(async () => {
      const { userType, name, description, phone, email, website, category } =
        data;
      const requestData: NewProfileFormData = {
        userType,
        name,
        description,
        phone,
        email,
        website,
        category,
      };

      if (
        (data.placeActive && data.userType === "creator") ||
        data.userType === "organizer"
      ) {
        const {
          location,
          placeCategory,
          defaultSchedule,
          placeActive,
          placeType,
        } = data;
        requestData.location = location;
        requestData.placeCategory = placeCategory;
        requestData.defaultSchedule = defaultSchedule;
        requestData.placeActive = placeActive;

        if (data.userType === "organizer") {
          const { collaborators, createdCollaborators } = data;
          if (collaborators) {
            requestData.collaborators = collaborators.map((collaborator) => ({
              _id: collaborator._id,
            }));
          }
          if (createdCollaborators) {
            const cleanedCollaborators = createdCollaborators.map(
              (collaborator) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, ...collaboratorWithoutId } = collaborator;
                return collaboratorWithoutId;
              }
            );
            requestData.createdCollaborators = cleanedCollaborators;
          }
          requestData.placeType = placeType || [];
        }
      }
      console.log("requestData", requestData);
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

        await axios.post(url, requestData, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
      }

      showSuccess(
        isUpdate
          ? "Profil mis à jour avec succès !"
          : "Profil créé avec succès !"
      );
      router.push("/account");
      dispatch(fetchUser());
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
