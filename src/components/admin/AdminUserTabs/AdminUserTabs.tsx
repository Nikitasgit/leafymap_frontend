"use client";

import { useState } from "react";
import { Calendar, ImageIcon, MapPin, MessageCircle, Star } from "lucide-react";
import Tab from "@/components/common/tabs/Tab";
import TabsContainer from "@/components/common/tabs/TabsContainer";
import AdminContentTable from "../AdminContentTable/AdminContentTable";
import { AdminResource, AdminUserContent } from "@/lib/api/admin";
import styles from "./AdminUserTabs.module.scss";

const tabs = [
  { id: "events", label: "Événements", icon: Calendar },
  { id: "places", label: "Lieux", icon: MapPin },
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "comments", label: "Commentaires", icon: MessageCircle },
] as const;

const AdminUserTabs = ({
  content,
  onDelete,
  onRestore,
}: {
  content: AdminUserContent;
  onDelete: (resource: AdminResource, id: string) => Promise<void>;
  onRestore: (resource: AdminResource, id: string) => Promise<void>;
}) => {
  const [activeTab, setActiveTab] = useState<AdminResource>("events");

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
