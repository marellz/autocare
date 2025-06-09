import { syncModels, VendorModel as Vendor } from "./sequelize";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  await syncModels(true);

  console.log("starting seed...");

  const allBrands = [
    "Toyota",
    "Honda",
    "Nissan",
    "Ford",
    "Chevrolet",
    "Volkswagen",
    "Hyundai",
    "Kia",
    "Mazda",
    "Subaru",
    "Mercedes-Benz",
    "BMW",
    "Audi",
    "Lexus",
    "Porsche",
  ];

  // 1. Create Vendors
  try {
    await Vendor.bulkCreate(
      Array.from({ length: 5 }, () => ({
        name: faker.company.name(),
        phone: faker.phone.number(),
        brands: faker.helpers.arrayElements(allBrands, 3),
      })),
    );

    console.log("✅ Seed complete");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
})();
