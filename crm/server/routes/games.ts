import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

export default function gamesRoutes(prisma: PrismaClient) {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const games = await prisma.game.findMany({ orderBy: { order: "asc" } });
    res.json(games);
  });

  router.get("/visible", async (_req: Request, res: Response) => {
    const games = await prisma.game.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    });
    res.json(games);
  });

  router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { name, url, logo, visible, order } = req.body;
    if (!name) {
      res.status(400).json({ error: "Укажите название игры" });
      return;
    }
    const game = await prisma.game.create({
      data: {
        name,
        url: url || "",
        logo: logo || "",
        visible: visible !== false,
        order: order || 0,
      },
    });
    res.json(game);
  });

  router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, url, logo, visible, order } = req.body;
    const game = await prisma.game.update({
      where: { id: Number(id) },
      data: { name, url, logo, visible, order },
    });
    res.json(game);
  });

  router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await prisma.game.delete({ where: { id: Number(id) } });
    res.json({ message: "Игра удалена" });
  });

  return router;
}
