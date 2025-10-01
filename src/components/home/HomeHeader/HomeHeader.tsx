"use client";

import styles from "./HomeHeader.module.scss";
import Image from "next/image";
import CeramistHands from "../../../../public/images/ceramist-hands.jpg";
import Button from "@/components/common/buttons/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const HomeHeader = () => {
  const router = useRouter();
  const { user } = useAuth();
  const handleCreateProfile = () => {
    if (user?.userType === "guest") {
      router.push("/account/create");
    } else if (user?.userType === "organizer" || user?.userType === "creator") {
      router.push("/account");
    } else {
      router.push("/auth/register");
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.headerFirstRow}>
        <h1 className={styles.title}>Bienvenue sur Spotlight</h1>
        <h2 className={styles.subtitle}>
          Pour les amateurs de produits locaux, d&apos;artisanat et d&apos;art
        </h2>
      </div>
      <Image
        src={CeramistHands}
        alt="Personne qui fait de la poterie"
        className={styles.headerImage}
        priority
      />
      <div className={styles.HeaderCard}>
        <h3 className={styles.HeaderCardTitle}>
          Vous êtes créateur, artisan, producteur ou responsable d&apos;un lieu
          culturel/commercial?
        </h3>
        <p className={styles.HeaderCardDescription}>
          Rejoignez notre communauté de passionnés!
        </p>
        <Button
          ariaLabel="Créer mon profil"
          variant="primary"
          size="small"
          onClick={() => {
            handleCreateProfile();
          }}
        >
          {user ? "Créer mon profil" : "Créer mon compte"}
        </Button>
      </div>
    </header>
  );
};

export default HomeHeader;
