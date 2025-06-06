import React from "react";
import { Place } from "@/types/place";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
const PlaceCardMap = ({ place }: { place: Place }) => {
  return (
    <div>
      <Image
        src={place.image || ""}
        alt={place.name}
        width={100}
        height={100}
      />
      <div>
        <span>icon</span>
        <Button>Initinéraire</Button>
        <Button>Favoris</Button>
      </div>
      <div>
        <h1>{place.name}</h1>
        <span>{place.rating}</span>
      </div>
      <div>
        <span>icon</span>
        <Text>{place.location.label}</Text>
      </div>
      <div>
        <Text>{place.description}</Text>
      </div>
      <div>
        <Text>Horaires</Text>
        <span>todo</span>
      </div>
    </div>
  );
};

export default PlaceCardMap;
