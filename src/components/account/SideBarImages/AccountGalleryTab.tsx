"use client";

import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import GallerySection from "@/components/userProfile/GallerySection";
import useSubmitImages from "@/hooks/useSubmitImages";
import { useAuth } from "@/hooks/useAuth";
import styles from "./AccountGalleryTab.module.scss";

export default function AccountGalleryTab() {
  const { t } = useTranslation("account");
  const { user } = useAuth();
  const { submitImages, isLoading: isUploading } = useSubmitImages();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0 || !user?._id) return;
    try {
      await submitImages({
        files,
        reference: user._id,
        referenceType: "User",
        type: "gallery",
      });
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div className={styles.galleryTab}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          <p className={styles.label}>
            <ImageIcon size={20} className={styles.icon} />
            {t("accountGalleryTab.label")}
          </p>
          <p className={styles.info}>{t("accountGalleryTab.info")}</p>
        </div>
      </div>

      <GallerySection
        reference={user?._id ?? null}
        referenceType="User"
        canHandleImages
        isUploading={isUploading}
        onFilesSelected={handleFilesSelected}
      />
    </div>
  );
}
