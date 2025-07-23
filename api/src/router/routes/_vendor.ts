import VendorController from "../../controllers/vendor.controller";
import { asyncHandler } from "../../handlers/async.handler";
import express from "express";
import { validate } from "../../handlers/validation.handler";
import vendorFormSchema from "../../schemas/vendor.schema";
import { ensureAuthenticated } from "../../middleware/isAuthenticated";
const router = express.Router();

router.get("/", ensureAuthenticated, asyncHandler(VendorController.findAll));
router.get(
  "/:id",
  ensureAuthenticated,
  asyncHandler(VendorController.findById),
);
router.post(
  "/",
  ensureAuthenticated,
  validate(vendorFormSchema),
  asyncHandler(VendorController.create),
);
router.put(
  "/:id",
  ensureAuthenticated,
  validate(vendorFormSchema.partial()),
  asyncHandler(VendorController.update),
);
router.delete(
  "/:id",
  ensureAuthenticated,
  asyncHandler(VendorController.destroy),
);

export default router;
