import { RequestModel } from "../sequelize";
import { faker } from "@faker-js/faker";
import { NewRequest, RequestStatusEnum } from "../models/request.model";
import moment from "moment";

export default async () => {
  console.log("Seeding requests");

  // seed requests
  const requestData: NewRequest[] = Array.from({ length: 50 }).map(() => {
    const createdAt = faker.date.past({ years: 0.5 });
    const fulfilledAt = faker.datatype.boolean()
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
      fulfilledAt,
    };
  });

  await RequestModel.bulkCreate(requestData);
};
