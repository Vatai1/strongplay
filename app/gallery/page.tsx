import { getGallery, getPageMeta } from "@/lib/api";
import GalleryGrid from "@/components/GalleryGrid";
import styles from "./gallery.module.css";

export async function generateMetadata() {
  const page = await getPageMeta("gallery");
  return {
    title: page?.title || "Галерея — StrongPlay",
    description: page?.description || "Скриншоты и медиа StrongPlay",
  };
}

export default async function GalleryPage() {
  const images = await getGallery();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Галерея</h1>
        <p className={styles.subtitle}>
          Лучшие моменты нашего сообщества
        </p>
        <GalleryGrid images={images.map((img) => ({ src: img.src, alt: img.alt, title: img.title }))} />
      </div>
    </div>
  );
}
