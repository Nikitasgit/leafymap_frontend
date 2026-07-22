"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { confirmTwice } from "@/shared/utils/confirmTwice";
import { useAppDispatch } from "@/store";
import { signOut } from "@/features/auth";
import { accountApi } from "../api/accountApi";

export const useDeleteAccount = () => {
  const { t } = useTranslation("account");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { mutate: deleteAccount, isLoading } = useApiMutation(
    async () => {
      await accountApi.deleteUser();
      await dispatch(signOut()).unwrap();
      router.push("/");
      return true as const;
    },
    { successMessage: t("useDeleteAccount.success") },
  );

  const deleteAccountWithConfirmation = async () => {
    if (
      !confirmTwice({
        first: t("useDeleteAccount.confirmFirst"),
        second: t("useDeleteAccount.confirmSecond"),
      })
    ) {
      return;
    }
    return deleteAccount();
  };

  return {
    deleteAccount: deleteAccountWithConfirmation,
    isLoading,
  };
};
