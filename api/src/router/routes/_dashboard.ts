import express from "express";
import DashboardController from "../../controllers/dash.controller";
import { asyncHandler } from "../../handlers/async.handler";
import { ensureAuthenticated } from "../../middleware/isAuthenticated";

const router = express.Router();
router.get("/", ensureAuthenticated, asyncHandler(DashboardController.index));

export default router;
