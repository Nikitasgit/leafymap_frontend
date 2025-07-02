import CreateProfileStepper from "@/components/account/createProfileStepper/CreateProfileStepper";
import styles from "./page.module.scss";

const CreateProfilePage = () => {
  return (
    <div className={styles.pageContainer}>
      <CreateProfileStepper />
    </div>
  );
};
export default CreateProfilePage;
