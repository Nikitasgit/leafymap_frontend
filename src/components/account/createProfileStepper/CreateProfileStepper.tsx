"use client";

import { useEffect, useState } from "react";
import UserTypeStep from "./steps/UserTypeStep/UserTypeStep";
import ActivityFormStep from "./steps/ActivityFormStep/ActivityFormStep";
import { FormDataChangeHandler } from "./CreateProfileStepper.types";
import type { NewProfileFormData } from "./CreateProfileStepper.types";
import useSubmitForm from "@/hooks/useUpdateUser";
import { useUser } from "@/hooks/useUser";
import { defaultSchedule } from "@/utils/createProfile";
import styles from "./CreateProfileStepper.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useToast } from "@/hooks/useToast";

const CreateProfileStepper = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const { showError } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<NewProfileFormData>({
    userType: "",
    name: "",
    description: "",
    category: "",
    location: null,
    defaultSchedule: defaultSchedule,
    phone: user?.phone || "",
    email: user?.email || "",
    website: user?.website || "",
    collaborators: [],
    createdCollaborators: [],
    image: user?.image || "",
    placeCategory: "",
    placeActive: true,
    placeType: [],
  });

  const { submitForm, loading: submitLoading } = useSubmitForm();

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
        image: user.image || prev.image,
      }));
    }
  }, [user]);

  if (userError) {
    showError(userError);
  }
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
