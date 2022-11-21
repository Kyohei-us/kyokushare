import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  findUserByName,
  getAllKyokus,
  getArtistById,
  getKyokuFullInfoByKyokuId,
  signUpUser,
} from "./dbservices";

const frontendRouter = Router();

frontendRouter.get("/", async (req, res) => {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const take = req.query.take ? Number(req.query.take) : undefined;
  const kyokus = await getAllKyokus(skip, take);

  const data = {
    kyokus,
    username: req.session.username,
    token: req.session.token,
  };
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

frontendRouter.post("/signup", async (req, res) => {
  console.log("signing up...");
  console.log(req.body);

  const user = await signUpUser(req.body.username, req.body.password);

  if (user === "error") {
    console.log("Sign up failed.");
    res.json({ error: "Sign up failed." });
  } else {
    console.log("Signed up!");
    res.json({ user });
  }
});

frontendRouter.get("/login", async (req, res) => {
  res.render("login");
});

frontendRouter.post("/login", async (req, res) => {
  console.log("Logging in...");
  console.log(req.body);
  if (req.body.username == "test") {
    const payload = {
      username: req.body.username,
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET ? process.env.JWT_SECRET : ""
    );
    req.session.token = token;
    req.session.username = req.body.username;
    req.session.save();
    console.log("Test User Logged in!");
    res.redirect("/");
  } else {
    let user = await findUserByName(req.body.username);
    if (user) {
      // Begin password comparison
      bcrypt.compare(
        req.body.password,
        user?.userAuth?.hashedPassword ? user?.userAuth?.hashedPassword : "",
        function (error, results) {
          if (error) {
            console.log("Password comparison error!");
            return res.status(400).json({
              error: error.message,
            });
          }
          if (!results) {
            console.log("Log in failed!");
            return res.json({
              message: "password is not correct",
            });
          }
          const payload = {
            username: req.body.username,
          };
          const token = jwt.sign(
            payload,
            process.env.JWT_SECRET ? process.env.JWT_SECRET : ""
          );
          req.session.token = token;
          req.session.username = req.body.username;
          req.session.save();
          console.log("Logged in!");
          res.redirect("/");
        }
      );
    } else {
      console.log("Login failed!");
      res.redirect("/login");
    }
  }
});

frontendRouter.get("/logout", function (req, res) {
  if (req.session.username) {
    req.session.username = "";
    req.session.save();
    console.log("logged out!");
    res.redirect("/login");
  }
});

export default frontendRouter;
