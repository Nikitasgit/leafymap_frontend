import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { formatDate } from "@/shared/utils/formatDate";
import styles from "./DisplayPublishingDate.module.scss";

interface DisplayPublishingDateProps {
  date: Date | string;
  className?: string;
}

const DisplayPublishingDate: React.FC<DisplayPublishingDateProps> = ({
  date,
  className,
}) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (!dateObj || isNaN(dateObj.getTime())) {
    return (
      <span className={`${styles.date} ${className || ""}`}>
        Date inconnue
      </span>
    );
  }

  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
  );

  const displayText =
    diffInDays >= 0 && diffInDays < 7
      ? formatDistanceToNow(dateObj, {
          addSuffix: true,
          locale: fr,
        })
      : formatDate(dateObj);

  return (
    <span className={`${styles.date} ${className || ""}`}>{displayText}</span>
  );
};

export default DisplayPublishingDate;
