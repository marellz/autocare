import { syncModels } from "../sequelize";
import requestSeeder from "./requests.seeder";
import userSeeder from "./users.seeder";
import dotenv from "dotenv";
import vendorSeeder from "./vendor.seeder";
import vendorRequestSeeder from "./vendor-requests";
import faqsSeeder from "./faqs.seeder";
import contactMessagesSeeder from "./contact-messages.seeder";

(async () => {
  dotenv.config();
  try {
    await syncModels(true);

    let seeds = [await faqsSeeder()];

    const devSeeds = [
      await userSeeder(),
      await contactMessagesSeeder(),
      await vendorSeeder(),
      await requestSeeder(),
      await vendorRequestSeeder(),
    ];

    if (process.env.NODE_ENV === "development") {
      seeds = [...seeds, ...devSeeds];
    }

    Promise.all(seeds);

    console.log("✅ Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error("❗Error seeding:", error);
    process.exit(1);
  }
})();
