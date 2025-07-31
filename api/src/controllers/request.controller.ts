import { PaginationSortBy, PaginationSortOrder } from "../types/pagination";
import { RequestChannelEnum } from "../db/models/request.model";
import RequestService from "../services/request/request.service";
import { Request, Response, NextFunction } from "express";
import { Op, WhereOptions, Sequelize, fn, col } from "sequelize";
import { Request as RequestModel } from "../db/models/request.model";
import ReceiverService from "../services/receiver/receiver.service";
import verifyToken from "../services/recaptcha/verify.service";

class RequestsController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        // filters
        query,
        status,
        channel,
        phone,

        // pagination
        page = 1,
        limit = 10,
        sort_by = "createdAt",
        sort_order,
      } = req.query;

      // todo: handle pagination errors, validate via yup
      const paginationError = null;
      if (paginationError)
        throw new Error("Pagination error: " + paginationError);

      let where: WhereOptions<RequestModel> = {};

      if (query) {
        where = {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { phone: { [Op.iLike]: `%${query}%` } },
            Sequelize.where(
              fn("array_to_string", col("originalMessages"), " "),
              {
                [Op.iLike]: `%${query}%`,
              },
            ),
          ],
        };
      }

      if (status)
        where = {
          ...where,
          status: {
            [Op.eq]: status as string,
          },
        };

      if (channel)
        where = {
          ...where,
          channel: {
            [Op.eq]: channel as string,
          },
        };

      if (phone) {
        where = {
          ...where,
          phone: {
            [Op.iLike]: `%${phone}%`,
          },
        };
      }

      const requests = await RequestService.paginate({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        sort_by: (sort_by as PaginationSortBy) ?? "createdAt",
        sort_order: (sort_order as PaginationSortOrder) ?? "DESC",
        where,
      });

      res.json({ message: "ok", data: requests });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
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

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phone, item, token } = req.body;

      // verify recaptcha token
      const recaptchaResponse = await verifyToken(token);

      if (!recaptchaResponse.success) {
        return res.status(400).json({
          message: "error",
          error: recaptchaResponse.message,
        });
      }

      const {
        request: data,
        message: response,
        missingKeys: missingDetails,
      } = await ReceiverService.handleNewRequest({
        body: item,
        name,
        phone,
        channel: RequestChannelEnum.WEB,
      });

      res.json({
        message: "ok",
        data,
        response,
        missingDetails,
      });
    } catch (error) {
      next(error);
    }
  }

  // todo: rethink request updates from client/vendor/admin, rewire update-ables
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { fulfilledAt, status, originalMessages, capturedDetails } =
        req.body;
      const request = await RequestService.update(id, {
        fulfilledAt,
        status,
        originalMessages,
        capturedDetails,
      });
      if (!request) {
        return res.status(404).json({ message: "not found" });
      }
      res.json({ message: "ok", updated: request.length > 0 });
    } catch (error) {
      next(error);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = await RequestService.destroy(id);
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
