import { Router } from "express";
import { addComment, getAllComments } from "./dbservices";

const commentsRouter = Router();

// Get all comments
commentsRouter.get("/", async (req, res) => {
  const comments = await getAllComments();
  res.json(comments);
});

// Create comment
commentsRouter.post("/", async (req, res) => {
  if (!req.body.author_name || !req.body.kyoku_title || !req.body.body) {
    res.json({ message: "Invalid request body" });
  }

  const response = await addComment(
    req.body.author_name,
    req.body.kyoku_title,
    req.body.body
  );
  res.json(response);
});

export default commentsRouter;
