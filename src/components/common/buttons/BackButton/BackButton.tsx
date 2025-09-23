import React from "react";
import Button from "../button/Button";
import { ArrowLeft } from "lucide-react";
import styles from "./BackButton.module.scss";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="simple"
      onClick={() => router.back()}
      className={styles.backButton}
      startIcon={<ArrowLeft size={16} />}
    >
      Retour
    </Button>
  );
};

export default BackButton;
