import APIError from "#handlers/errors/api.error.js";

export default errorHandler = (err, req, res, next) => {
  console.error(err); // Log error for debugging

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res
    .status(500)
    .json({ error: "Internal Server Error.", message: err.message });
};
