import express from "express";
import VendorRequestController from "../../controllers/vendorRequest.controller";
import { asyncHandler } from "../../handlers/async.handler";
import { validate } from "../../handlers/validation.handler";
import {
  UpdateVendorRequestFormSchema,
  NewVendorRequestFormSchema,
} from "../../schemas/vendor.schema";
const router = express.Router();

router.get("/", asyncHandler(VendorRequestController.findAll));
router.post(
  "/",
  validate(NewVendorRequestFormSchema),
  asyncHandler(VendorRequestController.create),
);
router.get("/:id", asyncHandler(VendorRequestController.findById));
router.put(
  "/:id",
  validate(UpdateVendorRequestFormSchema),
  asyncHandler(VendorRequestController.update),
);

export default router;
