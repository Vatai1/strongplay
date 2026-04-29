import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

export default function teamsRoutes(prisma: PrismaClient) {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const teams = await prisma.team.findMany({
      orderBy: { order: "asc" },
      include: { players: { orderBy: { id: "asc" } } },
    });
    res.json(teams);
  });

  router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { game, logo, order } = req.body;
    if (!game) {
      res.status(400).json({ error: "Укажите название игры" });
      return;
    }
    const team = await prisma.team.create({
      data: { game, logo: logo || "", order: order || 0 },
      include: { players: true },
    });
    res.json(team);
  });

  router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { game, logo, order } = req.body;
    const team = await prisma.team.update({
      where: { id: Number(id) },
      data: { game, logo, order },
      include: { players: true },
    });
    res.json(team);
  });

  router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await prisma.team.delete({ where: { id: Number(id) } });
    res.json({ message: "Команда удалена" });
  });

  return router;
}
