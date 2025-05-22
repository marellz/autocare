import express from "express";
import VendorRequestController from "../../controllers/vendorRequest.controller";
import { asyncHandler } from "../../handlers/async.handler";
const router = express.Router();

router.get("/", asyncHandler(VendorRequestController.findAll));
router.post("/", asyncHandler(VendorRequestController.create));
router.get("/:id", asyncHandler(VendorRequestController.findById));
router.put("/:id", asyncHandler(VendorRequestController.update));

export default router;
