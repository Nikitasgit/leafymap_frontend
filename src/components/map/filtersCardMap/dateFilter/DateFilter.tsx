import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Text from "@/components/common/typography/Text";
import { Calendar } from "lucide-react";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import styles from "./DateFilter.module.scss";
import { useTranslation } from "react-i18next";

registerLocale("fr", fr);

interface DateFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onDateChange,
}) => {
  const [isPeriod, setIsPeriod] = useState(false);
  const { t } = useTranslation("common");
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onDateChange(start, end);
  };

  const handleSingleDateChange = (date: Date | null) => {
    onDateChange(date, date);
  };

  return (
    <div className={styles.dateFilter}>
      <div className={styles.header}>
        <Calendar size={16} />
        <Text className={styles.title}>{t("dates")}</Text>
      </div>

      <div className={styles.controls}>
        <div className={styles.periodToggle}>
          <button
            className={`${styles.toggleButton} ${
              !isPeriod ? styles.active : ""
            }`}
            onClick={() => setIsPeriod(false)}
          >
            <Text>Un jour</Text>
          </button>
          <button
            className={`${styles.toggleButton} ${
              isPeriod ? styles.active : ""
            }`}
            onClick={() => setIsPeriod(true)}
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DateFilter;
