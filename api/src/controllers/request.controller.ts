import { PaginationSortBy, PaginationSortOrder } from "../types/pagination";
import { RequestStatusEnum } from "../db/models/request.model";
import RequestService from "../services/request/request.service";
import { Request, Response, NextFunction } from "express";
// import { Request as RequestModel } from "../db/models/request.model";
class RequestsController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by = "createdAt",
        sort_order,
      } = req.query;

      // todo: handle pagination errors, validate via yup
      const paginationError = null;
      if (paginationError)
        throw new Error("Pagination error: " + paginationError);

      const requests = await RequestService.paginate({
        page: page? Number(page) : 1,
        limit: limit? Number(limit): 10,
        sort_by: sort_by as PaginationSortBy ?? 'createdAt',
        sort_order: sort_order as PaginationSortOrder ?? 'DESC'
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
      const {
        name,
        phone,
        item,
        capturedDetails = {},
        missingDetails = [],
      } = req.body;

      const status = RequestStatusEnum.SUBMITTED;
      const originalMessages = [item];
      const channel = "web";

      const request = await RequestService.create({
        name,
        phone,
        channel,
        capturedDetails,
        missingDetails,
        originalMessages,
        status,
      });

      res.json({ message: "ok", data: request });

      // todo, do processing and update this request.
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { fulfilled_at, status, originalMessages, capturedDetails } =
        req.body;
      const request = await RequestService.update(id, {
        fulfilled_at,
        status,
        originalMessages,
        capturedDetails,
      });
      if (!request) {
        return res.status(404).json({ message: "not found" });
      }
      res.json({ message: "ok", data: request });
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
