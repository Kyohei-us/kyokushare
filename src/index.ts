import express, { NextFunction, Request, Response } from "express";
import kyokusRouter from "./kyokus";
import commentsRouter from "./comments";
import frontendRouter from "./frontend";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import { isAuthenticated } from "./dbservices";
// import { deleteAllUsers } from "./dbservices";

declare global {
  namespace Express {
    interface User {
      username: string;
      password: string;
    }
  }
}

// declare module 'express-session' {
//   interface SessionData {
//       username: string;
//   }
// }

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("trust proxy", 1);

app.use(
  session({
    secret: "yahaa",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api/kyokus", kyokusRouter);

app.use("/api/comments", commentsRouter);

app.use("/", frontendRouter);

app.get("/isLoggedIn", isAuthenticated, async (req, res) => {
  const username = res.locals.username;
  console.log(`${username} is now logged in!`);
  res.json({message: "You are logged in!"})
})

// app.get("/deleteAllUsers", async (req, res) => {
//   res.json({message: "Delete all users result: " + await deleteAllUsers()});
// })

app.get("/", async (req, res) => {
  res.json({ message: "Home Page" });
});

const server = app.listen(process.env.PORT, () =>
  console.log("🚀 Server ready at: http://localhost:" + process.env.PORT)
);
