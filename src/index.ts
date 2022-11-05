import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json())

// Get all Kyokus
app.get("/kyokus", async (req, res) => {
  const kyokus = await prisma.kyoku.findMany({
    include: {
      artist: {}
    }
  });
  res.json(kyokus);
});

// Create Kyoku
app.post("/kyokus", async (req, res) => {
  if (!req.body.title || !req.body.artist_name){
    res.json({"message": "request body parameter is invalid"})
  }

  const artist = await prisma.artist.findFirst({
    where: {
      name: req.body.artist_name
    }
  });

  // if artist already exists, create kyoku with it
  if (artist){
    const kyoku = await prisma.kyoku.create({
      data: {
        title: req.body.title,
        artistId: artist.id,
      }
    });
    res.json(kyoku);
  } else {
    // else, create artist then create kyoku
    const artist = await prisma.artist.create({
      data: {
        name: req.body.artist_name
      }
    });
    const kyoku = await prisma.kyoku.create({
      data: {
        title: req.body.title,
        artistId: artist.id,
      }
    });
    res.json(kyoku);
  }
})

app.get("/", async (req, res) => {
  res.json({ message: "Home Page" });
});

const server = app.listen(process.env.PORT, () =>
  console.log("🚀 Server ready at: http://localhost:" + process.env.PORT)
);
