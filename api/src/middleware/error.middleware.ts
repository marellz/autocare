import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line
  next: NextFunction
) => {
  console.error(err.stack); // Log error for debugging

  res.status(500).json({
    message: "error",
    error: err.message,
  });
};

export default errorHandler;
