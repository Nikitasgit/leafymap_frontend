"use client";

import styles from "./HomeHeader.module.scss";
import Image from "next/image";
import CeramistHands from "../../../../public/images/ceramist-hands.jpg";
import HomeHeaderCard from "../HomeHeaderCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const HomeHeader = () => {
  const { user, isLoading } = useCurrentUser();

  return (
    <header className={styles.header}>
      <div className={styles.headerFirstRow}>
        <h1 className={styles.title}>Bienvenue sur Spotlight</h1>
        <h2 className={styles.subtitle}>
          Pour les amateurs de produits locaux, d&apos;artisanat et d&apos;art
        </h2>
      </div>
      <HomeHeaderCard userType={user?.userType} loading={isLoading} />
      <Image
        src={CeramistHands}
        alt="Personne qui fait de la poterie"
        className={styles.headerImage}
        priority
      />
    </header>
  );
};

export default HomeHeader;
