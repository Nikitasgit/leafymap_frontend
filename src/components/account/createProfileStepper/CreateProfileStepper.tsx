"use client";

import { useEffect, useState } from "react";
import UserTypeStep from "./steps/UserTypeStep/UserTypeStep";
import ActivityFormStep from "./steps/ActivityFormStep/ActivityFormStep";
import { FormDataChangeHandler } from "./CreateProfileStepper.types";
import type { NewProfileFormData } from "./CreateProfileStepper.types";
import useSubmitForm from "@/hooks/useUpdateUser";
import { useUser } from "@/hooks/useUser";
import { defaultSchedule } from "@/utils/createProfile";

const CreateProfileStepper = () => {
  const { user } = useUser();
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
  });

  const { submitForm } = useSubmitForm();

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

  return (
    <div>
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
  );
};

export default CreateProfileStepper;
