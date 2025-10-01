import Button from "@/components/common/buttons/Buttontempname";
import { Partnership } from "@/types/partnerships";
import { Collaborator } from "@/types/place/collaborators";
import styles from "./EventPartnershipsSelect.module.scss";
import EventStatus from "@/components/common/eventStatus";

const EventPartnershipsSelect = ({
  partnerships,
  selectedPartnerships,
  onClick,
}: {
  partnerships: Partnership[];
  selectedPartnerships: Collaborator[];
  onClick: (partnership: Partnership) => void;
}) => {
  return (
    <div className={styles.partnershipsSelectContainer}>
      <h4 className={styles.title}>Participants sur ce créneau:</h4>
      <ul className={styles.partnershipsSelect}>
        {partnerships.map((partnership) => (
          <li key={partnership._id}>
            <Button
              className={styles.partnershipButton}
              variant={
                selectedPartnerships.some(
                  (p) => p._id === partnership.collaborator._id
                )
                  ? "outline"
                  : "secondary"
              }
              onClick={() => onClick(partnership)}
              ariaLabel={`Ajouter ${partnership.collaborator.name} à ce créneau`}
            >
              {partnership.collaborator.name}{" "}
              <EventStatus status={partnership.status} />
            </Button>
          </li>
        ))}
      </ul>
      <p className={styles.emptyMessage}>
        {partnerships.length === 0
          ? "Pour ajouter des participants à ce créneau, vous devez d'abord les ajouter à la liste des participants de l'évènement."
          : selectedPartnerships.length === 0
          ? "Aucun participant n'a été ajouté à ce créneau."
          : `${selectedPartnerships.length} participant${
              selectedPartnerships.length > 1 ? "s" : ""
            } ajouté${
              selectedPartnerships.length > 1 ? "s" : ""
            } à ce créneau.`}
      </p>
    </div>
  );
};

export default EventPartnershipsSelect;
