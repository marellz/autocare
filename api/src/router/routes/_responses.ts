import express from "express";

import responseController from "../../controllers/response.controller";
const router = express.Router();

router.post("/", responseController.sendClientResponse);

export default router;
