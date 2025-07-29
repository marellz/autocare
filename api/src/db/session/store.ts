import session from "express-session";
import SequelizeStoreInit from "connect-session-sequelize";
import { sequelize } from "../sequelize";

const SequelizeStore = SequelizeStoreInit(session.Store);

export const sessionStore = new SequelizeStore({
  db: sequelize,
});
