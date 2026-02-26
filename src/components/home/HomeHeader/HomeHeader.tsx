"use client";

import Image from "next/image";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getHeaderParameters } from "@/utils/home";
import styles from "./HomeHeader.module.scss";

const HomeHeader = () => {
  const { user, isLoading } = useCurrentUser();
  const headerParameters = getHeaderParameters(user?.userType);

  return (
    <header className={styles.header}>
      <div className={styles.headerFirstRow}>
        <h2 className={styles.subtitle}>
          Pour les amateurs de produits locaux, d&apos;artisanat et d&apos;art
        </h2>
      </div>

      <div className={styles.headerGrid}>
        <Link
          href={headerParameters.route}
          className={styles.cardLeft}
          aria-label={headerParameters.buttonTitle}
        >
          <div className={styles.cardLeftContent}>
            {!isLoading ? (
              <>
                <h3 className={styles.cardLeftTitle}>
                  {headerParameters.title}
                </h3>
                <p className={styles.cardLeftDescription}>
                  {headerParameters.description}
                </p>
                <span className={styles.cardLeftButton}>
                  {headerParameters.buttonTitle}
                </span>
              </>
            ) : (
              <div className={styles.cardLeftSkeleton} aria-hidden="true" />
            )}
          </div>
          <div className={styles.cardLeftImage}>
            <Image
              src="/images/atelier.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className={styles.cardLeftImg}
              priority
            />
          </div>
        </Link>

        <Link
          href="/map"
          className={styles.cardRight}
          aria-label="Explorer la carte des producteurs"
        >
          <div className={styles.cardRightGradient} />
          <div className={styles.cardRightContent}>
            <h3 className={styles.cardRightTitle}>
              Trouvez les producteurs près de chez vous !
            </h3>
            <p className={styles.cardRightSubtitle}>Explorer la carte</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default HomeHeader;
