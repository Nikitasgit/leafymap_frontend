import React from "react";
import { Place } from "@/types/place";
import Image from "next/image";
const PlaceCardMap = ({ place }: { place: Place }) => {
  console.log(place);

  return (
    <div>
      <Image
        src={place.image || ""}
        alt={place.name}
        width={100}
        height={100}
      />
      <h1>{place.name}</h1>
      <p>{place.description}</p>
    </div>
  );
};

export default PlaceCardMap;
