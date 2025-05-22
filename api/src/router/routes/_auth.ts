import express, { Request } from "express";
import AuthController from "../../controllers/auth.controller";
import { verifyToken } from "../../middleware/verifyToken.middleware";
import { User } from "../../db/models/user.model";
import { asyncHandler } from "../../handlers/async.handler";
export interface AuthenticatedRequest extends Request {
  user?: Omit<User, "password">;
}

const router = express.Router();
router.post("/login", asyncHandler(AuthController.login));
router.post("/register", asyncHandler(AuthController.register));
router.post("/logout", asyncHandler(AuthController.logout));
router.get("/user", [verifyToken], asyncHandler(AuthController.user));

export default router;
