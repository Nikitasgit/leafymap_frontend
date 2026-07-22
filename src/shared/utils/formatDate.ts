import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "dd MMM yyyy", {
    locale: fr,
  });
};
