import express from "express";
import VendorRequestController from "#controllers/vendorRequest.controller.js";

const router = express.Router();

router.get("/", VendorRequestController.findAll);
router.post("/", VendorRequestController.create);
router.get("/:id", VendorRequestController.findById);
router.put("/:id", VendorRequestController.update);

export default router;
