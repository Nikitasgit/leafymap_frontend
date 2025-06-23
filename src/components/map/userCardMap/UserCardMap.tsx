import React, { useEffect } from "react";

import { Collaborator } from "@/types/place/collaborators";
import { useFindCreatorInPlaces } from "@/hooks/useFindCreatorInPlaces";

const UserCardMap = ({ user }: { user: Collaborator }) => {
  const { data: userPlaces, findCreatorInPlaces } = useFindCreatorInPlaces();

  useEffect(() => {
    findCreatorInPlaces(user._id);
  }, [user._id, findCreatorInPlaces]);
  console.log("userPlaces", userPlaces);
  return <div></div>;
};

export default UserCardMap;
