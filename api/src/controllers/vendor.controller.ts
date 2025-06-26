import { cleanObject } from "../utils/object.utils";
import VendorService from "../services/vendor/vendor.service";
import { Request, Response, NextFunction } from "express";

class VendorController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const whereParams = { name: req.query.name, brand: req.query.brand };
      const vendors = await VendorService.findAll({ where: cleanObject(whereParams) });
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
