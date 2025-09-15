"use client";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { usePlace } from "@/hooks/usePlace";
import { useParams } from "next/navigation";
import React from "react";

const PlacePage = () => {
  const { placeId } = useParams();
  const { isLoading: placeLoading } = usePlace(placeId as string);

  if (placeLoading) return <LoadingBar />;
  return (
    <div>
      <h1>Place Profile Picture</h1>
    </div>
  );
};

export default PlacePage;
