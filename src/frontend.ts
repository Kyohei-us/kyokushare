import { Request, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  findUserByName,
  getArtistById,
  geteAllArtists,
  signUpUser,
} from "./dbservices";
import { getAllKyokus, getKyokuFullInfoByKyokuId } from "./kyokuService";

const frontendRouter = Router();

/**
 * Return username if logged in.
 * Otherwise return empty string.
 * @param req: Request
 * @returns username: string
 */
function getUsernameIfLoggedIn(req: Request): string {
  try {
    const token = req.cookies["userjwt"];
    if (!token) {
      console.log("JWT not found in cookie.");
      return "";
    } 

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ? process.env.JWT_SECRET : ""
    );

    if (typeof decoded === "string") {
      return decoded;
    } else {
      return decoded.username;
    }
  } catch (e) {
    console.log(e);
    return "";
  }
}

frontendRouter.get("/", async (req, res) => {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const take = req.query.take ? Number(req.query.take) : undefined;
  const kyokus = await getAllKyokus(skip, take);

  const artists = await geteAllArtists();

  console.log(kyokus);

  // Check if user is logged in
  let username = getUsernameIfLoggedIn(req);

  const data = {
    kyokus,
    username: username,
    artists,
  };
  res.render("./index.ejs", data);
});

frontendRouter.get("/commentsByKyokuId/:id", async (req, res) => {
  const kyoku = await getKyokuFullInfoByKyokuId(Number(req.params.id));

  // Check if user is logged in
  let username = getUsernameIfLoggedIn(req);

  const data = {
    kyoku,
    comments: kyoku?.comments,
    username: username,
  };
  res.render("./comments.ejs", data);
});

frontendRouter.get("/artist/:id", async (req, res) => {
  const artist = await getArtistById(Number(req.params.id));

  // Check if user is logged in
  let username = getUsernameIfLoggedIn(req);

  const data = {
    artist,
    username: username,
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
    console.log(user);
    res.redirect("/");
  }
});

frontendRouter.get("/login", async (req, res) => {
  res.render("login");
});

frontendRouter.post("/login", async (req, res) => {
  console.log("Logging in...");
  console.log(req.body);
  if (req.body.username == process.env.TEST_USER_NAME) {
    const payload = {
      username: req.body.username,
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET ? process.env.JWT_SECRET : ""
    );
    res.cookie("userjwt", token, {
      httpOnly: true,
    });
    // req.session.save();
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
          // req.session.save();
          res.cookie("userjwt", token, {
            httpOnly: true,
          });
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
  if (req.cookies["userjwt"]) {
    res.clearCookie("userjwt");
    // req.session.save();
    console.log("logged out!");
    res.redirect("/login");
  } else {
    res.redirect("/login");
  }
});

export default frontendRouter;
