import React from "react";
import { Calendar } from "lucide-react";
import { formatEventDateRange } from "@/utils/dates";

export interface DateRangeProps {
  dateRange: {
    firstDate: Date | string;
    latestDate: Date | string;
  };
  className?: string;
  showIcon?: boolean;
  iconSize?: number;
}

const DateRange: React.FC<DateRangeProps> = ({
  dateRange,
  className,
  showIcon = false,
  iconSize = 14,
}) => {
  if (!dateRange || !dateRange.firstDate) return null;

  const formattedDateRange = formatEventDateRange(dateRange);

  if (!formattedDateRange) return null;

  return (
    <span className={className}>
      {showIcon && <Calendar size={iconSize} style={{ marginRight: "4px" }} />}
      {formattedDateRange}
    </span>
  );
};

export default DateRange;
