import userService from "../../services/user/user.service";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import { User } from "../../db/models/user.model";
import passport from "passport";
import bcrypt from "bcrypt";

const verifyFunction: VerifyFunction = async (
  username: string,
  password: string,
  done: (
    error: any,
    user?: User | false,
    options?: { message: string; error: any },
  ) => void,
) => {
  try {
    if (!username || !password) throw new Error("Validation failed");
    const _user = await userService.findByEmail(username);
    if (!_user) throw new Error();

    const user = _user.get();
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) throw new Error();
    done(null, user);
  } catch (error) {
    done(null, false, { message: "Invalid username/password", error });
  }
};

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await userService.findById(id);
    if (!user) throw new Error("User not found");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new LocalStrategy(verifyFunction));
