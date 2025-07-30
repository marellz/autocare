import { faker } from "@faker-js/faker";
import { ContactMessageModel } from "../sequelize";
import dotenv from "dotenv";
import {
  NewContactMessage,
  ContactMessageStatusEnum,
} from "../models/contact.model";
export default async () => {
  dotenv.config();
  console.log("Seeding messages");
  const messages: NewContactMessage[] = Array(100)
    .fill({})
    .map(() => {
      const name = faker.person.firstName();
      const status = faker.helpers.arrayElement(
        Object.values(ContactMessageStatusEnum),
      );
      const closedAt =
        status === ContactMessageStatusEnum.CLOSED ? faker.date.recent() : null;

      const updatedAt =
        status === ContactMessageStatusEnum.PENDING
          ? null
          : faker.date.recent();

      return {
        name,
        email: faker.internet.email({
          firstName: name,
          provider: "autocare.com",
        }),
        phone: faker.phone.number(),
        message: faker.lorem.paragraph(),
        status,
        createdAt: faker.date.past({ years: 2 }),
        closedAt,
        updatedAt: closedAt || updatedAt,
      };
    });

  await ContactMessageModel.bulkCreate(messages);
};
