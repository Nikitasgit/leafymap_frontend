"use client";

import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const useDeleteAccount = () => {
  const { isLoading: isLoadingDeleteAccount, withLoading } = useLoading(false);
  const { showSuccess, showError } = useToast();
  const isLoading = isLoadingDeleteAccount;
  const deleteAccount = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        withCredentials: true,
      });
      showSuccess("Compte supprimé avec succès");
      window.location.reload();
    } catch (err: unknown) {
      console.error("Error deleting account:", err);
      let errorMessage = "Erreur lors de la suppression du compte";

      if (err && typeof err === "object") {
        if (
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "data" in err.response
        ) {
          const responseData = err.response.data as { message?: string };
          if (responseData?.message) {
            errorMessage = responseData.message;
          }
        } else if ("message" in err && typeof err.message === "string") {
          errorMessage = err.message;
        }
      }

      showError(errorMessage);
    } finally {
    }
  };

  const deleteAccountWithConfirmation = async () => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera toutes vos données."
    );

    if (confirmed) {
      const doubleConfirmed = window.confirm(
        "Cette action est définitive. Toutes vos données (lieux, événements, partenariats) seront supprimées. Confirmez-vous la suppression ?"
      );
      if (doubleConfirmed) {
        await withLoading(deleteAccount);
      }
    }
  };

  return {
    deleteAccount: deleteAccountWithConfirmation,
    isLoading,
  };
};
