import { Router } from "express";
import { getAllKyokus } from "./dbservices";

const frontendRouter = Router();

frontendRouter.get("/", async (req, res) => {
    const kyokus = await getAllKyokus();
    const data = {kyokus: kyokus};
    res.render("./index.ejs", data);
})

export default frontendRouter;