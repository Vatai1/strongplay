export interface GalleryImage {
  src: string;
  alt: string;
  title: string;
}

export const galleryImages: GalleryImage[] = [
  { src: "/images/gallery/placeholder-1.jpg", alt: "Скриншот 1", title: "Эпичный момент" },
  { src: "/images/gallery/placeholder-2.jpg", alt: "Скриншот 2", title: "Победа в турнире" },
  { src: "/images/gallery/placeholder-3.jpg", alt: "Скриншот 3", title: "Командная игра" },
  { src: "/images/gallery/placeholder-4.jpg", alt: "Скриншот 4", title: "Лучший клатч" },
  { src: "/images/gallery/placeholder-5.jpg", alt: "Скриншот 5", title: "Стрим-сессия" },
  { src: "/images/gallery/placeholder-6.jpg", alt: "Скриншот 6", title: "Тренировка" },
  { src: "/images/gallery/placeholder-7.jpg", alt: "Скриншот 7", title: "Лан-пати" },
  { src: "/images/gallery/placeholder-8.jpg", alt: "Скриншот 8", title: "Награждение" },
];

export const GALLERY_SLOTS = 8;
