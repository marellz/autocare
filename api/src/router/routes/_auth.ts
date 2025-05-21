import express from "express";
import authController from "#controllers/auth.controller.js";
import { verifyToken } from "#middleware/verifyToken.middleware.js";

const router = express.Router();
const { login, register, logout, user } = authController;
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/user", [verifyToken], user);

export default router;
