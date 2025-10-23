import type { NextFunction, Request, Response } from "express";
import { sendMail } from "../services/mail/sender.service";
import userService from "../services/user/user.service";
import verifyCaptchaToken from "../services/recaptcha/verify.service";
import passwordResetService from "../services/auth/password-reset.service";
import crypto from "crypto";
import moment from "moment";
import { hashPassword } from "../utils/password";

const AuthController = () => {
  const register = () => {}; // ignore for now
  const logout = (request: Request, response: Response) => {
    if (!request.user) {
      return response
        .status(401)
        .json({ message: "error", error: "unauthorized" });
    }

    request.logout((err) => {
      if (err) {
        return response.status(400).json({ message: "error", error: err });
      }
      request.session.destroy(() => {
        return response.status(200).json({ message: "ok" });
      });
    });
  };

  const getUser = (request: Request, response: Response) => {
    const { user } = request;
    if (!user) {
      response.status(401).json({ message: "error", error: "User not found" });
      return;
    }

    response.status(200).json({ message: "ok", data: { user } });
  };

  const recoverPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, token } = req.body;
      if (!token) throw new Error("Token not found");

      // verify token
      const recaptchaResponse = await verifyCaptchaToken(token);

      if (!recaptchaResponse.success)
        throw new Error(recaptchaResponse.message);

      // verify user
      const user = await userService.findByEmail(email);
      if (!user) {
        res.json({ message: "ok" });
        return;
      }

      /**
       * PASSWORD RESET
       * 1. find any existing one, update it
       * 2. create one if new
       * 3. send token by email
       */
      const basicToken = crypto.randomBytes(32).toString("hex");
      const passwordResetToken = crypto
        .createHash("sha256")
        .update(basicToken)
        .digest("hex");
      const expiresAt = moment().add(15, "minutes").toISOString();

      const existingToken = await passwordResetService.findByEmail(email);
      if (existingToken) {
        const _existing = existingToken.get();
        const updated = await passwordResetService.update(_existing.id, {
          token: passwordResetToken,
          expiresAt,
        });
        if (!updated) throw new Error("Error resetting password.");
      } else {
        const passwordReset = await passwordResetService.create({
          email,
          token: passwordResetToken,
          expiresAt,
        });
        if (!passwordReset) throw new Error("Error resetting password.");
      }

      const link =
        process.env.FRONTEND_URL + `/reset-password?token=${basicToken}`;

      await sendMail({
        to: email,
        template: "recover-password",
        subject: "Password recovery",
        context: {
          subject: "Recover your password",
          link,
        },
      });

      res.json({ message: "ok", sent: true });
    } catch (error) {
      next(error);
    }
  };

  const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { token } = req.body;

      /**
       * TOKEN VERIFICATION
       * 1. find reset instance by the token
       */
      const valid = await passwordResetService.verifyToken(token);

      if (valid === null) throw new Error("Token is invalid");

      res.json({ message: "ok", valid: true });
    } catch (error) {
      next(error);
    }
  };

  const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    //
    try {
      const { password, secure_token } = req.body;

      // find token owner
      const _passwordReset =
        await passwordResetService.verifyToken(secure_token);
      if (!_passwordReset) throw new Error("Error resetting your password");
      const { email } = _passwordReset.get();
      const user = await userService.findByEmail(email);
      if (!user) throw new Error("Error resetting your password");
      // update user password
      user.update({
        password: await hashPassword(password),
      });

      // delete password-reset
      await passwordResetService.destroy(email);

      res.json({ message: "ok", updated: true });
    } catch (error) {
      next(error);
    }
  };

  return {
    register,
    logout,
    getUser,
    recoverPassword,
    resetPassword,
    verifyToken,
  };
};

export default AuthController;
