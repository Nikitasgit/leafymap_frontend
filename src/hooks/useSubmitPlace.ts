import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Place } from "@/types/place";

const useSubmitPlace = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();

  const submitPlace = async (
    data: Partial<Place>,
    isUpdate: boolean = false,
    placeId?: string
  ) => {
    try {
      if (isUpdate && !placeId) {
        throw new Error("Place ID is required for update");
      }
      const method = isUpdate ? "put" : "post";
      const response = await withLoading(() =>
        axios[method](
          `${process.env.NEXT_PUBLIC_API_URL}/api/places/${
            isUpdate ? placeId : ""
          }`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
      );
      return response.data.data;
    } catch (err: unknown) {
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
    }
  };

  return { submitPlace, isLoading };
};

export default useSubmitPlace;
