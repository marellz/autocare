import VendorController from "../../controllers/vendor.controller";
import { asyncHandler } from "../../handlers/async.handler";
import express from "express";
import { validate } from "../../handlers/validation.handler";
import vendorFormSchema from "../../schemas/vendor.schema";
const router = express.Router();

router.get("/", asyncHandler(VendorController.findAll));
router.get("/:id", asyncHandler(VendorController.findById));
router.post("/", validate(vendorFormSchema),  asyncHandler(VendorController.create));
router.put("/:id", validate(vendorFormSchema.partial()), asyncHandler(VendorController.update));
router.delete("/:id", asyncHandler(VendorController.destroy));

export default router;
