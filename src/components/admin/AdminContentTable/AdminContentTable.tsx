"use client";

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
  if (items.length === 0) {
    return <p className={styles.empty}>Aucun contenu.</p>;
  }

  return (
    <div className={styles.table}>
      <div className={styles.header}>
        <span>Contenu</span>
        <span>Date</span>
        <span>Statut</span>
        <span>Action</span>
      </div>
      {items.map((item) => (
        <div className={styles.row} key={item._id}>
          <span>{getLabel(item)}</span>
          <span>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("fr-FR")
              : "-"}
          </span>
          <span>{item.deleted ? "Supprimé" : "Visible"}</span>
          <span>
            {item.deleted ? (
              <Button size="small" variant="secondary" onClick={() => onRestore(resource, item._id)}>
                Restaurer
              </Button>
            ) : (
              <Button size="small" variant="danger" onClick={() => onDelete(resource, item._id)}>
                Supprimer
              </Button>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AdminContentTable;
