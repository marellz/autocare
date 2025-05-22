import express from "express";
import RequestsController from "../../controllers/request.controller";
import { asyncHandler } from "../../handlers/async.handler";

const router = express.Router();

router.get("/", asyncHandler(RequestsController.findAll));
router.post("/", asyncHandler(RequestsController.create));
router.get("/:id", asyncHandler(RequestsController.findById));
router.put("/:id", asyncHandler(RequestsController.update));

export default router;
