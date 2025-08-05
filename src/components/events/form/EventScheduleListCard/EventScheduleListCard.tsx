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

const EventScheduleListCard = ({
  period,
  onDeletePeriod,
  onUpdatePeriod,
  collaborators,
  onUpdateTimeSlot,
}: {
  period: Period;
  onDeletePeriod: (periodId: string) => void;
  onUpdatePeriod: (
    periodId: string,
    startDate: Date,
    endDate: Date | null
  ) => void;
  collaborators: Collaborator[];
  onUpdateTimeSlot: (periodId: string, timeSlot: EventTimeSlot) => void;
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
          collaborators={collaborators}
          period={period}
          onSubmit={handleAddTimeSlot}
        />
      )}
      {period.timeSlots.length > 0 ? (
        <div className={styles.timeSlotsContainer}>
          {period.timeSlots.map((slot, slotIndex) =>
            timeSlotToEdit ? (
              <NewSlot
                key={slotIndex}
                collaborators={collaborators}
                period={period}
                onSubmit={handleUpdateTimeSlot}
                defaultSlot={slot}
              />
            ) : (
              <div key={slotIndex} className={styles.timeSlotItem}>
                <div className={styles.timeSlotInfo}>
                  <Text className={styles.timeSlotTitle}>{slot.title}</Text>
                  <div className={styles.timeSlotTime}>
                    <Text className={styles.timeRange}>
                      {slot.startTime} - {slot.endTime}
                    </Text>
                  </div>
                </div>

                <div className={styles.participantsContainer}>
                  <Text className={styles.participantsLabel}>Participants</Text>
                  <Text className={styles.participantsList}>
                    {slot.participants.length > 0
                      ? slot.participants
                          .map((participant) => participant.name)
                          .join(", ")
                      : "Aucun participant"}
                  </Text>
                </div>
                <div className={styles.actionsContainer}>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => setTimeSlotToEdit(slot)}
                    title="Modifier le créneau"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Supprimer le créneau"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
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
