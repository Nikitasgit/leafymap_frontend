"use client";
import React from "react";
import Button from "../Button";
import { ArrowLeft } from "lucide-react";
import styles from "./BackButton.module.scss";
import { useRouter } from "next/navigation";

const BackButton = ( { path}: { path?: string } ) => {
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
      ariaLabel="Retour"
    >
      Retour
    </Button>
  );
};

export default BackButton;
