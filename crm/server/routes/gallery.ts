import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), "uploads"),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default function galleryRoutes(prisma: PrismaClient) {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
    res.json(images);
  });

  router.post("/", authMiddleware, upload.single("file"), async (req: AuthRequest, res: Response) => {
    const { alt, title, order } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "Загрузите файл" });
      return;
    }

    const src = `/uploads/${file.filename}`;
    const image = await prisma.galleryImage.create({
      data: {
        src,
        alt: alt || file.originalname,
        title: title || "",
        order: order ? Number(order) : 0,
      },
    });
    res.json(image);
  });

  router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { alt, title, order, src } = req.body;
    const image = await prisma.galleryImage.update({
      where: { id: Number(id) },
      data: { alt, title, order: order ? Number(order) : undefined, src },
    });
    res.json(image);
  });

  router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await prisma.galleryImage.delete({ where: { id: Number(id) } });
    res.json({ message: "Изображение удалено" });
  });

  return router;
}
