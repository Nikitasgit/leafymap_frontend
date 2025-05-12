"use client";

import { useState } from "react";
import UserTypeStep from "./steps/UserTypeStep";
import ActivityFormStep from "./steps/ActivityFormStep";

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface DaySchedule {
  open: boolean;
  timeSlots: TimeSlot[];
}

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type DefaultSchedule = Record<WeekDay, DaySchedule>;

export interface FormData {
  userType: string;
  name: string;
  description: string;
  type: string;
  address: string;
  defaultSchedule: DefaultSchedule;
}

export type FormDataChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => void;
export type onNextHandler = () => void;
export type onBackHandler = () => void;
const createEmptySchedule = (): DefaultSchedule => {
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
    type: "",
    address: "",
    defaultSchedule: createEmptySchedule(),
  });
  console.log(formData);

  const handleInputChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (updatedSchedule: DefaultSchedule) => {
    setFormData((prev) => ({ ...prev, defaultSchedule: updatedSchedule }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

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
          onNext={handleNext}
          onBack={handleBack}
          onScheduleChange={handleScheduleChange}
        />
      )}
    </div>
  );
};

export default CreateProfileStepper;
