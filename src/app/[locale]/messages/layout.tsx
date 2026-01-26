"use client";

import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
  useParams,
} from "next/navigation";
import { Handshake, Mail, Calendar } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import TabsContainer from "@/components/common/tabs/TabsContainer";
import Tab from "@/components/common/tabs/Tab";
import styles from "./layout.module.scss";

type TabType = "messages" | "event-invitations" | "partnerships";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<TabType>("messages");

  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabType | null;
    const isConversationPage =
      pathname.includes("/messages/") && pathname !== `/${locale}/messages`;

    if (isConversationPage) {
      setActiveTab("messages");
    } else if (
      tabParam &&
      ["messages", "event-invitations", "partnerships"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("messages");
    }
  }, [pathname, searchParams, locale]);

  const handleTabClick = (id: string) => {
    const tabId = id as TabType;

    if (tabId === "messages") {
      if (
        pathname.includes("/messages/") &&
        pathname !== `/${locale}/messages`
      ) {
        router.push(`/${locale}/messages`);
        return;
      }
      router.push(`/${locale}/messages`);
    } else {
      router.push(`/${locale}/messages?tab=${tabId}`);
    }
  };

  if (isLoadingUser || !user) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.tabsWrapper}>
        <TabsContainer>
          <Tab
            id="messages"
            label="Messages"
            icon={Mail}
            isActive={activeTab === "messages"}
            onClick={handleTabClick}
          />
          {user.userType === "creator" && (
            <>
              <Tab
                id="event-invitations"
                label="Invitations événements"
                icon={Calendar}
                isActive={activeTab === "event-invitations"}
                onClick={handleTabClick}
              />
              <Tab
                id="partnerships"
                label="Partenariats"
                icon={Handshake}
                isActive={activeTab === "partnerships"}
                onClick={handleTabClick}
              />
            </>
          )}
        </TabsContainer>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
