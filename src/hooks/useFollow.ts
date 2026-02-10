import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { useState, useCallback } from "react";

const useFollow = () => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const follow = async (followingId: string) => {
    try {
      const response = await withLoading(() =>
        axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/follows`,
          { followingId },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
      );
      showSuccess("Abonnement réussi");
      return response.data.data;
    } catch (err: unknown) {
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
          showError(err.response.data.message || "Erreur lors de l'abonnement");
        }
      } else {
        showError("Une erreur inattendue s'est produite");
      }
      throw err;
    }
  };

  const unfollow = async (followId: string) => {
    try {
      await withLoading(() =>
        axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/follows/${followId}`,
          {
            withCredentials: true,
          }
        )
      );
      showSuccess("Désabonnement réussi");
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        showError(err.response.data.message || "Erreur lors du désabonnement");
      } else {
        showError("Une erreur inattendue s'est produite");
      }
      throw err;
    }
  };

  return { follow, unfollow, isLoading };
};

export default useFollow;
