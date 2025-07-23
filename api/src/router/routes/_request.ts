import express from "express";
import RequestsController from "../../controllers/request.controller";
import { asyncHandler } from "../../handlers/async.handler";
import { validate } from "../../handlers/validation.handler";

// schemas
import { requestSchema } from "../../schemas/request.schema";

const router = express.Router();

router.get("/", asyncHandler(RequestsController.findAll));
router.post(
  "/",
  validate(requestSchema),
  asyncHandler(RequestsController.create),
);
router.get("/:id", asyncHandler(RequestsController.findById));
router.put(
  "/:id",
  validate(requestSchema.partial()),
  asyncHandler(RequestsController.update),
);

export default router;
