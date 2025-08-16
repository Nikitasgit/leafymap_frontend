import Button from "@/components/common/buttons/button/Button";
import { Partnership } from "@/types/partnerships";
import { Collaborator } from "@/types/place/collaborators";
import React from "react";

const PartnershipsSelect = ({
  partnerships,
  selectedPartnerships,
  onClick,
}: {
  partnerships: Partnership[];
  selectedPartnerships: Collaborator[];
  onClick: (partnership: Partnership) => void;
}) => {
  return (
    <ul>
      {partnerships.map((partnership) => (
        <li key={partnership._id}>
          <Button
            variant={
              selectedPartnerships.some(
                (p) => p._id === partnership.collaborator._id
              )
                ? "primary"
                : "secondary"
            }
            onClick={() => onClick(partnership)}
          >
            {partnership.collaborator.name}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default PartnershipsSelect;
