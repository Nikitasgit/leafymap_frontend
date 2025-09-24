"use client";

import Text from "@/components/common/typography/Text";
import styles from "./HomeHeader.module.scss";
import Image from "next/image";
import CeramistHands from "../../../../public/images/ceramist-hands.jpg";
import Button from "@/components/common/buttons/button/Button";
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
        <Text as="h1">Bienvenue sur SpotLight</Text>
        <Text as="h2" className={styles.subtitle}>
          Pour les amateurs de produits locaux, d&apos;artisanat et d&apos;art
        </Text>
      </div>
      <Image
        src={CeramistHands}
        alt="Home Header"
        className={styles.headerImage}
      />
      <div className={styles.HeaderCard}>
        <h3 className={styles.HeaderCardTitle}>
          Vous êtes créateur ou organisateur ?
        </h3>
        <p className={styles.HeaderCardDescription}>
          Rejoignez notre communauté de passionnés!
        </p>
        <Button
          variant="primary"
          size="small"
          onClick={() => {
            handleCreateProfile();
          }}
        >
          Créer mon profil
        </Button>
      </div>
    </header>
  );
};

export default HomeHeader;
