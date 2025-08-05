import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Text from "@/components/common/typography/Text";
import { Calendar } from "lucide-react";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import styles from "./DateFilter.module.scss";

registerLocale("fr", fr);

interface DateFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
  isPeriod: boolean;
  setIsPeriod: (isPeriod: boolean) => void;
  title?: string;
}

const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onDateChange,
  isPeriod,
  setIsPeriod,
  title,
}) => {
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onDateChange(start, end);
  };

  const handleSingleDateChange = (date: Date | null) => {
    onDateChange(date, date);
  };

  const handleToggleClick = (e: React.MouseEvent, isPeriodValue: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPeriod(isPeriodValue);
  };

  const handleDatePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      className={styles.dateFilter}
      onClick={handleDatePickerClick}
      onKeyDown={handleKeyDown}
    >
      {title && (
        <div className={styles.header}>
          <Calendar size={16} />
          <Text className={styles.title}>{title}</Text>
        </div>
      )}

      <div className={styles.controls}>
        <div className={styles.periodToggle}>
          <button
            type="button"
            className={`${styles.toggleButton} ${
              !isPeriod ? styles.active : ""
            }`}
            onClick={(e) => handleToggleClick(e, false)}
            onKeyDown={handleKeyDown}
          >
            <Text>Un jour</Text>
          </button>
          <button
            type="button"
            className={`${styles.toggleButton} ${
              isPeriod ? styles.active : ""
            }`}
            onClick={(e) => handleToggleClick(e, true)}
            onKeyDown={handleKeyDown}
          >
            <Text>Période</Text>
          </button>
        </div>

        <div className={styles.datePickerContainer}>
          {isPeriod ? (
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              placeholderText="Sélectionner la période"
              locale="fr"
              className={styles.datePicker}
              isClearable
              onClickOutside={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <DatePicker
              selected={startDate}
              onChange={handleSingleDateChange}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              placeholderText="Sélectionner la date"
              locale="fr"
              className={styles.datePicker}
              isClearable
              onClickOutside={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DateFilter;
