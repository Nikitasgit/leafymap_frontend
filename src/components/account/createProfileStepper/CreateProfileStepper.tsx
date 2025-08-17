"use client";

import { useEffect, useState } from "react";
import UserTypeStep from "./steps/UserTypeStep/UserTypeStep";
import ActivityFormStep from "./steps/ActivityFormStep/ActivityFormStep";
import { FormDataChangeHandler } from "./CreateProfileStepper.types";
import type { BaseProfileFormData } from "./CreateProfileStepper.types";
import useUpdateUser from "@/hooks/useUpdateUser";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { defaultSchedule } from "@/utils/createProfile";
import styles from "./CreateProfileStepper.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { IUser } from "../../../../../innovastay-backend/types/models/user";

const initialFormData = (user: IUser | null): BaseProfileFormData => ({
  userType: "",
  name: "",
  description: "",
  category: "",
  location: null,
  defaultSchedule: defaultSchedule,
  phone: user?.phone || "",
  email: user?.email || "",
  website: user?.website || "",
  partnerships: [],
  placeCategory: "",
  placeActive: true,
  placeType: [],
});

const CreateProfileStepper = () => {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { submitForm, isLoading: submitLoading } = useUpdateUser();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BaseProfileFormData>(
    initialFormData(user as IUser | null)
  );

  const handleSubmit = async () => {
    await submitForm(formData, false);
  };

  const handleInputChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
        website: user.website || prev.website,
      }));
    }
  }, [user]);

  const loading = userLoading || submitLoading;
  return (
    <div className={styles.container}>
      {loading && <LoadingBar />}
      <div className={styles.stepperHeader}>
        <h1 className={styles.title}>Créer votre profil</h1>
        <span className={styles.stepText}>Étape {step} sur 2</span>
      </div>

      <div className={styles.stepContainer}>
        {step === 1 && (
          <UserTypeStep
            userType={formData.userType}
            onChange={handleInputChange}
            onNext={handleNext}
          />
        )}
        {step === 2 && (
          <ActivityFormStep
            firstStep={false}
            data={formData}
            isCreator={formData.userType === "creator"}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default CreateProfileStepper;
