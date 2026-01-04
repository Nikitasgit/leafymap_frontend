import Image from "next/image";
import styles from "./PlaceInitiatorPartnerships.module.scss";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import { Partnership } from "@/types/partnerships";
import { useRef, useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import placeDefaultSvg from "@public/images/place_default.svg";
import { capitalizeFirstLetter } from "@/utils/functions";

export interface PlaceInitiatorPartnershipsProps {
  placeId: string;
  username: string;
}

const PlaceInitiatorPartnerships = ({
  placeId,
  username,
}: PlaceInitiatorPartnershipsProps) => {
  const { partnerships } = usePlacePartnerships(placeId, undefined, "place", {
    onlyAccepted: "true",
  });

  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>
        <b>{capitalizeFirstLetter(username)}</b> collabore avec :
      </h3>
      <div
        ref={scrollContainerRef}
        className={styles.scrollContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {partnerships.map((partnership: Partnership) => {
          const collaborator =
            typeof partnership.collaborator === "object"
              ? partnership.collaborator
              : null;

          if (!collaborator) return null;

          const collaboratorName =
            ("username" in collaborator &&
              typeof collaborator.username === "string" &&
              collaborator.username) ||
            collaborator.name ||
            "";

          return (
            <div
              key={partnership._id}
              className={styles.card}
              onClick={() => {
                if (!isDragging) {
                  router.push(`/users/${collaborator._id}`);
                }
              }}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={
                    typeof collaborator.image === "object"
                      ? collaborator.image?.urls?.thumbnail || placeDefaultSvg
                      : placeDefaultSvg
                  }
                  alt={collaboratorName || "Collaborateur"}
                  width={50}
                  height={50}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <p className={styles.username}>
                {capitalizeFirstLetter(collaboratorName)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PlaceInitiatorPartnerships;
