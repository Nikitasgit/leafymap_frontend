"use client";

import { useState } from "react";
import UserTypeStep from "./steps/UserTypeStep";
import ActivityFormStep from "./steps/ActivityFormStep/ActivityFormStep";
import { WeekDay } from "@/components/common/forms/timetable/TimeTable.types";
import {
  DefaultSchedule,
  FormDataChangeHandler,
} from "./CreateProfileStepper.types";
import type { FormData } from "./CreateProfileStepper.types";
import useSubmitForm from "@/hooks/useSubmitForm";

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
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    userType: "",
    name: "",
    description: "",
    category: "",
    address: null,
    defaultSchedule: createEmptySchedule(),
    placeCategory: "",
    phone: "",
    email: "",
    website: "",
    collaborators: [],
    createdCollaborators: [],
    profilePicture: "",
  });

  const { submitForm, loading, error, success } = useSubmitForm();

  const handleSubmit = async () => {
    await submitForm(formData);
  };

  const handleInputChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  console.log(formData);

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
