import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config.js";
import { prisma } from "../db.js";
import { loginSchema } from "../validation.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } });
  const valid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;

  if (!admin || !valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ email: admin.email }, env.JWT_SECRET, {
    subject: admin.id,
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });

  res.json({ token, admin: { id: admin.id, email: admin.email } });
});

export default router;
