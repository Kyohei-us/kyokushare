import { Router } from "express";
import { getAllKyokus, getArtistCommentsAuthorsByKyokuId } from "./dbservices";

const frontendRouter = Router();

frontendRouter.get("/", async (req, res) => {
    const kyokus = await getAllKyokus();
    const data = {kyokus};
    res.render("./index.ejs", data);
})

frontendRouter.get("/commentsByKyokuId/:id", async (req, res) => {
    const kyoku = await getArtistCommentsAuthorsByKyokuId(Number(req.params.id));
    const data = {
        kyoku,
        comments: kyoku?.comments
    };
    res.render("./comments.ejs", data);
})

export default frontendRouter;