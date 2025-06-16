"use client";
import { useRouter } from "next/navigation";
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
      <main>
        <div>
          <p>Loading...</p>
        </div>
      </main>
    );
  }
  if (!user && userError !== "") {
    return (
      <main>
        <p>{userError}</p>
      </main>
    );
  }
  const buttonParameters =
    userType === "creator"
      ? { route: "/account/update-creator", text: "Modifier mon profil" }
      : userType === "organizer"
      ? { route: "/account/places/create", text: "Ajouter un lieu" }
      : { route: "/account/create", text: "Ajouter mon activité" };

  if (!buttonParameters) {
    return <div>No button parameters</div>;
  }

  return (
    <main>
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
