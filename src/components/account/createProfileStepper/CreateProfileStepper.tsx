"use client";

import { useEffect, useState } from "react";
import UserTypeStep from "./steps/UserTypeStep/UserTypeStep";
import ActivityFormStep from "./steps/ActivityFormStep/ActivityFormStep";
import {
  FormDataChangeHandler,
  InitialCreatorData,
  InitialPlaceData,
} from "./CreateProfileStepper.types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { defaultSchedule } from "@/utils/createProfile";
import styles from "./CreateProfileStepper.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar";
import useSubmitUser from "@/hooks/useSubmitUser";
import useSubmitPlace from "@/hooks/useSubmitPlace";
import { useSubmitPartnerships } from "@/hooks/useSubmitPartnerships";
import { User } from "@/types/user";
import { Partnership } from "@/types/partnerships";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

const initialUserData = (user: Partial<User> | null): InitialCreatorData => ({
  userType: "guest",
  creatorName: "",
  description: "",
  creatorCategories: [],
  website: user?.website || "",
});

const initialPlaceData = (user: Partial<User> | null): InitialPlaceData => ({
  name: "",
  description: "",
  location: null,
  defaultSchedule: defaultSchedule,
  placeCategory: "",
  phone: user?.phone || "",
  email: user?.email || "",
  website: user?.website || "",
  placeType: [],
  active: true,
});

const CreateProfileStepper = () => {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { submitUser, isLoading: submitUserLoading } = useSubmitUser();
  const { submitPlace, isLoading: submitPlaceLoading } = useSubmitPlace();
  const { submitPartnerships, isLoading: submitPartnershipsLoading } =
    useSubmitPartnerships();
  const { showSuccess, showError } = useToast();
  const [step, setStep] = useState(1);
  const [place, setPlace] = useState<InitialPlaceData>(initialPlaceData(null));
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [newUser, setNewUser] = useState<InitialCreatorData>(
    initialUserData(null)
  );
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setNewUser(initialUserData(user));
      setPlace(initialPlaceData(user));
    }
  }, [user]);

  const loading =
    userLoading ||
    submitUserLoading ||
    submitPlaceLoading ||
    submitPartnershipsLoading;

  const handleSubmit = async () => {
    try {
      const user = await submitUser(newUser);
      if (place.active && user) {
        const placeId = await submitPlace(place);
        if (partnerships.length > 0 && placeId) {
          await submitPartnerships(partnerships, false, placeId);
        }
      }
      showSuccess("Profil créé avec succès");
      router.push("/account");
    } catch {
      showError("Erreur lors de la création du profil");
    }
  };

  const onUserChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const onPlaceChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setPlace((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep((prev) => prev + 1);

  const handleBack = () => {
    const prevStep = step;
    setStep((prev) => prev - 1);
    if (prevStep === 2) {
      setNewUser(initialUserData(user));
      setPlace(initialPlaceData(user));
      setPartnerships([]);
    }
  };

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
            loading={loading}
            userType={newUser.userType}
            onChange={onUserChange}
            onNext={handleNext}
          />
        )}
        {step === 2 && (
          <ActivityFormStep
            place={place}
            user={newUser}
            partnerships={partnerships}
            onPartnershipsChange={setPartnerships}
            onPlaceChange={onPlaceChange}
            onUserChange={onUserChange}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default CreateProfileStepper;
