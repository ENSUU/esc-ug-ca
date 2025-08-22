import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import transcriptRoutes from "./routes/transcriptRoutes.js";

import { verifyToken } from "./middleware/authMiddleware.js";

const app = express();

const prodOrigin = "";
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? prodOrigin
        : "http://localhost:5173",
  })
);
app.use(express.json());
dotenv.config({ path: "./.env" });

// Middleware to validate token in request.
app.use((req, res, next) => {
  if (req.path == "/api/auth/login" || req.path == "/api/users") {
    return next();
  }
  verifyToken(req, res, next);
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transcripts", transcriptRoutes);

export default app;
