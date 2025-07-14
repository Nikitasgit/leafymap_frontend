import Button from "@/components/common/buttons/button/Button";
import { Place } from "@/types/place";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PlaceEditCard = ({ place }: { place: Place }) => {
  const router = useRouter();

  return (
    <div>
      <h3>{place.name}</h3>
      <p>{place.description}</p>
      {place.image && (
        <Image src={place.image} alt={place.name} width={100} height={100} />
      )}
      <Button onClick={() => router.push(`account/places/${place._id}`)}>
        Modifier
      </Button>
      <Button onClick={() => router.push(`account/places/${place._id}/events`)}>
        Voir les événements
      </Button>
      <Button
        onClick={() => router.push(`account/places/${place._id}/events/create`)}
      >
        Ajouter un événement
      </Button>
    </div>
  );
};

export default PlaceEditCard;
