"use client";

import { EventTimeSlot, Period } from "@/types/place/schedule";
import styles from "./EventScheduleListCard.module.scss";
import { Plus, Trash2 } from "lucide-react";
import Button from "@/components/common/buttons/Button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DatesSelector from "@/components/common/inputs/DatesSelector";
import { parseDateStringToDate } from "@/utils/dates";
import NewEventSlot from "@/components/account/Event/EventEditTimeSlot";
import EventSlotCard from "@/components/account/Event/EventSlotCard";
import { Partnership } from "@/types/partnerships";
import EmptyState from "@/components/common/noResults/EmptyState";

const EventScheduleListCard = ({
  period,
  partnerships,
  onDeletePeriod,
  onUpdatePeriod,
  onUpdateTimeSlot,
  onDeleteTimeSlot,
}: {
  period: Period;
  partnerships: Partnership[];
  onDeletePeriod: (periodId: string) => void;
  onUpdateTimeSlot: (periodId: string, timeSlot: EventTimeSlot) => void;
  onDeleteTimeSlot: (periodId: string, timeSlotId: string) => void;
  onUpdatePeriod: (
    periodId: string,
    startDate: Date,
    endDate: Date | null
  ) => void;
}) => {
  const { t } = useTranslation("events");
  const [isPeriod, setIsPeriod] = useState(!!period.endDate);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddTimeSlot, setIsAddTimeSlot] = useState(false);
  const [timeSlotToEdit, setTimeSlotToEdit] = useState<EventTimeSlot | null>(
    null
  );
  const [startDate, setStartDate] = useState(
    period.startDate ? parseDateStringToDate(period.startDate) : null
  );
  const [endDate, setEndDate] = useState(
    period.endDate ? parseDateStringToDate(period.endDate) : null
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
            <p className={styles.dateLabel}>
              {period.endDate !== period.startDate && period.endDate
                ? t("eventScheduleListCard.dateFrom")
                : t("eventScheduleListCard.dateOn")}
            </p>
            <p className={styles.dateValue}>{period.startDate}</p>
          </div>
          {period.endDate !== period.startDate && period.endDate !== "" && (
            <div className={styles.dateItem}>
              <p className={styles.dateLabel}>
                {t("eventScheduleListCard.dateTo")}
              </p>
              <p className={styles.dateValue}>{period.endDate}</p>
            </div>
          )}
        </div>
        <div className={styles.actionsContainer}>
          <Button
            type="button"
            onClick={() => setIsAddTimeSlot(true)}
            variant="secondary"
            size="small"
            ariaLabel={t("eventScheduleListCard.addSlotAriaLabel")}
            endIcon={<Plus size={14} />}
          >
            {t("eventScheduleListCard.addSlot")}
          </Button>
          <Button
            type="button"
            onClick={() => setIsEditMode(true)}
            variant="secondary"
            size="small"
            ariaLabel={t("eventScheduleListCard.editPeriodAriaLabel")}
          >
            {t("common:actions.edit")}
          </Button>
          <Button
            type="button"
            className={styles.deleteButton}
            onClick={() => onDeletePeriod(period._id)}
            variant="simple"
            size="small"
            ariaLabel={t("eventScheduleListCard.deletePeriodAriaLabel")}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      {isEditMode && (
        <div className={styles.datesSelectorContainer}>
          <DatesSelector
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
            ariaLabel={t("eventScheduleListCard.saveDatesAriaLabel")}
          >
            {t("common:actions.save")}
          </Button>
        </div>
      )}
      {isAddTimeSlot && (
        <NewEventSlot
          onCancel={() => setIsAddTimeSlot(false)}
          partnerships={partnerships}
          onSubmit={handleAddTimeSlot}
        />
      )}
      {period.timeSlots.length > 0 ? (
        <div className={styles.timeSlotsContainer}>
          {period.timeSlots.map((slot) =>
            timeSlotToEdit && timeSlotToEdit._id === slot._id ? (
              <NewEventSlot
                key={slot._id}
                partnerships={partnerships}
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
        <EmptyState title={t("eventScheduleListCard.emptyTitle")} />
      )}
    </div>
  );
};

export default EventScheduleListCard;
