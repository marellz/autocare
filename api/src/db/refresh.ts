import { syncModels } from "./sequelize";
import dotenv from "dotenv";
(async () => {
  dotenv.config();
  try {
    await syncModels(true);

    console.log("Database refreshed successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Error refreshing/seeding database:", error);
    process.exit(1);
  }
})();
