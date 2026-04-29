import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash,
    },
  });

  const existingTeams = await prisma.team.count();
  if (existingTeams === 0) {
    await prisma.team.createMany({
      data: [
        { game: "Counter-Strike 2", logo: "/images/games/cs2.png", order: 0 },
        { game: "Dota 2", logo: "/images/games/dota2.png", order: 1 },
        { game: "Valorant", logo: "/images/games/valorant.png", order: 2 },
      ],
    });

    const teams = await prisma.team.findMany({ orderBy: { order: "asc" } });

    for (const team of teams) {
      const roles = getRoles(team.game);
      for (let i = 0; i < 5; i++) {
        await prisma.player.create({
          data: {
            teamId: team.id,
            nickname: `Player${i + 1}`,
            role: roles[i],
            avatar: "/images/avatars/placeholder.png",
          },
        });
      }
    }
  }

  const existingGallery = await prisma.galleryImage.count();
  if (existingGallery === 0) {
    const titles = [
      "Эпичный момент",
      "Победа в турнире",
      "Командная игра",
      "Лучший клатч",
      "Стрим-сессия",
      "Тренировка",
      "Лан-пати",
      "Награждение",
    ];
    for (let i = 0; i < titles.length; i++) {
      await prisma.galleryImage.create({
        data: {
          src: `/images/gallery/placeholder-${i + 1}.jpg`,
          alt: `Скриншот ${i + 1}`,
          title: titles[i],
          order: i,
        },
      });
    }
  }

  const existingPages = await prisma.pageMeta.count();
  if (existingPages === 0) {
    await prisma.pageMeta.createMany({
      data: [
        {
          slug: "home",
          title: "StrongPlay — Игровое сообщество",
          description: "Мультигеймерское сообщество StrongPlay. Играем. Побеждаем. Вместе.",
          content: {
            slogan: "Играем. Побеждаем. Вместе.",
            games: ["Counter-Strike 2", "Dota 2", "Valorant"],
            aboutCards: [
              { icon: "01", title: "Мультигейминг", text: "Мы играем в разные жанры: FPS, MOBA, RPG и многое другое. Каждый найдёт себе команду по душе." },
              { icon: "02", title: "Турниры", text: "Регулярные внутренние и внешние турниры. Соревнуйся, прокачивай скилл и побеждай." },
              { icon: "03", title: "Сообщество", text: "Дружелюбная атмосфера, опытные игроки и активный контент на YouTube." },
            ],
          },
        },
        {
          slug: "teams",
          title: "Команды — StrongPlay",
          description: "Состав игровых команд StrongPlay",
          content: {},
        },
        {
          slug: "gallery",
          title: "Галерея — StrongPlay",
          description: "Скриншоты и медиа StrongPlay",
          content: {},
        },
      ],
    });
  }

  const existingGames = await prisma.game.count();
  if (existingGames === 0) {
    await prisma.game.createMany({
      data: [
        { name: "Counter-Strike 2", url: "https://store.steampowered.com/app/730/CounterStrike_2/", visible: true, order: 0 },
        { name: "Dota 2", url: "https://store.steampowered.com/app/570/Dota_2/", visible: true, order: 1 },
        { name: "Valorant", url: "https://playvalorant.com/", visible: true, order: 2 },
      ],
    });
  }

  console.log("Seed completed.");
}

function getRoles(game: string): string[] {
  if (game.includes("Counter-Strike")) {
    return ["Капитан / IGL", "AWP", "Rifler", "Rifler", "Entry"];
  }
  if (game.includes("Dota")) {
    return ["Carry", "Mid", "Offlane", "Support 4", "Support 5"];
  }
  return ["Duelist", "Controller", "Initiator", "Sentinel", "Flex"];
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
