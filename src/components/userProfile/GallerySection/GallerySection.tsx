import React, { useState } from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { GallerySectionProps } from "./GallerySection.types";
import ImageUploader from "@/components/common/inputs/ImageUploadertempname/ImageUploader";
import ImageModal from "@/components/common/modals/GalleryImageModal";
import useDeleteImages from "@/hooks/useDeleteImages";
import styles from "./GallerySection.module.scss";
import EmptyState from "@/components/common/noResults/EmptyStatetempname";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";

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

  return (
    <section className={styles.gallerySection}>
      {!images || (images.length === 0 && !isOwner) ? (
        <EmptyState
          title="Aucune image dans la galerie"
          icon={<ImageIcon className={styles.icon} />}
        />
      ) : (
        <>
          <h3>Galerie</h3>
          <div className={styles.imagesList}>
            {isOwner && (
              <ImageUploader
                onFilesSelected={onFilesSelected}
                disabled={isLoading}
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
                      type="button"
                      aria-label="Supprimer l'image"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
          </div>
        </>
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
