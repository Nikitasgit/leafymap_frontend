import React from "react";
import styles from "./ParticipantsList.module.scss";
import TitleWithLine from "@/components/common/typography/titleWithLine";
import { PartnershipPopulated } from "@/types/partnerships";
import Text from "@/components/common/typography/Text";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const ParticipantsList = ({
  partnerships,
}: {
  partnerships: PartnershipPopulated[];
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  return (
    <div className={styles.participantsList}>
      <TitleWithLine as="h3" className={styles.participantsTitle}>
        Participants
      </TitleWithLine>
      <div className={styles.participantsList}>
        {partnerships.map((partnership) => (
          <div
            key={partnership._id}
            className={styles.participant}
            onClick={() =>
              router.push(`/users/${partnership.collaborator._id}`)
            }
          >
            <Image
              src={
                partnership.collaborator.image?.urls?.thumbnail ||
                "https://i.pravatar.cc/40?img=3"
              }
              alt={partnership.collaborator.name || "Participant"}
              width={42}
              height={42}
              className={styles.participantImage}
            />
            <div className={styles.participantInfo}>
              <Text as="p" className={styles.participantName}>
                {partnership.collaborator.name}
              </Text>
              <Text as="p" className={styles.participantCategory}>
                {t(
                  `creatorCategories.${partnership.collaborator.categories[0]?.name}`
                )}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList;
