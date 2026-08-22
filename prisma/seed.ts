import bcrypt from "bcryptjs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { prisma } from "../src/db.js";
import { env } from "../src/config.js";

type FrontendGame = {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  bonus: string;
  minWithdraw: string;
  rating: string | number;
  size: string;
  price: string;
  maxBonus: string;
  downloadUrl: string;
  telegramUrl: string;
  logo: string;
  description: string;
};

async function loadFrontendGames(): Promise<FrontendGame[]> {
  const dataPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../yono/data/games.js"
  );

  const moduleUrl = pathToFileURL(dataPath).href;

  try {
    const module = await import(moduleUrl);

    return module.gamesData as FrontendGame[];
  } catch (error) {
    console.warn("Frontend games catalogue not found; skipping game seed.");
    console.warn(error);
    return [];
  }
}

const main = async () => {
  try {
    console.log("Starting database seed...");

    // Create / update admin
    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);

    await prisma.admin.upsert({
      where: {
        email: env.ADMIN_EMAIL.toLowerCase(),
      },
      update: {
        passwordHash,
      },
      create: {
        email: env.ADMIN_EMAIL.toLowerCase(),
        passwordHash,
      },
    });

    console.log(`Admin ready: ${env.ADMIN_EMAIL.toLowerCase()}`);

    // Load frontend games
    const games = await loadFrontendGames();

    console.log(`Found ${games.length} games`);

    // Insert / update games
    for (const game of games) {
      await prisma.game.upsert({
        where: {
          slug: game.slug,
        },
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
          telegramUrl: game.telegramUrl,
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
          telegramUrl: game.telegramUrl,
        },
      });
    }

    console.log(`Games ready: ${games.length}`);
  } catch (error) {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();