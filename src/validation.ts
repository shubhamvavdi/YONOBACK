import { z } from "zod";

const url = z.string().trim().url();

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

export const gameSchema = z.object({
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must use lowercase letters, numbers, and hyphens"),
  name: z.string().trim().min(1).max(120),
  logo: url,
  subtitle: z.string().trim().min(1).max(240),
  description: z.string().trim().min(1).max(5000),
  rating: z.coerce.number().min(0).max(5),
  size: z.string().trim().min(1).max(40),
  price: z.string().trim().min(1).max(80),
  bonus: z.string().trim().min(1).max(120),
  minWithdraw: z.string().trim().min(1).max(120),
  maxBonus: z.string().trim().min(1).max(120),
  downloadUrl: url,
  telegramUrl: url,
  isFeatured: z.coerce.boolean().default(false)
});

export const gameUpdateSchema = gameSchema.partial();

const firstQueryValue = (value: unknown) => Array.isArray(value) ? value[0] : value;

export const listQuerySchema = z.object({
  page: z.preprocess(firstQueryValue, z.coerce.number().int().positive().default(1)),
  limit: z.preprocess(firstQueryValue, z.coerce.number().int().min(1).max(100).default(20)),
  search: z.preprocess(firstQueryValue, z.string().trim().max(120).optional())
});
