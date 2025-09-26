"use client";

import PageHeader from "@/components/common/PageHeader";
import CreatePlaceForm from "@/components/places/CreatePlaceForm";
import styles from "./createPlacePage.module.scss";

const CreatePlacePage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <PageHeader title="Créer un lieu" showBackButton={true} />
        <CreatePlaceForm />
      </div>
    </div>
  );
};

export default CreatePlacePage;
