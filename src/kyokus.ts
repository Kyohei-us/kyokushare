import { Router } from "express";
import { findUserByEmail } from "./dbservices";
import { getKyokusByArtistId, getAllKyokus, createKyokuIfNotExists } from "./kyokuService";
import { isAuthenticated } from "./userAuthService";

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
kyokusRouter.post("/", isAuthenticated, async (req, res) => {
  if (!req.body.title || !req.body.artist_name) {
    res.json({ message: "Invalid request body parameter" });
  }

  if (req.body.title === "" || req.body.artist_name === "") {
    res.json({ message: "Invalid request body parameter" });
  }

  const user = await findUserByEmail(res.locals.email);
  if (!user) {
    res.json({message: "This user is invalid."})
  } else {
    const kyoku = await createKyokuIfNotExists(req.body.title, req.body.artist_name, user.id);
    res.json(kyoku);
  }
});

export default kyokusRouter;