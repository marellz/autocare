import { UserModel } from "../db/sequelize";
import { generateToken } from "../utils/token";
import userService from "../services/user/user.service";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../router/routes/_auth";

const INVALID_EMAIL_PASSWORD = "Invalid email/password.";
const EMAIL_ALREADY_USED = "Email already registered";
const ERROR_CREATING_USER = "Error creating user";

class AuthController {
  static async registerCookie(res: Response, token: string) {
    const baseDomain = process.env.BASE_DOMAIN;
    if (!token) throw new Error("No token");
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: `.${baseDomain}`,
      maxAge: 60 * 60 * 1000 * 4,
    });
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const _user = await UserModel.findOne({ where: { email } });
      const user = _user?.get();
      if (!user) throw new Error(INVALID_EMAIL_PASSWORD);

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) throw new Error(INVALID_EMAIL_PASSWORD);

      const token = await generateToken(user.id, email);
      await this.registerCookie(res, token);

      res.status(200).json({ data: { user } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const exists = await UserModel.findOne({ where: { email } });
      if (exists) throw new Error(EMAIL_ALREADY_USED);

      const _user = await userService.create({ name, email, password });
      const user = _user.get();
      if (!user) throw new Error(ERROR_CREATING_USER);

      const token = await generateToken(user.id, email);
      await this.registerCookie(res, token);

      return res.json({
        data: {
          user,
          token,
          message: "User registered successfully",
        },
      });
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("token");
    return res.json({ success: true, message: "Logged out" });
  }

  static async user(req: AuthenticatedRequest, res: Response) {
    if(!req.user){
      res.status(401).json({message:'Unauthenticated.'})
      return
    } 
      
    const data = await userService.get(req.user.id);
    return res.json({ data });
  }
}

export default AuthController;
