import {
  RequestModel,
  syncModels,
  VendorModel as Vendor,
  VendorRequestModel,
  // VendorRequestModel,
} from "./sequelize";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import { RequestStatusEnum } from "./models/request.model";
import {
  NewVendorRequest,
  VendorRequestStatusEnum,
} from "./models/vendorRequest.model";
import moment from "moment";
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
      Array.from({ length: 15 }, () => ({
        name: faker.company.name(),
        phone: faker.phone.number(),
        brands: faker.helpers.arrayElements(allBrands, 3),
      })),
    );

    // seed requests
    await RequestModel.bulkCreate(
      Array.from({ length: 50 }).map(() => {
        const createdAt = faker.date.past({ years: 0.5 });
        const fulfilled_at = faker.datatype.boolean()
          ? moment(createdAt)
              .add(faker.number.int({ min: 1, max: 4 }), "days")
              .toISOString()
          : null;
        return {
          name: faker.person.firstName(),
          phone: faker.phone.number(),
          channel: faker.helpers.arrayElement(["whatsapp", "sms", "web"]),
          originalMessages: faker.lorem
            .sentences({ min: 1, max: 3 }, "\n")
            .split("\n"),
          capturedDetails: {},
          createdAt,
          missingDetails: [],
          status: faker.helpers.arrayElement(Object.values(RequestStatusEnum)),
          fulfilled_at,
        };
      }),
    );

    const requests = (await RequestModel.findAll()).map((r) => r.get());

    // distribute requests to vendors

    const vendorRequests: NewVendorRequest[] = [];

    vendors.forEach(async (vendor) => {
      const _requests = faker.helpers.arrayElements(
        requests,
        faker.number.int({ min: 1, max: 3 }),
      );

      
      _requests.forEach(async (req) => {
        const requestId = req.id;
    
        let status = faker.helpers.arrayElement(
          Object.values(VendorRequestStatusEnum), // without "QUOTED"
        );

        let condition = null;
        let price = null;
        let notes = null;

        if (faker.datatype.boolean({ probability: 75 }) || status === VendorRequestStatusEnum.QUOTED) {
          status = VendorRequestStatusEnum.QUOTED
          price = faker.number.int({ min: 10.1, max: 99.5 }) * 10;
          condition = faker.helpers.arrayElement([
            "new",
            "used",
            "refurbished",
          ]);
        } else {
          if (status === VendorRequestStatusEnum.PROPOSED) {
            notes = faker.datatype.boolean() ? faker.lorem.sentence() : null;
          }
        }
        const createdAt = moment(req.createdAt)
          .add(faker.number.int({ min: 1, max: 5 }), "hours")
          .toDate();
        const vendorId = vendor.get().id;

        vendorRequests.push({
          vendorId,
          requestId,
          status,
          condition,
          price: price?.toString(),
          notes,
          createdAt,
        });
      });
    });

    await VendorRequestModel.bulkCreate(vendorRequests);

    console.log("✅ Seed complete");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
})();
