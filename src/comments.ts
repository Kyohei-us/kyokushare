import { Router } from "express";
import { addComment, addCommentByKyokuId, getAllComments } from "./dbservices";

const commentsRouter = Router();

// Get all comments
commentsRouter.get("/", async (req, res) => {
  const comments = await getAllComments();
  res.json(comments);
});

// Create comment
commentsRouter.post("/", async (req, res) => {
  if (req.body.author_name && req.body.kyoku_id && req.body.body) {
    const response = await addCommentByKyokuId(
      req.body.author_name,
      Number(req.body.kyoku_id),
      req.body.body
    );
    res.json(response);
  } else if (
    req.body.author_name &&
    req.body.kyoku_title &&
    req.body.artist_name &&
    req.body.body
  ) {
    const response = await addComment(
      req.body.author_name,
      req.body.kyoku_title,
      req.body.artist_name,
      req.body.body
    );
    res.json(response);
  } else {
    res.json({ message: "Invalid request body parameter" });
  }
});

export default commentsRouter;
