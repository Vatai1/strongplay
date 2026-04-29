import express from "express";
import cors from "cors";
import path from "path";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import teamsRoutes from "./routes/teams";
import playersRoutes from "./routes/players";
import gamesRoutes from "./routes/games";
import galleryRoutes from "./routes/gallery";
import pagesRoutes from "./routes/pages";
import newsRoutes from "./routes/news";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
}));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/auth", authRoutes(prisma));
app.use("/api/teams", teamsRoutes(prisma));
app.use("/api/players", playersRoutes(prisma));
app.use("/api/games", gamesRoutes(prisma));
app.use("/api/gallery", galleryRoutes(prisma));
app.use("/api/pages", pagesRoutes(prisma));
app.use("/api/news", newsRoutes(prisma));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(express.static(path.join(__dirname, "..", "client")));
app.get("{*splat}", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, () => {
  console.log(`CRM server running on port ${PORT}`);
});

export default app;
