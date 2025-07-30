import { FAQModel } from "../../db/sequelize";
import { NewFAQ, type FAQ } from "../../db/models/faq.model";

const getAll = async () => {
  return FAQModel.findAll({
    order: [["id", "ASC"]],
  });
};

const getById = async (id: string) => {
  return await FAQModel.findByPk(id);
};

const create = async (payload: NewFAQ) => {
  return await FAQModel.create(payload);
};

const update = async (id: string, payload: Partial<FAQ>) => {
  return await FAQModel.update(payload, {
    where: { id },
  });
};

const destroy = async (id: string) => {
  return await FAQModel.destroy({
    where: { id },
  });
};

export default {
  getAll,
  getById,
  create,
  update,
  destroy,
};
