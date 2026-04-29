import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

export default function pagesRoutes(prisma: PrismaClient) {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const pages = await prisma.pageMeta.findMany();
    res.json(pages);
  });

  router.get("/:slug", async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const page = await prisma.pageMeta.findUnique({ where: { slug } });
    if (!page) {
      res.status(404).json({ error: "Страница не найдена" });
      return;
    }
    res.json(page);
  });

  router.put("/:slug", authMiddleware, async (req: AuthRequest, res: Response) => {
    const slug = req.params.slug as string;
    const { title, description, content } = req.body;
    const page = await prisma.pageMeta.upsert({
      where: { slug },
      update: { title, description, content },
      create: { slug, title, description, content },
    });
    res.json(page);
  });

  return router;
}
