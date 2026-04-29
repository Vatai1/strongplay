import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken, authMiddleware, AuthRequest } from "../middleware/auth";

export default function authRoutes(prisma: PrismaClient) {
  const router = Router();

  router.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Введите логин и пароль" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(401).json({ error: "Неверный логин или пароль" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Неверный логин или пароль" });
      return;
    }

    const token = generateToken(user.id);
    res.json({ token, username: user.username });
  });

  router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }
    res.json({ id: user.id, username: user.username });
  });

  router.post("/change-password", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Заполните все поля" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Неверный текущий пароль" });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: req.userId }, data: { passwordHash } });
    res.json({ message: "Пароль изменён" });
  });

  return router;
}
