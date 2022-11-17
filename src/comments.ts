import { Router } from "express";
import { addComment, addCommentByKyokuId, getAllComments, incrementReputationByCommentId } from "./dbservices";

const commentsRouter = Router();

// Get all comments
commentsRouter.get("/", async (req, res) => {
  const comments = await getAllComments();
  res.json(comments);
});

/**
* Create comment
* if kyoku id is specified,
* try to add comment by kyoku id
* else if kyoku title AND artist name is specified,
* try to add comment by title and name
* else Invalid request
*/
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

commentsRouter.post("/increment-reputation/:commentId", async (req, res) => {
  const reputation = await incrementReputationByCommentId(Number(req.params.commentId));
  res.json(reputation);
})

export default commentsRouter;
