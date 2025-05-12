"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "../../styles/styles.scss";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className={styles.container}>
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div>
        <h1>Account</h1>
        <Button onClick={() => router.push("/createProfile")}>
          Ajouter mon activité
        </Button>
        <div>
          <div>
            <div>
              <div>
                {session?.user?.image && (
                  <Image
                    src={session.user?.image}
                    alt="Profile"
                    width={80}
                    height={80}
                  />
                )}
              </div>
              <div>
                <h2>{session?.user?.name}</h2>
                <p>{session?.user?.email}</p>
              </div>
            </div>
            <div>
              <Button onClick={() => router.push("/api/auth/signout")}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
