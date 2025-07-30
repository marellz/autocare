import { FindOptions } from "sequelize";
import {
  ContactMessage,
  NewContactMessage,
} from "../../db/models/contact.model";

import { ContactMessageModel } from "../../db/sequelize";

const paginate = async (params: FindOptions<ContactMessage>) => {
  const count = await ContactMessageModel.count({
    where: params.where,
  });
  const items = await ContactMessageModel.findAll(params);

  return {
    items,
    pagination: {
      total: count,
      page_count: Math.ceil(count / (params.limit || 10)),
    },
  };
};

const getAll = async () => {
  return await ContactMessageModel.findAll({});
};

const getById = async (id: string) => {
  return await ContactMessageModel.findByPk(id);
};

const create = async (payload: Omit<NewContactMessage, "createdAt">) => {
  return await ContactMessageModel.create({
    ...payload,
    createdAt: new Date(),
  });
};

const update = async (id: string, payload: Partial<ContactMessage>) => {
  payload.updatedAt = new Date();
  console.log({payload})
  return await ContactMessageModel.update(
    payload,
    {
      where: { id },
    },
  );
};

export default {
  paginate,
  getAll,
  getById,
  create,
  update,
};
