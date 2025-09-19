import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Text from "@/components/common/typography/Text";
import { Image as ImageType } from "@/types/image";
import ImageUploader from "@/components/common/inputs/imageUploader/ImageUploader";
import ImageModal from "@/components/common/modals/imageModal/ImageModal";
import styles from "./GallerySection.module.scss";

interface GallerySectionProps {
  images: ImageType[];
  isLoading?: boolean;
  isOwner?: boolean;
  onFilesSelected?: (files: File[]) => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  images,
  isLoading = false,
  isOwner = false,
  onFilesSelected,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
  if (isLoading) {
    return (
      <section className={styles.images}>
        <Text as="h2">
          <ImageIcon
            size={20}
            style={{ marginRight: "8px", verticalAlign: "middle" }}
          />
          Galerie
        </Text>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <Text as="p">Chargement des images...</Text>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.images}>
      <Text as="h2">
        <ImageIcon
          size={20}
          style={{ marginRight: "8px", verticalAlign: "middle" }}
        />
        Galerie
      </Text>
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
                  src={image.urls?.medium}
                  alt={`Image ${index + 1}`}
                  className={styles.galleryImage}
                  width={150}
                  height={150}
                />
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
