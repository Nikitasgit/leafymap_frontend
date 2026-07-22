import type { Partnership } from "../../types";
import styles from "./PartnershipsFormList.module.scss";
import { Delete } from "lucide-react";
import Image from "next/image";
import Button from "@/shared/ui/buttons/button";
import EventStatus from "@/features/events/components/eventStatus";
import EmptyState from "@/shared/ui/noResults/emptyState";
import creatorDefaultsSvg from "@public/images/creator_default.png";
import { useTranslation } from "react-i18next";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";

interface PartnershipsFormListProps {
  partnerships: Partnership[];
  onDelete: (partnership: Partnership) => void;
}

const PartnershipsFormList = ({
  partnerships,
  onDelete,
}: PartnershipsFormListProps) => {
  const { t } = useTranslation("account");
  const filteredPartnerships = partnerships.filter(
    (partnership) => !partnership.deleted,
  );

  return (
    <>
      {filteredPartnerships.length > 0 ? (
        <div className={styles.list}>
          {filteredPartnerships.map((partnership) => {
            const id = partnership.id;
            const collaborator = partnership.collaborator as Partnership["collaborator"] & {
              googlePictureUrl?: string;
            };
            const collaboratorImage = resolveRefObject(collaborator?.image);
            return (
              <div key={id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemInfoLeft}>
                    <Image
                      src={
                        collaboratorImage
                          ? collaboratorImage.urls?.thumbnail
                          : (typeof collaborator?.image === "string"
                              ? collaborator.image
                              : undefined) ||
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
        <EmptyState title={t("partnershipsFormList.emptyTitle")} />
      )}
    </>
  );
};

export default PartnershipsFormList;
