"use client";

import { useTranslation } from "react-i18next";
import Button from "@/components/common/buttons/Button";
import { AdminContentItem, AdminResource } from "@/lib/api/admin";
import styles from "./AdminContentTable.module.scss";

const getLabel = (item: AdminContentItem) =>
  item.name ||
  item.location?.label ||
  item.comment ||
  item.content ||
  item.type ||
  item.referenceType ||
  item._id;

const AdminContentTable = ({
  resource,
  items,
  onDelete,
  onRestore,
}: {
  resource: AdminResource;
  items: AdminContentItem[];
  onDelete: (resource: AdminResource, id: string) => Promise<void>;
  onRestore: (resource: AdminResource, id: string) => Promise<void>;
}) => {
  const { t, i18n } = useTranslation("admin");
  const dateLocale = i18n.language === "fr" ? "fr-FR" : "en-US";

  if (items.length === 0) {
    return <p className={styles.empty}>{t("adminContentTable.empty")}</p>;
  }

  return (
    <div className={styles.table}>
      <div className={styles.header}>
        <span>{t("adminContentTable.headerContent")}</span>
        <span>{t("adminContentTable.headerDate")}</span>
        <span>{t("adminContentTable.headerStatus")}</span>
        <span>{t("adminContentTable.headerAction")}</span>
      </div>
      {items.map((item) => (
        <div className={styles.row} key={item._id}>
          <span>{getLabel(item)}</span>
          <span>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString(dateLocale)
              : "-"}
          </span>
          <span>
            {item.deleted
              ? t("adminContentTable.statusDeleted")
              : t("adminContentTable.statusVisible")}
          </span>
          <span>
            {item.deleted ? (
              <Button
                size="small"
                variant="secondary"
                onClick={() => onRestore(resource, item._id)}
              >
                {t("adminContentTable.restore")}
              </Button>
            ) : (
              <Button
                size="small"
                variant="danger"
                onClick={() => onDelete(resource, item._id)}
              >
                {t("common:actions.delete")}
              </Button>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AdminContentTable;
