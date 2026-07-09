"use client";

import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useReviewsReceived } from "@/hooks/useReviewsReceived";
import ReviewCard from "@/components/reviews/ReviewCard";
import AccountTabShell from "@/components/account/AccountTabShell";
import styles from "./ReviewsReceivedTab.module.scss";
import { UserPopulated } from "@/types/user";

export default function ReviewsReceivedTab() {
  const { t } = useTranslation("account");
  const { user, loading: isLoadingUser } = useAuth();
  const { reviews, isLoading, refetch } = useReviewsReceived(user?._id);

  return (
    <AccountTabShell
      icon={<Star size={20} />}
      title={t("reviewsReceivedTab.title")}
      description={t("reviewsReceivedTab.description")}
      isLoading={isLoadingUser || isLoading}
      isEmpty={reviews.length === 0}
      emptyTitle={t("reviewsReceivedTab.emptyTitle")}
      emptyMessage={t("reviewsReceivedTab.emptyMessage")}
    >
      <ul className={styles.reviewsList}>
        {reviews.map((review) => (
          <li key={review._id}>
            <ReviewCard
              review={review}
              user={user as UserPopulated}
              onReviewUpdated={refetch}
              onReply={() => {}}
              onReviewDeleted={refetch}
            />
          </li>
        ))}
      </ul>
    </AccountTabShell>
  );
}
