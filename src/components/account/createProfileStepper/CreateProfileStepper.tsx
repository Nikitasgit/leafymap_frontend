"use client";

import { useEffect, useState } from "react";
import UserTypeStep from "./steps/UserTypeStep";
import ActivityFormStep from "./steps/ActivityFormStep/ActivityFormStep";
import { WeekDay } from "@/components/common/forms/timetable/TimeTable.types";
import {
  DefaultSchedule,
  FormDataChangeHandler,
} from "./CreateProfileStepper.types";
import type { FormData } from "./CreateProfileStepper.types";
import useSubmitForm from "@/hooks/useUpdateUser";
import { useUser } from "@/hooks/useUser";

export type onNextHandler = () => void;
export type onBackHandler = () => void;
export const createEmptySchedule = (): DefaultSchedule => {
  const days: WeekDay[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  return days.reduce((acc, day) => {
    acc[day] = { open: false, timeSlots: [] };
    return acc;
  }, {} as DefaultSchedule);
};

const CreateProfileStepper = () => {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    userType: "",
    name: "",
    description: "",
    category: "",
    location: null,
    defaultSchedule: createEmptySchedule(),
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
          data={formData}
          onChange={handleInputChange}
          onNext={handleNext}
        />
      )}
      {step === 2 && (
        <ActivityFormStep
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
