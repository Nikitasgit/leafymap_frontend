import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { GallerySectionProps } from "./GallerySection.types";
import ImageUploader from "@/components/common/inputs/ImageUploader";
import ImageModal from "@/components/common/modals/GalleryImageModal";
import useDeleteImages from "@/hooks/useDeleteImages";
import { useImages } from "@/hooks/useImages";
import styles from "./GallerySection.module.scss";
import EmptyState from "@/components/common/noResults/EmptyState";
import LoadingBar from "@/components/common/loading/LoadingBar";

const GallerySection: React.FC<GallerySectionProps> = ({
  reference,
  referenceType,
  isUploading = false,
  onFilesSelected,
  canHandleImages = false,
}) => {
  const { t } = useTranslation("profile");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { images, isLoading, refetch } = useImages(
    reference,
    referenceType,
    "gallery"
  );
  const { deleteImages, isLoading: isDeleting } = useDeleteImages();

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleNavigate = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleDeleteImage = async (
    imageId: string,
    event?: React.MouseEvent
  ) => {
    event?.stopPropagation();
    if (!canHandleImages) return;
    try {
      await deleteImages([imageId]);
      await refetch();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleFilesSelected = async (files: File[]) => {
    if (onFilesSelected) {
      await onFilesSelected(files);
      await refetch();
    }
  };

  return (
    <section className={styles.gallerySection}>
      {!images || (images.length === 0 && !canHandleImages) ? (
        <EmptyState
          title={t("gallerySection.emptyTitle")}
          icon={<ImageIcon className={styles.icon} />}
        />
      ) : (
        <div className={styles.imagesList}>
          {canHandleImages && (
            <ImageUploader
              onFilesSelected={handleFilesSelected}
              disabled={isLoading}
              isLoading={isLoading}
              isUploading={isUploading}
              iconSize={28}
            />
          )}
          {images &&
            images.length > 0 &&
            images.map((image, index) => (
              <div
                key={index}
                className={styles.imageItem}
                onClick={() => handleImageClick(index)}
              >
                <Image
                  src={image.urls?.thumbnail}
                  alt={t("gallerySection.imageAlt", { index: index + 1 })}
                  className={styles.galleryImage}
                  width={150}
                  height={150}
                />
                {canHandleImages && (
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => handleDeleteImage(image.id, e)}
                    disabled={isDeleting}
                    title={t("gallerySection.deleteImage")}
                    type="button"
                    aria-label={t("gallerySection.deleteImage")}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
        </div>
      )}
      <ImageModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        images={images}
        currentIndex={currentImageIndex}
        onNavigate={handleNavigate}
      />
      {isLoading && <LoadingBar />}
    </section>
  );
};

export default GallerySection;
