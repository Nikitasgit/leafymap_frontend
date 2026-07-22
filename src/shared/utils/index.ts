// Shared utils — prefer deep imports: `@/shared/utils/userDisplay`.

export {
  getDisplayName,
  getAvatarLetter,
} from "./userDisplay";
export type { UserDisplayInfo } from "./userDisplay";

export {
  parseDateToUTC,
  parseDateStringToDate,
  formatDateShort,
  sortPeriodsByStartDate,
  formatEventDateRange,
  formatEventDateRangeCard,
} from "./dates";

export { formatDate } from "./formatDate";

export { capitalizeFirstLetter } from "./functions";

export { isSameId } from "./id";

export {
  generateTempId,
  isTempId,
  separateNewAndUpdatedArrayValues,
} from "./tempId";

export { confirmTwice } from "./confirmTwice";
