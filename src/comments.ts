import { Router } from "express";
import { getAllComments, addCommentByKyokuId, addComment } from "./commentService";
import { incrementReputationByCommentId } from "./dbservices";
import { isAuthenticated } from "./userAuthService";

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
commentsRouter.post("/", isAuthenticated, async (req, res) => {
  if (res.locals.email && req.body.kyoku_id && req.body.body) {
    const response = await addCommentByKyokuId(
      res.locals.email,
      Number(req.body.kyoku_id),
      req.body.body
    );
    res.json(response);
  } else if (
    req.body.email &&
    req.body.kyoku_title &&
    req.body.artist_name &&
    req.body.body
  ) {
    const response = await addComment(
      req.body.email,
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
