import { faker } from "@faker-js/faker";
import { type NewUser } from "../models/user.model";
import { UserModel } from "../sequelize";
import dotenv from "dotenv";
import { hashPassword } from "../../utils/password";
export default async () => {
  dotenv.config();
  console.log("Seeding users");
  const password = await hashPassword(process.env.TEST_PASSWORD ?? "secret");
  const rawUsers: NewUser[] = Array(10)
    .fill({})
    .map(() => {
      const name = faker.person.firstName();
      return {
        name,
        email: faker.internet.email({
          firstName: name,
          provider: "autocare.com",
        }),
        password,
      };
    });

  rawUsers.push({
    name: "Dave Test",
    email: "dave@test.com",
    password,
  });

  await UserModel.bulkCreate(rawUsers);
};
