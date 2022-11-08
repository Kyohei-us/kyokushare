import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const kyokusRouter = Router();

const prisma = new PrismaClient();

// Get all Kyokus
kyokusRouter.get("/", async (req, res) => {
  const kyokus = await getAllKyokus();
  res.json(kyokus);
});

// Create Kyoku
kyokusRouter.post("/", async (req, res) => {
  if (!req.body.title || !req.body.artist_name) {
    res.json({ message: "request body parameter is invalid" });
  }

  const kyoku = await createKyoku(req.body.title, req.body.artist_name);
  res.json(kyoku);
});

async function getAllKyokus() {
  return await prisma.kyoku.findMany({
    include: {
      artist: {},
    },
  });
}

async function createKyoku(title: string, artist_name: string) {
  const artist = await prisma.artist.findFirst({
    where: {
      name: artist_name,
    },
  });

  // if artist already exists, create kyoku with it
  if (artist) {
    const kyoku = await prisma.kyoku.create({
      data: {
        title: title,
        artistId: artist.id,
      },
    });
    return kyoku;
  } else {
    // else, create artist then create kyoku
    const artist = await prisma.artist.create({
      data: {
        name: artist_name,
      },
    });
    const kyoku = await prisma.kyoku.create({
      data: {
        title: title,
        artistId: artist.id,
      },
    });
    return kyoku;
  }
}

export default kyokusRouter;