import RequestService from "#services/request/request.service.js";

class RequestsController {
  static async findAll(req, res, next) {
    try {
      const requests = await RequestService.findAll();
      res.json({ message: "ok", data: requests });
    } catch (error) {
      next(error); // Pass error to middleware
    }
  }

  static async findById(req, res, next) {
    try {
      const { id } = req.params;
      const request = await RequestService.findById(id);
      if (!request) {
        return res.status(404).json({ message: "not found" });
      }
      res.json({ message: "ok", data: request });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, phone, item } = req.body;
      const request = await RequestService.create({
        name,
        phone,
        item,
      });
      res.json({ message: "ok", data: request });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { fulfilled_at, item  } = req.body;
      const request = await RequestService.update(id, { fulfilled_at, item });
      if (!request) {
        return res.status(404).json({ message: "not found" });
      }
      res.json({ message: "ok", data: request });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const request = await RequestService.delete(id);
      if (!request) {
        return res.status(404).json({ message: "not found" });
      }
      res.json({ message: "ok", data: request });
    } catch (error) {
      next(error);
    }
  }
}

export default RequestsController;
