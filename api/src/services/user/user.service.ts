import { UserModel } from "../../db/sequelize";
import { hashPassword } from "../../utils/password";

const get = async (id: number) => {
  return await UserModel.findByPk(id);
};

const create = async ({
  email,
  name,
  password: unsecurePassword,
}: {
  email: string;
  name: string;
  password: string;
}) => {
  console.log({ email, name, unsecurePassword });
  const password = await hashPassword(unsecurePassword);
  const user = await UserModel.create({
    email,
    name,
    password,
  });

  return user;
};

interface UpdateUserPayload {
  name: string;
  password: string;
}

const update = async (
  id: string,
  { name, password: unsecurePassword }: UpdateUserPayload
) => {
  const _user = await UserModel.findOne({ where: { id } });
  const user = _user?.get();
  if (!user) return false;

  let updateable: { password?: string; name?: string } = {};
  if (name) updateable.name = name;
  if (unsecurePassword) {
    updateable.password = await hashPassword(unsecurePassword);
  }

  _user?.update(updateable);

  return true;
};

export default {
  get,
  create,
  update,
};
