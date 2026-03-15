import { Partnership } from "@/types/partnerships";
import styles from "./PartnershipsFormList.module.scss";
import { Delete } from "lucide-react";
import Image from "next/image";
import Button from "@/components/common/buttons/Button";
import EventStatus from "@/components/common/events/EventStatus";
import EmptyState from "@/components/common/noResults/EmptyState";
import creatorDefaultsSvg from "@public/images/creator_default.png";

interface PartnershipsFormListProps {
  partnerships: Partnership[];
  onDelete: (partnership: Partnership) => void;
}

const PartnershipsFormList = ({
  partnerships,
  onDelete,
}: PartnershipsFormListProps) => {
  const filteredPartnerships = partnerships.filter(
    (partnership) => !partnership.deleted,
  );

  return (
    <>
      {filteredPartnerships.length > 0 ? (
        <div className={styles.list}>
          {filteredPartnerships.map((partnership) => {
            const id = partnership._id;
            const collaborator = partnership.collaborator as Partnership["collaborator"] & {
              googlePictureUrl?: string;
            };
            return (
              <div key={id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemInfoLeft}>
                    <Image
                      src={
                        typeof collaborator?.image === "object"
                          ? collaborator.image?.urls?.thumbnail
                          : collaborator?.image ||
                            collaborator?.googlePictureUrl ||
                            creatorDefaultsSvg
                      }
                      alt={collaborator.username || ""}
                      width={32}
                      height={32}
                      className={styles.itemImage}
                    />

                    <span className={styles.itemName}>
                      {partnership.collaborator.username}
                    </span>
                  </div>
                  <EventStatus status={partnership.status} />
                </div>

                <Button
                  onClick={() => onDelete(partnership)}
                  variant="simple"
                  size="small"
                >
                  <Delete size={16} />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="Aucun partenaire ajouté" />
      )}
    </>
  );
};

export default PartnershipsFormList;
