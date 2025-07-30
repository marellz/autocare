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
  console.log({ payload });
  return await ContactMessageModel.update(payload, {
    where: { id },
  });
};

const sendResponse = async (id: string, response: string) => {
  const contactMessage = await ContactMessageModel.findByPk(id);
  if (!contactMessage) {
    throw new Error("Contact message not found");
  }

  const contact = contactMessage.get();

  /**
   * TODO: feature/messaging
   * allow emailing and messaging.
   */

  if (contact.email) {
    // send email.
    // send contat.message quoted, plus response
    console.log(
      `Email to ${contact.email}: \n Last message: ${contact.message} \nResponse: ${response}`,
    );
  }

  if (contact.phone) {
    // send SMS.
    // only send the response.

    console.log(`SMS to ${contact.phone}: \nResponse: ${response}`);
  }

  return true
};

export default {
  paginate,
  getAll,
  getById,
  create,
  update,

  sendResponse,
};
