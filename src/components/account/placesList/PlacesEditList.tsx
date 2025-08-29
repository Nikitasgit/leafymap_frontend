import { Place } from "@/types/place";
import PlaceEditCard from "./PlaceEditCard";
import TitleWithLine from "@/components/common/typography/titleWithLine";
import styles from "./PlacesEditList.module.scss";

const PlacesEditList = ({ places }: { places: Place[] }) => {
  return (
    <div className={styles.container}>
      <TitleWithLine as="h2" className={styles.titleContainer}>
        {places.length > 1 ? "Vos lieux" : "Votre lieu"}
      </TitleWithLine>
      <div className={styles.placesGrid}>
        {places.map((place) => (
          <section key={place._id}>
            <PlaceEditCard place={place} />
          </section>
        ))}
      </div>
    </div>
  );
};

export default PlacesEditList;
