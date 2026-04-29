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

export default function newsRoutes(prisma: PrismaClient) {
  const router = Router();

  router.get("/published", async (_req: Request, res: Response) => {
    const posts = await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  });

  router.get("/", authMiddleware, async (_req: Request, res: Response) => {
    const posts = await prisma.newsPost.findMany({ orderBy: { createdAt: "desc" } });
    res.json(posts);
  });

  router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const post = await prisma.newsPost.findUnique({ where: { id: Number(id) } });
    if (!post) {
      res.status(404).json({ error: "Новость не найдена" });
      return;
    }
    res.json(post);
  });

  router.post("/", authMiddleware, upload.single("image"), async (req: AuthRequest, res: Response) => {
    const { title, summary, content, published } = req.body;
    if (!title) {
      res.status(400).json({ error: "Укажите заголовок" });
      return;
    }
    const file = req.file;
    const post = await prisma.newsPost.create({
      data: {
        title,
        summary: summary || "",
        content: content || "",
        image: file ? `/uploads/${file.filename}` : "",
        published: published !== "false",
      },
    });
    res.json(post);
  });

  router.put("/:id", authMiddleware, upload.single("image"), async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, summary, content, published, keepImage } = req.body;
    const file = req.file;

    const existing = await prisma.newsPost.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      res.status(404).json({ error: "Новость не найдена" });
      return;
    }

    let image = existing.image;
    if (file) {
      image = `/uploads/${file.filename}`;
    } else if (keepImage !== "true") {
      image = "";
    }

    const post = await prisma.newsPost.update({
      where: { id: Number(id) },
      data: {
        title: title ?? existing.title,
        summary: summary ?? existing.summary,
        content: content ?? existing.content,
        image,
        published: published !== undefined ? published !== "false" : existing.published,
      },
    });
    res.json(post);
  });

  router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await prisma.newsPost.delete({ where: { id: Number(id) } });
    res.json({ message: "Новость удалена" });
  });

  return router;
}
