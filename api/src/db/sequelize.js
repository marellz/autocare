import { Sequelize } from "sequelize";
import dbConfig from "#config/db.js";
import userModelDefinition from "#db/models/user.model.js";

const { dbName, userName, password } = dbConfig;

export const sequelize = new Sequelize(dbName, userName, password, {
  host: process.env["DB_HOST"],
  dialect: "mysql",
  logging: (msg) => console.log(msg),
});

export const syncModels = async () => {
  try {
    await sequelize.sync();
    console.log("Synced successfully");
  } catch (error) {
    console.error("Sync failed", error.message);
  }
};

(async () => {
  const retries = 5;
  const delay = 2000;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!sequelize) throw new Error("DB not defined");

      await sequelize.authenticate();
      console.log("Database connection established.");

      syncModels();
      return; // success
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);

      if (attempt === retries) {
        throw new Error("Could not connect to DB after multiple attempts.");
      }

      // wait before retrying
      await new Promise((res) => setTimeout(res, delay));
    }
  }
})();

export const UserModel = sequelize.define("users", userModelDefinition);
