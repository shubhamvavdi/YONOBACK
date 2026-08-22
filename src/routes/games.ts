import { Router } from "express";
import { prisma } from "../db.js";
import { requireAdmin } from "../middleware.js";
import { gameSchema, gameUpdateSchema, listQuerySchema } from "../validation.js";

const router = Router();

router.get("/", async (req, res) => {
  const { page, limit, search } = listQuerySchema.parse(req.query);
  const where = search ? { OR: [{ name: { contains: search } }, { slug: { contains: search } }] } : undefined;
  const [games, total] = await Promise.all([
    prisma.game.findMany({ where, orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }], skip: (page - 1) * limit, take: limit }),
    prisma.game.count({ where })
  ]);
  res.json({ data: games, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

router.get("/:slug", async (req, res) => {
  const game = await prisma.game.findUnique({ where: { slug: req.params.slug } });
  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }
  res.json({ data: game });
});

router.post("/", requireAdmin, async (req, res) => {
  const data = gameSchema.parse(req.body);
  const game = await prisma.game.create({ data });
  res.status(201).json({ data: game });
});

router.put("/:id", requireAdmin, async (req, res) => {
  const data = gameSchema.parse(req.body);
  const id = String(req.params.id);
  const game = await prisma.game.update({ where: { id }, data });
  res.json({ data: game });
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const data = gameUpdateSchema.parse(req.body);
  const id = String(req.params.id);
  const game = await prisma.game.update({ where: { id }, data });
  res.json({ data: game });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  await prisma.game.delete({ where: { id } });
  res.status(204).send();
});

export default router;
