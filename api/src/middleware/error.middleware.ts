import { Request, Response } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
) => {
  console.error(err.stack); // Log error for debugging

  res.status(500).json({
    message: "error",
    error: err.message,
  });
};

export default errorHandler;
