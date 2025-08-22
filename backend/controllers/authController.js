import db from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const validatePassword = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};

export const getUserFromToken = async (req, res) => {
  const token = req.params.token;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  try {
    const user = db
      .prepare("SELECT * FROM users WHERE username = ? OR email = ?")
      .get(usernameOrEmail, usernameOrEmail);

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ msg: "Incorrect username/password. " });
    }

    const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Server error. Please try again later." });
  }
};
