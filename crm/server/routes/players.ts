import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

export default function playersRoutes(prisma: PrismaClient) {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const players = await prisma.player.findMany({
      orderBy: { id: "asc" },
      include: { team: { select: { id: true, game: true } } },
    });
    res.json(players);
  });

  router.get("/free", async (_req: Request, res: Response) => {
    const players = await prisma.player.findMany({
      where: { teamId: null },
      orderBy: { id: "asc" },
    });
    res.json(players);
  });

  router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { nickname, role, avatar } = req.body;
    if (!nickname) {
      res.status(400).json({ error: "Укажите никнейм" });
      return;
    }
    const player = await prisma.player.create({
      data: { nickname, role: role || "", avatar: avatar || "" },
    });
    res.json(player);
  });

  router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { nickname, role, avatar } = req.body;
    const player = await prisma.player.update({
      where: { id: Number(id) },
      data: { nickname, role, avatar },
    });
    res.json(player);
  });

  router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await prisma.player.delete({ where: { id: Number(id) } });
    res.json({ message: "Игрок удалён" });
  });

  router.post("/:id/assign", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { teamId } = req.body;
    const player = await prisma.player.update({
      where: { id: Number(id) },
      data: { teamId: teamId ?? null },
      include: { team: { select: { id: true, game: true } } },
    });
    res.json(player);
  });

  router.post("/:id/unassign", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const player = await prisma.player.update({
      where: { id: Number(id) },
      data: { teamId: null },
    });
    res.json(player);
  });

  return router;
}
