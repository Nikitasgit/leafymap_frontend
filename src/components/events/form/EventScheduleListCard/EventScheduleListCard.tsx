import { EventTimeSlot, Period } from "@/types/place/schedule";

import styles from "./EventScheduleListCard.module.scss";
import Text from "@/components/common/typography/Text";
import { Edit, Trash2 } from "lucide-react";
import Button from "@/components/common/buttons/button/Button";
import { useState } from "react";
import DateFilter from "@/components/map/filtersCardMap/dateFilter/DateFilter";
import { parseDateToUTC } from "@/utils/dates";
import NewSlot from "@/components/common/timetable/NewSlot";
import { Collaborator } from "@/types/place/collaborators";
import EventSlotCard from "../EventSlotCard/EventSlotCard";

const EventScheduleListCard = ({
  period,
  collaborators,
  onDeletePeriod,
  onUpdatePeriod,
  onUpdateTimeSlot,
  onDeleteTimeSlot,
}: {
  period: Period;
  collaborators: Collaborator[];
  onDeletePeriod: (periodId: string) => void;
  onUpdateTimeSlot: (periodId: string, timeSlot: EventTimeSlot) => void;
  onDeleteTimeSlot: (periodId: string, timeSlotId: string) => void;
  onUpdatePeriod: (
    periodId: string,
    startDate: Date,
    endDate: Date | null
  ) => void;
}) => {
  const [isPeriod, setIsPeriod] = useState(!!period.endDate);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddTimeSlot, setIsAddTimeSlot] = useState(false);
  const [timeSlotToEdit, setTimeSlotToEdit] = useState<EventTimeSlot | null>(
    null
  );
  const [startDate, setStartDate] = useState(
    period.startDate ? parseDateToUTC(period.startDate) : null
  );
  const [endDate, setEndDate] = useState(
    period.endDate ? parseDateToUTC(period.endDate) : null
  );
  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };
  const handleSaveDates = () => {
    setIsEditMode(false);
    if (startDate) {
      onUpdatePeriod(period._id, startDate, endDate);
    }
  };
  const handleAddTimeSlot = (timeSlot: EventTimeSlot) => {
    setIsAddTimeSlot(false);
    onUpdateTimeSlot(period._id, timeSlot);
  };
  const handleUpdateTimeSlot = (timeSlot: EventTimeSlot) => {
    setTimeSlotToEdit(null);
    onUpdateTimeSlot(period._id, timeSlot);
  };
  const handleDeleteTimeSlot = (timeSlotId: string) => {
    onDeleteTimeSlot(period._id, timeSlotId);
  };
  return (
    <div key={period._id} className={styles.periodContainer}>
      <div className={styles.periodHeader}>
        <div className={styles.periodDates}>
          <div className={styles.dateItem}>
            <Text className={styles.dateLabel}>
              {period.endDate ? "Du" : "Le"}
            </Text>
            <Text className={styles.dateValue}>{period.startDate}</Text>
          </div>
          {period.endDate && (
            <div className={styles.dateItem}>
              <Text className={styles.dateLabel}>Au</Text>
              <Text className={styles.dateValue}>{period.endDate}</Text>
            </div>
          )}
        </div>
        <div className={styles.actionsContainer}>
          <Button
            type="button"
            className={`${styles.actionButton} ${styles.editButton}`}
            onClick={() => setIsAddTimeSlot(true)}
            variant="secondary"
            size="small"
          >
            Ajouter un créneau
          </Button>
          <Button
            type="button"
            className={`${styles.actionButton} ${styles.editButton}`}
            onClick={() => setIsEditMode(true)}
            variant="simple"
            size="small"
          >
            <Edit size={14} />
          </Button>
          <Button
            type="button"
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={() => onDeletePeriod(period._id)}
            variant="simple"
            size="small"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      {isEditMode && (
        <>
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
            isPeriod={isPeriod}
            setIsPeriod={setIsPeriod}
          />
          <Button
            variant="primary"
            onClick={handleSaveDates}
            size="small"
            fullWidth
          >
            Enregistrer
          </Button>
        </>
      )}
      {isAddTimeSlot && (
        <NewSlot
          onCancel={() => setIsAddTimeSlot(false)}
          collaborators={collaborators}
          onSubmit={handleAddTimeSlot}
        />
      )}
      {period.timeSlots.length > 0 ? (
        <div className={styles.timeSlotsContainer}>
          {period.timeSlots.map((slot) =>
            timeSlotToEdit && timeSlotToEdit._id === slot._id ? (
              <NewSlot
                key={slot._id}
                collaborators={collaborators}
                onSubmit={handleUpdateTimeSlot}
                defaultSlot={slot}
                onCancel={() => setTimeSlotToEdit(null)}
              />
            ) : (
              <EventSlotCard
                key={slot._id}
                slot={slot}
                setTimeSlotToEdit={setTimeSlotToEdit}
                onDeleteTimeSlot={handleDeleteTimeSlot}
              />
            )
          )}
        </div>
      ) : (
        <div className={styles.timeSlotsContainer}>
          <div className={styles.emptyState}>
            <Text>Aucun créneau</Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventScheduleListCard;
