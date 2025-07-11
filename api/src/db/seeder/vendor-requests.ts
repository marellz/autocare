import { faker } from "@faker-js/faker";
import { RequestModel, VendorModel, VendorRequestModel } from "../sequelize";
import {
  NewVendorRequest,
  VendorRequestStatusEnum,
} from "../models/vendorRequest.model";
import moment from "moment";

export default async () => {
  console.log("Seeding vendor-requests");

  const requests = await RequestModel.findAll();
  const vendors = await VendorModel.findAll();

  const vendorRequests: NewVendorRequest[] = [];

  vendors
    .map((v) => v.get())
    .forEach((vendor) => {
      const _requests = faker.helpers.arrayElements(
        requests,
        faker.number.int({ min: 1, max: 3 }),
      );

      _requests
        .map((r) => r.get())
        .forEach((req) => {
          const requestId = req.id;

          let status = faker.helpers.arrayElement(
            Object.values(VendorRequestStatusEnum), // without "QUOTED"
          );

          let condition = null;
          let price = null;
          let notes = null;

          if (
            faker.datatype.boolean({ probability: 75 }) ||
            status === VendorRequestStatusEnum.QUOTED
          ) {
            status = VendorRequestStatusEnum.QUOTED;
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
          const vendorId = vendor.id;

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
};
