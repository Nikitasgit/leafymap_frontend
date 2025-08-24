import { Place } from "@/types/place";
import PlaceEditCard from "./PlaceEditCard";

const PlacesEditList = ({ places }: { places: Place[] }) => {
  return (
    <>
      {places.map((place) => (
        <section key={place._id}>
          <PlaceEditCard place={place} />
        </section>
      ))}
    </>
  );
};

export default PlacesEditList;
