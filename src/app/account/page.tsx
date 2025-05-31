"use client";
import { useRouter } from "next/navigation";
import styles from "../../styles/styles.scss";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import { selectUser } from "@/store/userSlice";
import { useSelector } from "react-redux";
import React from "react";
import PlacesEditList from "@/components/account/placesList/PlacesEditList";
import { Organizer } from "@/types/user";

export default function AccountPage() {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector(selectUser);
  const { userType } = user || {};
  const organizer = user as Organizer;
  const router = useRouter();

  if (userLoading) {
    return (
      <main className={styles.container}>
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </main>
    );
  }
  if (!user && userError !== "") {
    return (
      <main className={styles.container}>
        <p>{userError}</p>
      </main>
    );
  }
  const buttonParameters =
    userType === "creator"
      ? { route: "/account/update-creator", text: "Modifier mon profil" }
      : userType === "organizer"
      ? { route: "/places/create-place", text: "Ajouter un lieu" }
      : { route: "/account/create-profile", text: "Ajouter mon activité" };

  if (!buttonParameters) {
    return <div>No button parameters</div>;
  }

  return (
    <main className={styles.container}>
      <div>
        <h1>Account</h1>
        <div>
          <div>
            <h2>{user?.username}</h2>
            <p>{user?.email}</p>
          </div>
          {user?.image && (
            <Image src={user?.image} alt="Profile" width={80} height={80} />
          )}
        </div>
      </div>
      {userType && (
        <Button onClick={() => router.push(buttonParameters.route)}>
          {buttonParameters.text}
        </Button>
      )}
      {userType === "organizer" && organizer?.places && (
        <PlacesEditList places={organizer?.places} />
      )}
    </main>
  );
}
