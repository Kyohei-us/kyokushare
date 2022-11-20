import { NextFunction, Request, Response, Router } from "express";
import {
  getAllKyokus,
  getArtistById,
  getKyokuFullInfoByKyokuId,
} from "./dbservices";

const frontendRouter = Router();

frontendRouter.get("/", async (req, res) => {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const take = req.query.take ? Number(req.query.take) : undefined;
  const kyokus = await getAllKyokus(skip, take);

  const data = { kyokus, username: req.session.username };
  res.render("./index.ejs", data);
});

frontendRouter.get("/commentsByKyokuId/:id", async (req, res) => {
  const kyoku = await getKyokuFullInfoByKyokuId(Number(req.params.id));
  const data = {
    kyoku,
    comments: kyoku?.comments,
  };
  res.render("./comments.ejs", data);
});

frontendRouter.get("/artist/:id", async (req, res) => {
  const artist = await getArtistById(Number(req.params.id));
  const data = {
    artist,
  };
  res.render("./artist.ejs", data);
});

frontendRouter.get("/login", async (req, res) => {
  res.render("login");
});

frontendRouter.post(
  "/login", (req, res) => {
    console.log("logging in...");
    console.log(req.body);
    if (req.body.username == "test") {
        req.session.username = req.body.username;
        req.session.save();
        console.log("logged in!");
        res.redirect("/");
    } else {
        console.log("login failed!");
        res.redirect("/login");
    }
  }
);

frontendRouter.get("/logout", function (req, res) {
  if (req.session.username) {
    req.session.username = "";
    req.session.save();
    console.log("logged out!");
    res.redirect("/login");
  }
});

export default frontendRouter;
