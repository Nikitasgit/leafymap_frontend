"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/features/auth";
import { getHeaderCtaKey, getHeaderRoute } from "../../utils/home";
import styles from "./HomeHeader.module.scss";

const HomeHeader = () => {
  const { t } = useTranslation("marketing");
  const { user, isLoading } = useCurrentUser();
  const ctaKey = getHeaderCtaKey(user?.userType);
  const route = getHeaderRoute(user?.userType);

  return (
    <header className={styles.header}>
      <div className={styles.headerFirstRow}>
        <h2 className={styles.subtitle}>{t("home.subtitle")}</h2>
      </div>

      <div className={styles.headerGrid}>
        <Link
          href={route}
          className={styles.cardLeft}
          aria-label={t(`home.cta.${ctaKey}.buttonTitle`)}
        >
          <div className={styles.cardLeftContent}>
            {!isLoading ? (
              <>
                <h3 className={styles.cardLeftTitle}>
                  {t(`home.cta.${ctaKey}.title`)}
                </h3>
                <p className={styles.cardLeftDescription}>
                  {t(`home.cta.${ctaKey}.description`)}
                </p>
                <span className={styles.cardLeftButton}>
                  {t(`home.cta.${ctaKey}.buttonTitle`)}
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
          aria-label={t("home.mapCardAriaLabel")}
        >
          <div className={styles.cardRightGradient} />
          <div className={styles.cardRightContent}>
            <h3 className={styles.cardRightTitle}>{t("home.mapCardTitle")}</h3>
            <p className={styles.cardRightSubtitle}>
              {t("home.mapCardSubtitle")}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default HomeHeader;
