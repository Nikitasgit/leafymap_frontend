import { Place } from "@/types/place";
import AccountPlaceCard from "../AccountPlaceCard/AccountPlaceCard";
import TitleWithLine from "@/components/common/typography/TitleWithLine";
import styles from "./AccountPlacesList.module.scss";

const AccountPlacesList = ({ places }: { places: Place[] }) => {
  return (
    <div className={styles.container}>
      <TitleWithLine>
        {places.length > 1 ? "Vos lieux" : "Votre lieu"}
      </TitleWithLine>
      <div className={styles.placesGrid}>
        {places.map((place) => (
          <section key={place._id}>
            <AccountPlaceCard place={place} />
          </section>
        ))}
      </div>
    </div>
  );
};

export default AccountPlacesList;
