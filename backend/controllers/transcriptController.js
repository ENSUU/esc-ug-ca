import db from "../db/db.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

const transcribeAudioHFInferenceAPI = async (audioFile) => {
  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "audio/wav",
        },
        method: "POST",
        body: audioFile,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error: Status: ${response.status}`);
    }

    return await response.json(); // In the form { "text": "generated text" }
  } catch (error) {
    console.error("There was a problem with the fetch operation", error);
  }
};

const transcribeAudioAzureMLAPI = async (audioFile) => {
  try {
    const response = await fetch(process.env.AZUREML_REST_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${process.env.AZUREML_KEY}`,
        "Content-Type": "audio/wav",
      },
      method: "POST",
      body: audioFile,
    });

    if (!response.ok) {
      throw new Error(`HTTP error: Status: ${response.status}`);
    }

    return await response.json(); // In the form { "text": "generated text" }
  } catch (error) {
    console.error("There was a problem with the fetch operation", error);
  }
};

export const createTranscript = async (req, res) => {
  const { userToken } = req.body;
  const user = jwt.verify(userToken, process.env.JWT_SECRET_KEY);

  if (!req.file) {
    return res.status(400).json({ msg: "Audio file missing. " });
  }

  try {
    const data = await transcribeAudioHFInferenceAPI(req.file.buffer);
    const createTranscript = db.prepare(
      "INSERT INTO transcripts (audio_file, generated_text, user_id) VALUES (?, ?, ?)"
    );
    createTranscript.run(req.file.buffer, data.text, user.id);
    return res.status(201).json({ msg: "Transcript created", text: data.text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to generate transcript" });
  }
};

export const updateTranscriptById = async (req, res) => {
  const id = req.params.id;
  const { text } = req.body;
  const query = db.prepare(
    "UPDATE transcripts SET generated_text = ? WHERE id = ?"
  );

  try {
    query.run(text, id);
    return res
      .status(200)
      .json({ msg: `Transcript ${id} updated successfully. ` });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to update transcript with id " + id });
  }
};

export const deleteTranscriptById = async (req, res) => {
  const id = req.params.id;
  const query = db.prepare("DELETE FROM transcripts WHERE id = ? ");

  try {
    query.run(id);
    return res
      .status(200)
      .json({ msg: `Transcript ${id} deleted successfully deleted. ` });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to delete transcript with id " + id });
  }
};
