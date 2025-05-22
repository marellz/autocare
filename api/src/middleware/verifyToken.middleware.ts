import jwt, {
  JsonWebTokenError,
  TokenExpiredError,
} from "jsonwebtoken";
import dotenv from "dotenv";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../router/routes/_auth";

dotenv.config();

const NO_TOKEN = "Token not found";
const NO_SECRET = "Secret not found";
const INVALID_TOKEN = "Token is invalid";
const TOKEN_EXPIRED = "Token is expired";
const AUTHENTICATION_ERROR = 'Authentication error'
const secret = process.env.JWT_SECRET;

interface JWTUser {
  id: number;
  name: string;
  email: string;
}

type JWTTOkenPayload = jwt.JwtPayload & JWTUser;

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error(NO_TOKEN);
    if (!secret) throw new Error(NO_SECRET);

    const decoded = jwt.verify(token, secret) as JWTTOkenPayload;
    if (decoded.id) {
      const { id, email, name } = decoded;
      req.user = { id, email, name };
      next();
    }
  } catch (error: unknown) {
    let err;
    if (error instanceof TokenExpiredError) {
      err = TOKEN_EXPIRED;
      // throw new APIError("Token expired", 401);
    } else if (error instanceof JsonWebTokenError) {
      // throw new APIError("Invalid token", 401);
      err = INVALID_TOKEN;
    } else {
      // throw new APIError("Authentication error", 401);
      err = AUTHENTICATION_ERROR
    }

    res.status(401).json({ error: err });
  }
};
