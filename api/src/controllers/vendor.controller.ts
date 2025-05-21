import VendorService from "#services/vendor/vendor.service.js";

class VendorController {
  static async findAll(req, res, next) {
    try {
      const vendors = await VendorService.findAll();
      return res.status(200).json({ message: "ok", data: vendors });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
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

  static async create(req, res, next) {
    const { name, phone, email, location, dealor_in } = req.body;
    try {
      const vendor = await VendorService.create({
        name,
        phone,
        email,
        location,
        dealor_in,
      });
      return res.status(201).json({ message: "ok", data: vendor });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const { name, phone, email, location, dealor_in } = req.body;
    try {
      const vendor = await VendorService.update(id, {
        name,
        phone,
        email,
        location,
        dealor_in,
      });
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      return res.status(200).json({ message: "ok", data: vendor });
    } catch (error) {
      next(error);
    }
  }

  static async destroy(req, res, next) {
    const { id } = req.params;
    try {
      const vendor = await VendorService.destroy(id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      return res.status(204).json({ message: "Vendor deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default VendorController;
