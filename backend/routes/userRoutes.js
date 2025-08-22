import express from "express";
import {
  getUserTranscripts,
  createUser,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/:userId/transcripts", getUserTranscripts);
router.post("/", createUser);

export default router;
