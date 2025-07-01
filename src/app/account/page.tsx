"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import React from "react";
import PlacesEditList from "@/components/account/placesList/PlacesEditList";
import { Organizer } from "@/types/user";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useToast } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";

export default function AccountPage() {
  const { user, loading, error } = useUser();
  const { showError } = useToast();
  const { userType } = user || {};
  const organizer = user as Organizer;
  const router = useRouter();

  const buttonParameters =
    userType === "creator"
      ? { route: "/account/update-creator", text: "Modifier mon profil" }
      : userType === "organizer"
      ? { route: "/account/places/create", text: "Ajouter un lieu" }
      : { route: "/account/create", text: "Ajouter mon activité" };

  if (error) {
    showError(error);
  }

  return (
    <main>
      {loading && <LoadingBar />}
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
