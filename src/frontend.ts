import { Router } from "express";
import { getAllComments, getAllKyokus, getCommentsByKyokuId } from "./dbservices";

const frontendRouter = Router();

frontendRouter.get("/", async (req, res) => {
    const kyokus = await getAllKyokus();
    const data = {kyokus};
    res.render("./index.ejs", data);
})

frontendRouter.get("/comments/:id", async (req, res) => {
    const comments = await getCommentsByKyokuId(Number(req.params.id));
    const data = {comments};
    res.render("./comments.ejs", data);
})

export default frontendRouter;