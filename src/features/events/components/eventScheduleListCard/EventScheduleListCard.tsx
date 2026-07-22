"use client";

import { EventTimeSlot, Period } from "@/features/places/types/schedule";
import styles from "./EventScheduleListCard.module.scss";
import { Plus, Trash2 } from "lucide-react";
import Button from "@/shared/ui/buttons/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DatesSelector from "@/shared/ui/inputs/datesSelector";
import { parseDateStringToDate } from "@/shared/utils/dates";
import NewEventSlot from "../eventEditTimeSlot";
import EventSlotCard from "../eventSlotCard";
import type { Partnership } from "@/features/partnerships/types";
import EmptyState from "@/shared/ui/noResults/emptyState";

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
      onUpdatePeriod(period.id, startDate, endDate);
    }
  };
  const handleAddTimeSlot = (timeSlot: EventTimeSlot) => {
    setIsAddTimeSlot(false);
    onUpdateTimeSlot(period.id, timeSlot);
  };
  const handleUpdateTimeSlot = (timeSlot: EventTimeSlot) => {
    setTimeSlotToEdit(null);
    onUpdateTimeSlot(period.id, timeSlot);
  };
  const handleDeleteTimeSlot = (timeSlotId: string) => {
    onDeleteTimeSlot(period.id, timeSlotId);
  };
  return (
    <div key={period.id} className={styles.periodContainer}>
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
            onClick={() => onDeletePeriod(period.id)}
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
            timeSlotToEdit && timeSlotToEdit.id === slot.id ? (
              <NewEventSlot
                key={slot.id}
                partnerships={partnerships}
                onSubmit={handleUpdateTimeSlot}
                defaultSlot={slot}
                onCancel={() => setTimeSlotToEdit(null)}
              />
            ) : (
              <EventSlotCard
                key={slot.id}
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
