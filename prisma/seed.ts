import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { prisma } from "../src/db.js";
import { env } from "../src/config.js";

type FrontendGame = {
  slug: string;
  name: string;
  logo: string;
  subtitle: string;
  description: string;
  rating: string | number;
  size: string;
  price: string;
  bonus: string;
  minWithdraw: string;
  maxBonus: string;
  downloadUrl: string;
  telegramUrl: string;
};

function loadFrontendGames(): FrontendGame[] {
  const dataPath = resolve(dirname(fileURLToPath(import.meta.url)), "../../yono/data/games.js");
  const source = readFileSync(dataPath, "utf8").replace("export const gamesData =", "const gamesData =");
  return vm.runInNewContext(`(() => { ${source}; return gamesData; })()`);
}

const main = async () => {
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  await prisma.admin.upsert({
    where: { email: env.ADMIN_EMAIL.toLowerCase() },
    update: { passwordHash },
    create: { email: env.ADMIN_EMAIL.toLowerCase(), passwordHash }
  });

  const games = loadFrontendGames();
  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {
        name: game.name,
        logo: game.logo,
        subtitle: game.subtitle,
        description: game.description,
        rating: Number.parseFloat(String(game.rating)) || 0,
        size: game.size,
        price: game.price,
        bonus: game.bonus,
        minWithdraw: game.minWithdraw,
        maxBonus: game.maxBonus,
        downloadUrl: game.downloadUrl,
        telegramUrl: game.telegramUrl
      },
      create: {
        slug: game.slug,
        name: game.name,
        logo: game.logo,
        subtitle: game.subtitle,
        description: game.description,
        rating: Number.parseFloat(String(game.rating)) || 0,
        size: game.size,
        price: game.price,
        bonus: game.bonus,
        minWithdraw: game.minWithdraw,
        maxBonus: game.maxBonus,
        downloadUrl: game.downloadUrl,
        telegramUrl: game.telegramUrl
      }
    });
  }

  console.log(`Admin ready: ${env.ADMIN_EMAIL.toLowerCase()}`);
  console.log(`Games ready: ${games.length}`);
};

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}).finally(() => prisma.$disconnect());
