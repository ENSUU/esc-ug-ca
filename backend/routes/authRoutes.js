import express from "express";

import { loginUser, getUserFromToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/:token", getUserFromToken);

export default router;
