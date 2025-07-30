import type { NewRequest, Request } from "../../db/models/request.model";
import { RequestModel } from "../../db/sequelize";
import { FindAllParams } from "../../types/pagination";

class RequestService {
  static async paginate({
    where,
    sort_by,
    sort_order,
    page,
    limit,
  }: FindAllParams<Request>) {
    const offset = (page - 1) * limit;
    const { rows, count } = await RequestModel.findAndCountAll({
      where,
      order: [[sort_by, sort_order]],
      limit,
      offset,
    });

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        page_count: Math.ceil(count / limit),
        sort_by,
        sort_order,
        limit,
      },
    };
  }

  static async findAll({
    where,
    sort_by,
    sort_order,
    page,
    limit,
  }: FindAllParams<Request>) {
    const offset = (page - 1) * limit;
    return await RequestModel.findAll({
      where,
      order: [[sort_by, sort_order]],
      limit,
      offset,
    });
  }

  static async findOne(where = {}) {
    const requests = await RequestModel.findOne({ where });
    return requests;
  }

  static async findById(id: string) {
    const request = await RequestModel.findByPk(id);
    return request;
  }

  static async create(payload: NewRequest) {
    const request = await RequestModel.create(payload);
    return request;
  }

  static async update(id: string, data: Partial<Request>) {
    data.updatedAt = new Date();
    const request = await RequestModel.update(data, {
      where: { id },
    });
    return request;
  }

  static async destroy(id: string) {
    const request = await RequestModel.destroy({
      where: { id },
    });
    return request;
  }
}

export default RequestService;
