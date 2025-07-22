import VendorService from "../services/vendor/vendor.service";
import { Request, Response, NextFunction } from "express";
import { Op, WhereOptions } from "sequelize";
import { Vendor } from "src/db/models/vendor.model";
import { PaginationSortBy, PaginationSortOrder } from "src/types/pagination";

class VendorController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        brand,
        query,
        page = 1,
        limit = 10,
        sort_by = "createdAt",
        sort_order,
      } = req.query;

      let where: WhereOptions<Vendor> = {};

      const q = query as string;
      if (q)
        where = {
          [Op.or]: [
            { name: { [Op.iLike]: `%${q}%` } },
            { phone: { [Op.iLike]: `%${q}%` } },
          ],
        };

      if (brand)
        where = {
          ...where,
          brands: {
            [Op.contains]: [brand as string],
          },
        };

      const vendors = await VendorService.paginate({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        sort_by: (sort_by as PaginationSortBy) ?? "createdAt",
        sort_order: (sort_order as PaginationSortOrder) ?? "DESC",
        where,
        query: query as string,
      });

      return res.status(200).json({ message: "ok", data: vendors });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const vendor = await VendorService.findById(id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      return res.status(200).json({ message: "ok", data: vendor });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const { name, phone, location, brands } = req.body;
    try {
      const vendor = await VendorService.create({
        name,
        phone,
        location,
        brands,
      });

      return res.status(201).json({ message: "ok", data: vendor });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { name, phone, location, brands } = req.body;
    try {
      const vendor = await VendorService.update(id, {
        name,
        phone,
        location,
        brands,
      });
      if (!vendor) {
        return res.status(404);
      }
      return res.status(200).json({ message: "ok", data: vendor });
    } catch (error) {
      next(error);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const vendor = await VendorService.destroy(id);
      if (!vendor) {
        return res.status(404);
      }
      return res.json({ message: "Vendor deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default VendorController;
