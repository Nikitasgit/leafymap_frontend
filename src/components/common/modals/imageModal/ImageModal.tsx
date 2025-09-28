import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import styles from "./ImageModal.module.scss";
import { ImageModalProps } from "./ImageModal.types";

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}) => {
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          if (currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div className={styles.modal} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        {images.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={handlePrevious}
                aria-label="Image précédente"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {currentIndex < images.length - 1 && (
              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={handleNext}
                aria-label="Image suivante"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </>
        )}

        <div className={styles.imageContainer}>
          <Image
            src={currentImage.urls?.medium || ""}
            alt={`Image ${currentIndex + 1}`}
            className={styles.modalImage}
            width={800}
            height={600}
            priority
          />
        </div>

        {images.length > 1 && (
          <div className={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
