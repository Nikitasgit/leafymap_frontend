"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/shared/ui/buttons/button";
import PlaceForm from "../placeForm";
import { useToast } from "@/shared/hooks/useToast";
import useSubmitPlace from "../../hooks/useSubmitPlace";
import { User } from "@/features/users/types";
import { placeFormSchema } from "../../validations/placeValidations";
import { defaultSchedule } from "@/features/account";
import {
  FormDataChangeHandler,
  InitialPlaceData,
} from "@/features/account";
import styles from "./PlaceFormContainer.module.scss";
import PageHeader from "@/shared/ui/pageHeader";
import { useAuth } from "@/features/auth";
import { usePlace } from "../../hooks/usePlace";
import { useCurrentUser } from "@/features/auth";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import { useValidatedForm } from "@/shared/hooks/useValidatedForm";
import { resolveRefId } from "@/shared/api/normalizers/resolveRef";
import { ZodSchema } from "zod";
import { useTranslation } from "react-i18next";
import { validationT } from "@/shared/utils/i18n/validationT";

const createInitialPlaceData = (
  user: Partial<User> | null,
): InitialPlaceData => ({
  name: "",
  description: "",
  location: null,
  defaultSchedule: defaultSchedule,
  placeCategory: "",
  phone: user?.phone || "",
  email: user?.email || "",
  website: user?.website || "",
  active: true,
});

const updateInitialPlaceData = (
  place: Pick<
    InitialPlaceData,
    | "name"
    | "description"
    | "location"
    | "defaultSchedule"
    | "placeCategory"
    | "phone"
    | "email"
    | "website"
  >,
): InitialPlaceData => ({
  name: place?.name || "",
  description: place?.description || "",
  location: place?.location || null,
  defaultSchedule: place?.defaultSchedule || defaultSchedule,
  placeCategory: resolveRefId(place?.placeCategory) ?? "",
  phone: place?.phone || "",
  email: place?.email || "",
  website: place?.website || "",
  active: true,
});

export interface PlaceFormContainerProps {
  mode: "create" | "update";
}

const PlaceFormContainer = ({ mode }: PlaceFormContainerProps) => {
  const router = useRouter();
  const params = useParams();
  const placeId = mode === "update" ? (params.placeId as string) : undefined;
  const { showError, showSuccess } = useToast();
  const { t } = useTranslation("account");
  const { user: authUser, loading: authUserLoading } = useAuth();
  const { user: currentUser, isLoading: currentUserLoading } = useCurrentUser();
  const { place: placeData, isLoading: placeLoading } = usePlace(
    mode === "update" ? (placeId ?? null) : null,
  );
  const { submitPlace, isLoading: submitPlaceLoading } = useSubmitPlace();

  const user = mode === "create" ? authUser : currentUser;
  const userLoading = mode === "create" ? authUserLoading : currentUserLoading;

  const schema = useMemo(
    () => placeFormSchema(validationT(t)) as unknown as ZodSchema<InitialPlaceData>,
    [t],
  );

  const {
    values: place,
    errors,
    setValues: setPlace,
    handleSubmit,
  } = useValidatedForm<InitialPlaceData>(
    schema,
    createInitialPlaceData(mode === "create" ? authUser : null),
  );

  useEffect(() => {
    if (mode === "create" && authUser) {
      setPlace(createInitialPlaceData(authUser));
    }
  }, [mode, authUser, setPlace]);

  useEffect(() => {
    if (mode === "update" && placeData) {
      setPlace(updateInitialPlaceData(placeData));
    }
  }, [mode, placeData, setPlace]);

  const onPlaceChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setPlace((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = handleSubmit(
    async (validPlace) => {
      try {
        if (mode === "create") {
          await submitPlace(validPlace as InitialPlaceData);
          showSuccess(t("placeFormContainer.createSuccess"));
        } else if (placeData) {
          await submitPlace(
            validPlace as InitialPlaceData,
            true,
            placeData.id,
          );
          showSuccess(t("placeFormContainer.updateSuccess"));
        }
        router.push("/account");
      } catch {
        showError(
          mode === "create"
            ? t("placeFormContainer.createError")
            : t("placeFormContainer.updateError"),
        );
      }
    },
    () => showError(t("placeFormContainer.validationError")),
  );

  const loading =
    userLoading ||
    submitPlaceLoading ||
    (mode === "update" && (placeLoading || !placeData));

  const pageTitle =
    mode === "create"
      ? t("placeFormContainer.createTitle")
      : t("placeFormContainer.updateTitle");

  return (
    <div className={styles.pageContainer}>
      <section className={styles.container}>
        <PageHeader title={pageTitle} showBackButton={true} />
        {loading || !user ? (
          <LoadingBar />
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <PlaceForm
              place={place as InitialPlaceData}
              initialPlaceLocation={
                mode === "update" ? place.location : null
              }
              username={user.username || ""}
              onChange={onPlaceChange}
              errors={errors}
            />
            <div className={styles.buttonContainer}>
              <Button
                type="button"
                fullWidth
                size="large"
                variant="secondary"
                onClick={() => router.back()}
                ariaLabel={t("common:actions.cancel")}
                disabled={submitPlaceLoading}
              >
                {t("common:actions.cancel")}
              </Button>
              <Button
                type="submit"
                fullWidth
                size="large"
                disabled={submitPlaceLoading}
                ariaLabel={t("common:actions.save")}
              >
                {t("common:actions.save")}
              </Button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

export default PlaceFormContainer;
