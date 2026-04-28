import { galleryImages } from "@/data/gallery";
import GalleryGrid from "@/components/GalleryGrid";
import styles from "./gallery.module.css";

export const metadata = {
  title: "Галерея — StrongPlay",
  description: "Скриншоты и медиа StrongPlay",
};

export default function GalleryPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Галерея</h1>
        <p className={styles.subtitle}>
          Лучшие моменты нашего сообщества
        </p>
        <GalleryGrid images={galleryImages} />
      </div>
    </div>
  );
}
