import { NextFunction, Request, Response } from "express";
import service from "../services/contact/contact.service";
import verifyToken from "../services/recaptcha/verify.service";
import { FindOptions, Op, WhereOptions } from "sequelize";
import { ContactMessage } from "src/db/models/contact.model";

class ContactController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const params: FindOptions<ContactMessage> = {};
      let where: WhereOptions<ContactMessage> = {};
      const {
        query,
        status,
        page = 1,
        limit = 10,
        sort_by = "createdAt",
        sort_order = "desc",
      } = req.query;
      params.limit = parseInt(limit as string, 10);
      params.offset = (parseInt(page as string, 10) - 1) * params.limit;
      params.order = [[sort_by as string, sort_order as string]];

      if (query) {
        where = {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { email: { [Op.iLike]: `%${query}%` } },
            { phone: { [Op.iLike]: `%${query}%` } },
            { message: { [Op.iLike]: `%${query}%` } },
          ],
        };
      }

      if (status) {
        where = {
          ...where,
          status: { [Op.eq]: status as string },
        };
      }

      params.where = where;

      const { items, pagination } = await service.paginate(params);
      res.json({
        message: "ok",
        data: {
          items,
          pagination: { ...pagination, page, limit, sort_by, sort_order },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = service.getById(id);
      res.json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, message, token } = req.body;

      // verify recaptcha token
      const recaptchaResponse = await verifyToken(token);

      if (!recaptchaResponse.success) {
        return res.status(400).json({
          message: "Recaptcha verification failed",
          error: recaptchaResponse.message,
        });
      }

      const data = await service.create({ name, phone, email, message });
      res.json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (typeof status === "undefined") {
        return res
          .status(400)
          .json({ message: "Status is required in request body" });
      }
      const [count] = await service.update(id, { status });
      res.json({ message: "ok", updated: count > 0 });
    } catch (error) {
      next(error);
    }
  }

  static async sendResponse(req: Request, res: Response, next: NextFunction) {
    // todo: create interaction from this response
    try {
      const { id } = req.params;
      const { message } = req.body;

      const response = await service.sendResponse(id, message);
      res.json({ message: "ok", sent: response });
    } catch (error) {
      next(error);
    }
  }
}

export default ContactController;
