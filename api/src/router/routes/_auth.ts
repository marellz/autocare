import express, { RequestHandler } from "express";
import passport from "passport";
import AuthController from "../../controllers/auth.controller";
import { User } from "../../db/models/user.model";
import { validate } from "../../handlers/validation.handler";
import {
  loginFormSchema,
  recoverPasswordFormSchema,
  registerFormSchema,
  resetPasswordSchema,
  verifyTokenSchema,
} from "../../schemas/auth.schema";

const { register, logout, getUser, recoverPassword, resetPassword, verifyToken } =
  AuthController();

const router = express.Router();

router.post("/login", validate(loginFormSchema), (req, res, next) => {
  passport.authenticate(
    "local",
    (
      err: string | null,
      user: User | false,
      info: { message: string } | null,
    ) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          message: "error",
          error: info?.message ?? "Failed login",
        });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.json({ message: "ok", data: { user } });
      });
    },
  )(req, res, next);
});

router.post("/register", validate(registerFormSchema), register);
router.post("/logout", logout as RequestHandler);
router.post(
  "/recover-password",
  validate(recoverPasswordFormSchema),
  recoverPassword,
);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/reset-password/verify-token", validate(verifyTokenSchema), verifyToken);
router.get("/user", getUser);

export default router;
