import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const validate = (schema: ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formatted = result.error.format();
      res.status(400).json({ errors: formatted });
      return;
    }

    req.body = result.data;
    next();
  };
};