"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import { ArrowLeft } from "lucide-react";
import styles from "./BackButton.module.scss";
import { useRouter } from "next/navigation";

const BackButton = ( { path}: { path?: string } ) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const handleBack = () => {
    if (path) {
      router.push(path);
      return;
    }

    router.back();
  };

  return (
    <Button
      variant="simple"
      onClick={handleBack}
      className={styles.backButton}
      startIcon={<ArrowLeft size={16} />}
      ariaLabel={t("actions.back")}
    >
      {t("actions.back")}
    </Button>
  );
};

export default BackButton;
