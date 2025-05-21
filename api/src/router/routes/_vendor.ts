import VendorController from "#controllers/vendor.controller.js";
import express from "express";
const router = express.Router();

router.get("/", VendorController.findAll);
router.get("/:id", VendorController.findById);
router.post("/", VendorController.create);
router.put("/:id", VendorController.update);
router.delete("/:id", VendorController.destroy);

export default router;
