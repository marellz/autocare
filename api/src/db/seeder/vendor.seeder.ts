import { faker } from "@faker-js/faker";
import { NewVendor } from "../models/vendor.model";
import { VendorModel } from "../sequelize";

export default async () => {
  console.log("Seeding vendors");

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

  const vendorData: NewVendor[] = Array.from({ length: 15 }, () => ({
    name: faker.person.firstName(),
    phone: faker.phone.number(),
    brands: faker.helpers.arrayElements(allBrands, 3),
  }));

  await VendorModel.bulkCreate(vendorData);
};
