import {
  ContactMessage,
  NewContactMessage,
} from "../../db/models/contact.model";

import { ContactMessageModel } from "../../db/sequelize";

const getAll = async () => {
  return await ContactMessageModel.findAll({});
};

const getById = async (id: string) => {
  return await ContactMessageModel.findByPk(id);
};

const create = async (payload: Omit<NewContactMessage, "createdAt">) => {
  return await ContactMessageModel.create({...payload, createdAt: new Date()});
};

const update = async (id: string, payload: Partial<ContactMessage>) => {
  return await ContactMessageModel.update({...payload, updatedAt: new Date()}, {
    where: { id },
  });
};

export default {
  getAll,
  getById,
  create,
  update,
};
