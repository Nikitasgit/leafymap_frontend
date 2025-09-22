import React, { useState } from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Text from "@/components/common/typography/Text";
import { Image as ImageType } from "@/types/image";
import ImageUploader from "@/components/common/inputs/imageUploader/ImageUploader";
import ImageModal from "@/components/common/modals/imageModal/ImageModal";
import useDeleteImages from "@/hooks/useDeleteImages";
import styles from "./GallerySection.module.scss";

interface GallerySectionProps {
  images: ImageType[];
  isLoading?: boolean;
  isOwner?: boolean;
  onFilesSelected?: (files: File[]) => void;
  onImageDeleted?: () => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  images,
  isLoading = false,
  isOwner = false,
  onFilesSelected,
  onImageDeleted,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
    if (!isOwner) return;

    try {
      await deleteImages([imageId]);
      onImageDeleted?.();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  if (isLoading) {
    return (
      <section>
        <Text as="h3">Galerie</Text>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <Text as="p">Chargement des images...</Text>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Text as="h3">Galerie</Text>
      <div className={styles.imagesList}>
        {isOwner && (
          <ImageUploader
            onFilesSelected={onFilesSelected || (() => {})}
            disabled={isLoading}
          />
        )}
        {images && images.length > 0
          ? images.map((image, index) => (
              <div
                key={index}
                className={styles.imageItem}
                onClick={() => handleImageClick(index)}
              >
                <Image
                  src={image.urls?.thumbnail}
                  alt={`Image ${index + 1}`}
                  className={styles.galleryImage}
                  width={150}
                  height={150}
                />
                {isOwner && (
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => handleDeleteImage(image._id, e)}
                    disabled={isDeleting}
                    title="Supprimer l'image"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))
          : !isOwner && (
              <div className={styles.emptyState}>
                <ImageIcon className={styles.icon} />
                <Text as="p" className={styles.text}>
                  Aucune image dans la galerie
                </Text>
              </div>
            )}
      </div>
      <ImageModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        images={images}
        currentIndex={currentImageIndex}
        onNavigate={handleNavigate}
      />
    </section>
  );
};

export default GallerySection;
