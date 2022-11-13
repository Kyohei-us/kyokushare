import { Router } from "express";
import { createKyokuIfNotExists, getAllKyokus, getKyokusByArtistId } from "./dbservices";

const kyokusRouter = Router();

// Get all Kyokus
kyokusRouter.get("/", async (req, res) => {
  if (req.query.artistId) {
    const kyokus = await getKyokusByArtistId(Number(req.query.artistId));
    res.json(kyokus);
  } else {
    const kyokus = await getAllKyokus();
    res.json(kyokus);
  }
});

// Create Kyoku
kyokusRouter.post("/", async (req, res) => {
  if (!req.body.title || !req.body.artist_name) {
    res.json({ message: "request body parameter is invalid" });
  }

  if (req.body.title === "" || req.body.artist_name === "") {
    res.json({ message: "request body parameter is invalid" });
  }

  const kyoku = await createKyokuIfNotExists(req.body.title, req.body.artist_name);
  res.json(kyoku);
});

export default kyokusRouter;