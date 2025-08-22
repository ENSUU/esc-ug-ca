import db from "../db/db.js";
import bcrypt from "bcrypt";
import "dotenv/config";

export const getUserTranscripts = async (req, res) => {
  const userId = req.params.userId;
  const query = db.prepare("SELECT * FROM transcripts WHERE user_id = ?");

  try {
    const transcripts = query.all(userId);
    return res.status(200).json({ transcripts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const createUser = async (req, res) => {
  const { email, username, password } = req.body;

  const usernameEmailAlreadyExists = db
    .prepare("SELECT * FROM users WHERE username = ? OR email = ?")
    .get(username, email);

  if (usernameEmailAlreadyExists) {
    return res
      .status(409)
      .json({ msg: "Username or email address already exists. " });
  }

  const hashedPassword = await hashPassword(password);

  const createUserQuery = db.prepare(
    "INSERT INTO users (email, username, password) VALUES (?, ?, ?)"
  );

  try {
    createUserQuery.run(email, username, hashedPassword);
    return res.status(201).json({ msg: "User created successfully. " });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
