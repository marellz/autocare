import { VendorModel } from "../../db/sequelize";
import type { Vendor, NewVendor } from "../../db/models/vendor.model";
import { Op } from "sequelize";

type FindVendorParams = Partial<Record<keyof Vendor, any>>;
class VendorService {
  static async findAll({ where = {} }: { where?: FindVendorParams } = {}) {
    const whereParams = {} as Record<keyof Vendor, any>;
    if (where.brands) {
      whereParams.brands = {
        [Op.contains]: [where.brands],
      };
      delete where.brands; // Remove from where to avoid conflict
    }

    if (where.location) {
      whereParams.location = location;
    }

    if (where.name) {
      whereParams.name = {
        [Op.iLike]: `%${where.name}%`,
      };
    }

    return await VendorModel.findAll({
      where: whereParams,
      order: [["id", "DESC"]],
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
    data.updatedAt = new Date();
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
