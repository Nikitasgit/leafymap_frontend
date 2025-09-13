"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import CreatePlaceForm from "@/components/places/CreatePlaceForm";
import styles from "./createPlacePage.module.scss";

const CreatePlacePage = () => {
  const router = useRouter();
  return (
    <main className={styles.pageContainer}>
      <div className={styles.container}>
        <PageHeader
          title="Créer un lieu"
          showBackButton={true}
          onBackClick={() => router.back()}
          backButtonLabel="Retour au compte"
        />
        <CreatePlaceForm />
      </div>
    </main>
  );
};

export default CreatePlacePage;
