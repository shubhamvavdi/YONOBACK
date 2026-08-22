import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config.js";
import authRoutes from "./routes/auth.js";
import gameRoutes from "./routes/games.js";
import { errorHandler, notFound } from "./middleware.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(",").map((item) => item.trim()) }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => res.json({ status: "ok", service: "yono-backend" }));
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use(notFound);
app.use(errorHandler);
