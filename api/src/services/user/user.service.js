import { UserModel } from "#db/sequelize.js";
import { hashPassword } from "#utils/password.js";

const get = async (id) => {
  return await UserModel.findByPk(id);
};

const create = async ({ email, name, password: unsecurePassword }) => {
  console.log({ email, name, unsecurePassword });
  const password = await hashPassword(unsecurePassword);
  const user = await UserModel.create({
    email,
    name,
    password,
  });

  return user;
};

const update = async ({ name, password: unsecurePassword }) => {
  const { id } = req.params;
  const user = await UserModel.findOne({ where: { id } });
  user.name = name ?? user.name;

  if (unsecurePassword) {
    user.password = hashPassword(unsecurePassword);
  }

  await user.save();
  await user.reload();

  return true;
};

export default {
  get,
  create,
  update,
};
