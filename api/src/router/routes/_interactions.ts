import express, { Request, Response } from "express";
import InteractionService from "../../services/interaction/interaction.service";

const router = express.Router();
router.get("/", async (req: Request, res: Response) => {
  const data = await InteractionService.findAll()
  res.json({
    message: "ok",
    data,
  });
});

export default router;
