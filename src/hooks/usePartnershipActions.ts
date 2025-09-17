import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const usePartnershipActions = (onUpdate?: () => void) => {
  const { isLoading, withLoading } = useLoading();
  const { showError, showSuccess } = useToast();

  const updatePartnerships = async (
    partnershipUpdates: Array<{
      _id: string;
      status?: string;
      deleted?: boolean;
    }>
  ) => {
    try {
      await withLoading(() =>
        axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/partnerships/update`,
          { partnerships: partnershipUpdates },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
      );

      showSuccess("Partnerships updated successfully");
      onUpdate?.(); // Call the callback to refresh data
    } catch (error) {
      console.error("Error updating partnerships:", error);
      showError("Failed to update partnerships");
    }
  };

  const acceptPartnership = async (partnershipId: string) => {
    await updatePartnerships([{ _id: partnershipId, status: "accepted" }]);
  };

  const refusePartnership = async (partnershipId: string) => {
    await updatePartnerships([{ _id: partnershipId, status: "refused" }]);
  };

  return {
    isLoading,
    updatePartnerships,
    acceptPartnership,
    refusePartnership,
  };
};
