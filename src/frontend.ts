import { Router } from "express";
import { getAllKyokus, getArtistById, getKyokuFullInfoByKyokuId } from "./dbservices";

const frontendRouter = Router();

frontendRouter.get("/", async (req, res) => {
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const take = req.query.take ? Number(req.query.take) : undefined;
    const kyokus = await getAllKyokus(skip, take);
    const data = {kyokus};
    res.render("./index.ejs", data);
})

frontendRouter.get("/commentsByKyokuId/:id", async (req, res) => {
    const kyoku = await getKyokuFullInfoByKyokuId(Number(req.params.id));
    const data = {
        kyoku,
        comments: kyoku?.comments
    };
    res.render("./comments.ejs", data);
})

frontendRouter.get("/artist/:id", async (req, res) => {
    const artist = await getArtistById(Number(req.params.id));
    const data = {
        artist
    }
    res.render("./artist.ejs", data)
})

export default frontendRouter;