import { RequestStatusEnum } from "./models/request.model";
import {
  RequestModel as Request,
  syncModels,
  VendorModel as Vendor,
  VendorRequestModel as VendorRequest,
} from "./sequelize";
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
    const vendors = await Vendor.bulkCreate(
      Array.from({ length: 5 }, () => ({
        name: faker.company.name(),
        phone: faker.phone.number(),
        brands: faker.helpers.arrayElements(allBrands, 3),
      })),
    );

    // 2. Create Requests
    const requests = await Request.bulkCreate(
      Array.from({ length: 3 }, () => ({
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        channel: "whatsapp",
        originalMessages: [faker.lorem.sentence(), faker.lorem.sentence()],
        item: faker.commerce.productName(),
        capturedDetails: {},
        missingDetails: [],
        status: faker.helpers.arrayElement([
          RequestStatusEnum.PENDING,
          RequestStatusEnum.MISSING_DETAILS,
        ]),
        fulfilled_at: null,
      })),
    );

    // 3. Link vendors to requests (many-to-many with VendorRequest)
    for (const request of requests) {
      // randomly assign 2 vendors to each request
      const sampledVendors = faker.helpers.arrayElements(vendors, 2);

      for (const vendor of sampledVendors) {
        const _vendor = vendor.get();
        const _request = request.get();

        await VendorRequest.create({
          vendorId: _vendor.id,
          requestId: _request.id,
          price: null,
          condition: null,
        });
      }
    }
    console.log("✅ Seed complete");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
})();
