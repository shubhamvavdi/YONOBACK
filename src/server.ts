import { app } from "./app.js";
import { env } from "./config.js";
import { prisma } from "./db.js";

const server = app.listen(env.PORT, () => {
  console.log(`Yono backend running on http://localhost:${env.PORT}`);
});

const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
