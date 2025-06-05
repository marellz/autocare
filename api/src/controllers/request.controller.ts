import RequestService from "../services/request/request.service";
import { Request, Response, NextFunction } from "express";

class RequestsController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await RequestService.findAll();
      res.json({ message: "ok", data: requests });
    } catch (error) {
      next(error); // Pass error to middleware
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
      const { name, phone, channel, status, originalMessages, capturedDetails = {}, missingDetails = [] } = req.body;
      const request = await RequestService.create({
        name,
        phone,
        channel,
        capturedDetails,
        missingDetails,
        originalMessages,
        status
      });
      res.json({ message: "ok", data: request });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { fulfilled_at, status, originalMessages, capturedDetails  } = req.body;
      const request = await RequestService.update(id, { fulfilled_at, status, originalMessages, capturedDetails });
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
