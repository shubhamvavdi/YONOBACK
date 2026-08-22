import type { ErrorRequestHandler, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "./config.js";
import { prisma } from "./db.js";

const tokenSchema = z.object({ sub: z.string(), email: z.string().email() });

export const requireAdmin: RequestHandler = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authorization token is required" });
      return;
    }

    const payload = tokenSchema.parse(jwt.verify(header.slice(7), env.JWT_SECRET));
    const admin = await prisma.admin.findUnique({ where: { id: payload.sub } });
    if (!admin) {
      res.status(401).json({ error: "Admin account no longer exists" });
      return;
    }

    req.admin = { id: admin.id, email: admin.email, createdAt: admin.createdAt, updatedAt: admin.updatedAt };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired authorization token" });
  }
};

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: "Route not found" });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: "Validation failed", details: error.flatten().fieldErrors });
    return;
  }

  if (error?.code === "P2002") {
    res.status(409).json({ error: "A game with this slug already exists" });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
};
