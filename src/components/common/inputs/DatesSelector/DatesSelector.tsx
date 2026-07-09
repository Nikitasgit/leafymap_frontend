"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { enUS } from "date-fns/locale/en-US";
import { useTranslation } from "react-i18next";
import styles from "./DatesSelector.module.scss";

registerLocale("fr", fr);
registerLocale("en", enUS);

interface DatesSelectorProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
  isPeriod: boolean;
  setIsPeriod: (isPeriod: boolean) => void;
  title?: string;
}

const DatesSelector: React.FC<DatesSelectorProps> = ({
  startDate,
  endDate,
  onDateChange,
  isPeriod,
  setIsPeriod,
  title,
}) => {
  const { t, i18n } = useTranslation("common");
  const dateLocale = i18n.language === "fr" ? "fr" : "en";

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onDateChange(start, end);
  };

  const handleSingleDateChange = (date: Date | null) => {
    onDateChange(date, date);
  };

  const handleToggleClick = (isPeriodValue: boolean) => {
    setIsPeriod(isPeriodValue);
  };

  return (
    <div className={styles.dateFilter}>
      {title && (
        <div className={styles.header}>
          <Calendar size={16} />
          <p className={styles.title}>{title}</p>
        </div>
      )}

      <div className={styles.controls}>
        <div className={styles.periodToggle}>
          <button
            type="button"
            className={`${styles.toggleButton} ${
              !isPeriod ? styles.active : ""
            }`}
            onClick={() => handleToggleClick(false)}
            aria-label={t("datesSelector.singleDayAriaLabel")}
          >
            {t("datesSelector.singleDay")}
          </button>
          <button
            type="button"
            className={`${styles.toggleButton} ${
              isPeriod ? styles.active : ""
            }`}
            onClick={() => handleToggleClick(true)}
            aria-label={t("datesSelector.periodAriaLabel")}
          >
            {t("datesSelector.period")}
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
              placeholderText={t("datesSelector.selectPeriodPlaceholder")}
              locale={dateLocale}
              className={styles.datePicker}
              isClearable
              onClickOutside={(e) => e.stopPropagation()}
            />
          ) : (
            <DatePicker
              selected={startDate}
              onChange={handleSingleDateChange}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              placeholderText={t("datesSelector.selectDatePlaceholder")}
              locale={dateLocale}
              className={styles.datePicker}
              isClearable
              onClickOutside={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DatesSelector;
