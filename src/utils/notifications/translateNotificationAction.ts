import type { TFunction } from "i18next";
import type { NotificationActionType } from "@/types/notifications";

export function translateNotificationAction(
  action: NotificationActionType,
  t: TFunction<"notifications">
): string {
  return t(`actions.${action}`, { defaultValue: t("actions.other") });
}
