import { NextFunction, Request, Response } from "express";
import FAQService from "../services/faq/faq.service";

class FAQController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await FAQService.getAll();
      res.json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await FAQService.getById(id);
      res.json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content } = req.body;
      const data = await FAQService.create({ title, content });
      res.json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const [updated] = await FAQService.update(id, { title, content });
      res.json({ message: "ok", updated: updated === 1 });
    } catch (error) {
      next(error);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await FAQService.destroy(id);
      res.json({ message: "ok" });
    } catch (error) {
      next(error);
    }
  }
}

export default FAQController;
