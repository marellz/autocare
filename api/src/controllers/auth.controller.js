import { UserModel } from "#db/sequelize.js";
import { generateToken } from "#utils/token.js";
import userService from "#services/user/user.service.js";
import bcrypt from "bcrypt";

const INVALID_EMAIL_PASSWORD = "Invalid email/password.";
const EMAIL_ALREADY_USED = "Email already registered";
const ERROR_CREATING_USER = "Error creating user";

const registerCookie = async (res, token) => {
  const baseDomain = process.env.BASE_DOMAIN;
  if (!token) throw new Error("No token");
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    domain: `.${baseDomain}`,
    maxAge: 60 * 60 * 1000 * 4,
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new Error(INVALID_EMAIL_PASSWORD);
    
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new Error(INVALID_EMAIL_PASSWORD);

    const token = await generateToken(id, email);
    await registerCookie(res, token);

    res.status(200).json({ data: { user } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await UserModel.findOne({ where: { email } });
    if (exists) throw new Error(EMAIL_ALREADY_USED);

    const user = await userService.create({ name, email, password });
    if (!user) throw new Error(ERROR_CREATING_USER);

    const token = await generateToken(id, email);
    await registerCookie(res, token);

    return res.json({
      data: {
        user,
        token,
        message: "User registered successfully",
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ success: true, message: "Logged out" });
};

const user = async (req, res) => {
  const data = await userService.get(req.user.id);
  return res.json({ data });
};

export default {
  login,
  register,
  logout,
  user,
};
