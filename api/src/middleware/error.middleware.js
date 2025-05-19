import APIError from "#handlers/errors/api.error.js";

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log error for debugging

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res
    .status(500)
    .json({
      message: "error",
      error: err.message,
    });
};

export default errorHandler;
