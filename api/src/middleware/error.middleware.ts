import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack); // Log error for debugging

  res.status(500).json({
    message: "error",
    error: err.message,
  });
};

export default errorHandler;
