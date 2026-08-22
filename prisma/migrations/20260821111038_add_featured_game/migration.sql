-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "size" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "bonus" TEXT NOT NULL,
    "minWithdraw" TEXT NOT NULL,
    "maxBonus" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "telegramUrl" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Game" ("bonus", "createdAt", "description", "downloadUrl", "id", "logo", "maxBonus", "minWithdraw", "name", "price", "rating", "size", "slug", "subtitle", "telegramUrl", "updatedAt") SELECT "bonus", "createdAt", "description", "downloadUrl", "id", "logo", "maxBonus", "minWithdraw", "name", "price", "rating", "size", "slug", "subtitle", "telegramUrl", "updatedAt" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");
CREATE INDEX "Game_createdAt_idx" ON "Game"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
