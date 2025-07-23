import { VendorModel, VendorRequestModel } from "../../db/sequelize";
import type { Vendor, NewVendor } from "../../db/models/vendor.model";
import { FindAllParams } from "../../types/pagination";
import { Op } from "sequelize";

type FindVendorParams = Partial<Record<keyof Vendor, any>>;
class VendorService {
  static async paginate({
    page,
    limit,
    where,
    sort_by,
    sort_order,
    query
  }: FindAllParams<Vendor>) {
    const offset = (page - 1) * limit;
    const { rows, count } = await VendorModel.findAndCountAll({
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
        query,
        page_count: Math.ceil(count / limit),
        sort_by,
        sort_order,
        limit,
      },
    };
  }

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

  static async getTopVendors(limit: number = 5) {

    // defective. todo: implement sorting before limit
    const _vendors = await VendorModel.findAll({
      include: [VendorRequestModel],
      limit,
    });

    const vendors = _vendors
      .map((vendor) => vendor.get())
      .filter((v) => v.vendor_requests && v.vendor_requests.length > 0);

    // sort

    return vendors.sort((a, b) => {
      const aRequests = a.vendor_requests?.length || 0;
      const bRequests = b.vendor_requests?.length || 0;
      return bRequests - aRequests;
    });
  }
}

export default VendorService;
