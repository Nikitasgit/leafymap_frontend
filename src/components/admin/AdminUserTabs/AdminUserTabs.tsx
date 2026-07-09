"use client";

import { useMemo, useState } from "react";
import { Calendar, ImageIcon, MapPin, MessageCircle, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import Tab from "@/components/common/tabs/Tab";
import TabsContainer from "@/components/common/tabs/TabsContainer";
import AdminContentTable from "../AdminContentTable/AdminContentTable";
import { AdminResource, AdminUserContent } from "@/lib/api/admin";
import styles from "./AdminUserTabs.module.scss";

const AdminUserTabs = ({
  content,
  onDelete,
  onRestore,
}: {
  content: AdminUserContent;
  onDelete: (resource: AdminResource, id: string) => Promise<void>;
  onRestore: (resource: AdminResource, id: string) => Promise<void>;
}) => {
  const { t } = useTranslation("admin");
  const [activeTab, setActiveTab] = useState<AdminResource>("events");

  const tabs = useMemo(
    () =>
      [
        { id: "events", label: t("adminUserTabs.events"), icon: Calendar },
        { id: "places", label: t("adminUserTabs.places"), icon: MapPin },
        { id: "images", label: t("adminUserTabs.images"), icon: ImageIcon },
        { id: "reviews", label: t("adminUserTabs.reviews"), icon: Star },
        { id: "comments", label: t("adminUserTabs.comments"), icon: MessageCircle },
      ] as const,
    [t],
  );

  return (
    <section className={styles.section}>
      <TabsContainer>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            icon={tab.icon}
            isActive={activeTab === tab.id}
            onClick={(id) => setActiveTab(id as AdminResource)}
            badge={content[tab.id]?.length}
          />
        ))}
      </TabsContainer>

      <AdminContentTable
        resource={activeTab}
        items={content[activeTab] || []}
        onDelete={onDelete}
        onRestore={onRestore}
      />
    </section>
  );
};

export default AdminUserTabs;
