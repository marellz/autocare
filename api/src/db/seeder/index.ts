import { syncModels } from "../sequelize";
import requestSeeder from "./requests.seeder";
import userSeeder from "./users.seeder";
import dotenv from "dotenv";
import vendorSeeder from "./vendor.seeder";
import vendorRequestSeeder from "./vendor-requests";

(async () => {
  dotenv.config();
  try {
    await syncModels(true);
    Promise.all([
      await vendorSeeder(),
      await requestSeeder(),
      await vendorRequestSeeder(),
      await userSeeder(),
    ]);

    console.log("✅ Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error("❗Error seeding:", error);
    process.exit(1);
  }
})();
