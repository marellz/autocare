import { VendorModel } from "#db/sequelize.js";
import { where } from "sequelize";

class VendorService {
  static async findAll(where = {}) {
    return await VendorModel.findAll({
      where
    });
  }

  static async findById(id) {
    const vendor = await VendorModel.findByPk(id);
    return vendor;
  }

  static async create(data) {
    return await VendorModel.create(data);
  }

  static async update(id, data) {
    return await VendorModel.update(data, {
      where: {
        id,
      },
    });
  }

  static async delete(id) {
    const vendor = await VendorModel.findByPk(id);
    if (!vendor) {
      return null;
    }

    return vendor.destroy({
      where : {
        id,
      },
    });
  }
}

export default VendorService;
