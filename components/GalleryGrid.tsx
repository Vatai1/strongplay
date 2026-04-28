"use client";

import { useState } from "react";
import { GalleryImage } from "@/data/gallery";
import styles from "./GalleryGrid.module.css";

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  return (
    <>
      <div className={styles.grid}>
        {images.map((image, index) => (
          <button
            key={index}
            className={styles.item}
            onClick={() => setSelectedIndex(index)}
          >
            <div className={styles.placeholder}>
              <span className={styles.placeholderIcon}>?</span>
              <span className={styles.placeholderTitle}>{image.title}</span>
            </div>
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className={styles.lightbox} onClick={handleClose}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.lightboxClose} onClick={handleClose}>
              X
            </button>
            <button className={styles.lightboxNav} onClick={handlePrev}>
              &lt;
            </button>
            <div className={styles.lightboxImage}>
              <div className={styles.lightboxPlaceholder}>
                <span>{images[selectedIndex].title}</span>
              </div>
            </div>
            <button className={styles.lightboxNav} onClick={handleNext}>
              &gt;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
