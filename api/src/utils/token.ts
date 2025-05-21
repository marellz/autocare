import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_NOT_FOUND = "SECRET not found!";

export const generateToken = async (id, email) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(SECRET_NOT_FOUND);
  }

  return jwt.sign({ id, email }, secret, { expiresIn: "4h" });
};
