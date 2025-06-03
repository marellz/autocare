import { VendorModel } from "../../db/sequelize";
import type { Vendor, NewVendor } from "../../db/models/vendor.model";

class VendorService {
  static async findAll(where = {}) {
    return await VendorModel.findAll({
      where,
    });
  }

  static async findById(id: string) {
    const vendor = await VendorModel.findByPk(id);
    return vendor;
  }

  static async findByPhone(phone: string) {
    const vendor = await VendorModel.findOne({
      where: {
        phone,
      },
    });
    return vendor;
  }

  static async create(data: NewVendor) {
    return await VendorModel.create(data);
  }

  static async update(id: string, data: Partial<Vendor>) {
    return await VendorModel.update(data, {
      where: {
        id,
      },
    });
  }

  static async destroy(id: string) {
    const vendor = await VendorModel.findByPk(id);
    if (!vendor) {
      return null;
    }

    return vendor.destroy();
  }
}

export default VendorService;
