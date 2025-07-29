import { NextFunction, Request, Response } from "express";
import service from "../services/contact/contact.service";
import verifyToken from "../services/recaptcha/verify.service";

class ContactController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.getAll();
      res.json({ message: "ok", data });
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
      const { name, phone, email, message } = req.body;
      const data = await service.update(id, { name, phone, email, message });
      res.json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  }
}

export default ContactController;
