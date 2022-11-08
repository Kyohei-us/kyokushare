import { PrismaClient, User } from "@prisma/client";
import { Router } from "express";

const commentsRouter = Router();

const prisma = new PrismaClient();

// Get all comments
commentsRouter.get("/comments", async (req, res) => {
  const comments = await prisma.comment.findMany({
    include: {
      kyoku: true,
      author: true,
    },
  });
  res.json(comments);
});

// Create comment
commentsRouter.post("/comments", async (req, res) => {
  if (!req.body.author_name || !req.body.kyoku_title || !req.body.body) {
    res.json({ message: "Invalid request body" });
  }

  const response = await addComment(
    req.body.author_name,
    req.body.kyoku_title,
    req.body.body
  );
  res.json(response);
});

async function addComment(
  author_name: string,
  kyoku_title: string,
  body: string
) {
  // get author (User)
  const author = await findOrCreateAuthor(author_name);

  // get kyoku (Kyoku)
  const kyoku = await prisma.kyoku.findFirst({
    where: {
      title: kyoku_title,
    },
  });

  if (!kyoku) {
    return { message: "Kyoku with given title not found" };
  }

  // create comment
  const comment = await prisma.comment.create({
    data: {
      body: body,
      authorId: author.id,
      kyokuId: kyoku.id,
    },
  });
  return comment;
}

async function findOrCreateAuthor(author_name: string): Promise<User> {
  const author = await prisma.user.findFirst({
    where: {
      name: author_name,
    },
  });
  if (author) {
    return author;
  } else {
    return await prisma.user.create({
      data: {
        name: author_name,
      },
    });
  }
}

export default commentsRouter;
