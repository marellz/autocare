import express from "express";
import RequestsController from "#controllers/request.contoller.js";

const router = express.Router();

router.get("/", RequestsController.findAll);
router.post("/", RequestsController.create);
router.get("/:id", RequestsController.findById);
router.put("/:id", RequestsController.update);

export default router;
