import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const NO_TOKEN = "Token not found";
const INVALID_TOKEN = "Token is invalid";
const secret = process.env.JWT_SECRET;

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error(NO_TOKEN);

    jwt.verify(token, secret, "secret", (err, decoded) => {
      if (err) throw new Error(INVALID_TOKEN);
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
