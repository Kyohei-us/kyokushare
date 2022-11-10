import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { createKyoku, getAllKyokus } from "./dbservices";

const kyokusRouter = Router();

// Get all Kyokus
kyokusRouter.get("/", async (req, res) => {
  const kyokus = await getAllKyokus();
  res.json(kyokus);
});

// Create Kyoku
kyokusRouter.post("/", async (req, res) => {
  if (!req.body.title || !req.body.artist_name) {
    res.json({ message: "request body parameter is invalid" });
  }

  const kyoku = await createKyoku(req.body.title, req.body.artist_name);
  res.json(kyoku);
});

export default kyokusRouter;