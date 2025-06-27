import express from "express";
import DashboardController from "../../controllers/dash.controller";
import { asyncHandler } from "../../handlers/async.handler";

const router = express.Router();
router.get("/", asyncHandler(DashboardController.index));

export default router;
