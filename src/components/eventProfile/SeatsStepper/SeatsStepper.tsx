"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./SeatsStepper.module.scss";

export interface SeatsStepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const SeatsStepper: React.FC<SeatsStepperProps> = ({
  value,
  min,
  max,
  onChange,
  disabled = false,
}) => {
  const { t } = useTranslation("events");

  return (
    <div className={styles.seatsStepper}>
      <button
        type="button"
        className={styles.stepperButton}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label={t("seatsStepper.removeSeat")}
      >
        <Minus size={16} />
      </button>
      <span className={styles.seatsValue}>{value}</span>
      <button
        type="button"
        className={styles.stepperButton}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label={t("seatsStepper.addSeat")}
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default SeatsStepper;
