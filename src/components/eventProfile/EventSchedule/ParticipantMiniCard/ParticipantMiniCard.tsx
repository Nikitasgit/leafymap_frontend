import Image from "next/image";
import styles from "./ParticipantMiniCard.module.scss";
import creatorDefaultsSvg from "@public/images/creator_default.svg";
import { Image as ImageType } from "@/types/image";

interface ParticipantMiniCardProps {
  collaborator: {
    _id: string;
    name?: string;
    image?: string | ImageType;
  };
}

const ParticipantMiniCard: React.FC<ParticipantMiniCardProps> = ({
  collaborator,
}) => {
  const getImageUrl = (): string => {
    if (!collaborator.image) return creatorDefaultsSvg;
    if (typeof collaborator.image === "string") {
      return collaborator.image || creatorDefaultsSvg;
    }
    return collaborator.image.urls?.thumbnail || creatorDefaultsSvg;
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={getImageUrl()}
          alt={collaborator.name || "Participant"}
          width={32}
          height={32}
          className={styles.image}
          draggable={false}
        />
      </div>
      <p className={styles.name}>{collaborator.name || "Participant"}</p>
    </div>
  );
};

export default ParticipantMiniCard;
