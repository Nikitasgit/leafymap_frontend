"use client";
import { useRouter } from "next/navigation";
import styles from "../../styles/styles.scss";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import { selectUser } from "@/store/userSlice";
import { useSelector } from "react-redux";
import React from "react";
import SignOutButton from "@/components/common/buttons/button/SignOutButton";

export default function AccountPage() {
  const { user, loading: userLoading } = useSelector(selectUser);
  const { userType } = user || {};
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
  if (!user) {
    return (
      <main className={styles.container}>
        <p>User not found</p>
      </main>
    );
  }
  const buttonParameters =
    userType === "creator"
      ? { route: "/modifyProfile", text: "Modifier mon profil" }
      : userType === "organizer"
      ? { route: "/addPlace", text: "Ajouter un lieu" }
      : { route: "/createProfile", text: "Ajouter mon activité" };
  return (
    <main className={styles.container}>
      <div>
        <h1>Account</h1>

        <Button onClick={() => router.push(buttonParameters.route)}>
          {buttonParameters.text}
        </Button>
        <div>
          <div>
            <div>
              <div>
                {user?.image && (
                  <Image
                    src={user?.image}
                    alt="Profile"
                    width={80}
                    height={80}
                  />
                )}
              </div>
              <div>
                <h2>{user?.username}</h2>
                <p>{user?.email}</p>
              </div>
            </div>
            <div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
