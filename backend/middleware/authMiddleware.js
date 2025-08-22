import jwt from "jsonwebtoken";
import "dotenv/config";

// 401 for missing credentials; 403 for invalid/expired token.
export const verifyToken = (req, res, next) => {
  const authHeaders = req.headers["authorization"];

  if (!authHeaders) {
    return res.status(401).json({ error: "No auth headers " });
  }

  const token = authHeaders.split(" ")[1];
  if (token == "null") {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ error: "Invalid/expired token " });
  }
};
