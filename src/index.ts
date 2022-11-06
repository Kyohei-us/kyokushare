import { Kyoku, PrismaClient, User } from "@prisma/client";
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

// Get all comments
app.get("/comments", async (req, res) => {
  const comments = await prisma.comment.findMany({
    include: {
      kyoku: true,
      author: true,
    }
  });
  res.json(comments);
})

// Create comment
app.post("/comments", async (req, res) => {
  if (!req.body.author_name || !req.body.kyoku_title || !req.body.body){
    res.json({"message": "Invalid request body"})
  }

  const response = await addComment(req.body.author_name, req.body.kyoku_title, req.body.body);
  res.json(response);
})

app.get("/", async (req, res) => {
  res.json({ message: "Home Page" });
});

const server = app.listen(process.env.PORT, () =>
  console.log("🚀 Server ready at: http://localhost:" + process.env.PORT)
);

async function addComment(author_name: string, kyoku_title: string, body: string){
    // get author (User)
    const author = await findOrCreateAuthor(author_name);
  
    // get kyoku (Kyoku)
    const kyoku = await prisma.kyoku.findFirst({
      where: {
        title: kyoku_title
      }
    });

    if (!kyoku){ 
      return {"message": "Kyoku with given title not found"};
    }

    // create comment
    const comment = await prisma.comment.create({
      data: {
        body: body,
        authorId: author.id,
        kyokuId: kyoku.id
      }
    });
    return comment;
}

async function findOrCreateAuthor(author_name: string): Promise<User>{
  const author = await prisma.user.findFirst({
    where: {
      name: author_name
    }
  });
  if (author){
    return author;
  } else {
    return await prisma.user.create({
      data: {
        name: author_name
      }
    })
  }
}
