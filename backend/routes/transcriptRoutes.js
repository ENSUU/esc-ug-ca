import express from "express";
import {
  createTranscript,
  updateTranscriptById,
  deleteTranscriptById,
} from "../controllers/transcriptController.js";
import multer, { memoryStorage } from "multer";

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post("/", upload.single("audio"), createTranscript);
router.put("/:id", updateTranscriptById);
router.delete("/:id", deleteTranscriptById);

export default router;
