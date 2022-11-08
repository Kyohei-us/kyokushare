import express from "express";
import cors from "cors";
import kyokusRouter from "./kyokus";
import commentsRouter from "./comments";

const app = express();
app.use(cors());
app.use(express.json())

app.use("/api/kyokus", kyokusRouter);

app.use("/api/comments", commentsRouter);

app.get("/", async (req, res) => {
  res.json({ message: "Home Page" });
});

const server = app.listen(process.env.PORT, () =>
  console.log("🚀 Server ready at: http://localhost:" + process.env.PORT)
);
