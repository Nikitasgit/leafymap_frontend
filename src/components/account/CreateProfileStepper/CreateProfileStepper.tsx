"use client";
import { useEffect, useState } from "react";
import ProfileFormStep from "../CreateProfileSteps/ProfileFormStep/ProfileFormStep";
import {
  FormDataChangeHandler,
  InitialCreatorData,
  InitialPlaceData,
} from "./CreateProfileStepper.types";
import { defaultSchedule } from "@/utils/createProfile";
import styles from "./CreateProfileStepper.module.scss";
import useSubmitUser from "@/hooks/useSubmitUser";
import useSubmitPlace from "@/hooks/useSubmitPlace";
import { useSubmitPartnerships } from "@/hooks/useSubmitPartnerships";
import { User } from "@/types/user";
import { Partnership } from "@/types/partnerships";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import PageHeader from "@/components/common/PageHeader";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const initialUserData = (user: Partial<User> | null): InitialCreatorData => ({
  userType: "creator",
  username: "",
  description: "",
  userCategories: [],
  website: user?.website || "",
  phone: user?.phone || "",
  firstname: user?.firstname || "",
  lastname: user?.lastname || "",
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
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const { submitUser } = useSubmitUser();
  const { submitPlace } = useSubmitPlace();
  const { submitPartnerships } = useSubmitPartnerships();

  const [place, setPlace] = useState<InitialPlaceData>(initialPlaceData(null));
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [newUser, setNewUser] = useState<InitialCreatorData>(
    initialUserData(null)
  );

  useEffect(() => {
    if (user && user.userType === "guest") {
      setNewUser(initialUserData(user));
      setPlace(initialPlaceData(user));
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      const user = await submitUser(newUser);

      if (place.active === true && user) {
        const placeResult = await submitPlace(place);
        const placeId =
          typeof placeResult === "string" ? placeResult : placeResult?._id;
        if (partnerships.length > 0 && placeId && typeof placeId === "string") {
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
  return (
    <ProtectedRoute
      allowedUserTypes={["guest"]}
      redirectTo="/account"
      fallback={<LoadingBar />}
    >
      <div className={styles.pageContainer}>
        <section className={styles.container}>
          <PageHeader title="Créer votre profil" showBackButton />

          <ProfileFormStep
            place={place}
            user={newUser}
            onPlaceChange={onPlaceChange}
            onUserChange={onUserChange}
            onPartnershipsChange={setPartnerships}
            partnerships={partnerships}
            onSubmit={handleSubmit}
            firstStep={true}
            showPlaceForm={true}
            showPlaceRadioYesOrNo={true}
          />
        </section>
      </div>
    </ProtectedRoute>
  );
};

export default CreateProfileStepper;
