import VendorController from "../../controllers/vendor.controller";
import { asyncHandler } from "../../handlers/async.handler";
import express from "express";
const router = express.Router();

router.get("/", asyncHandler(VendorController.findAll));
router.get("/:id", asyncHandler(VendorController.findById));
router.post("/", asyncHandler(VendorController.create));
router.put("/:id", asyncHandler(VendorController.update));
router.delete("/:id", asyncHandler(VendorController.destroy));

export default router;
