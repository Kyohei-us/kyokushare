import { PrismaClient } from "@prisma/client";
import { findAuthor } from "./dbservices";

const prisma = new PrismaClient();

// Read
// Create? Reputation
export async function getAllComments() {
  const comments = await prisma.comment.findMany({
    include: {
      kyoku: true,
      author: true,
      reputation: true,
    },
  });

  // If comment does not have reputation,
  // init reputation
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    if (!comment.reputation) {
      await prisma.reputation.create({
        data: {
          points: 0,
          commentId: comment.id,
        },
      });
    }
  }

  return await prisma.comment.findMany({
    include: {
      kyoku: true,
      author: true,
      reputation: true,
    },
  });
}

// Read
export async function getCommentsByKyokuId(id: number) {
  return await prisma.comment.findMany({
    where: {
      kyokuId: id,
    },
    include: {
      kyoku: true,
      author: true,
      reputation: true,
    },
  });
}

// Create? Comment
// Create? Reputation
export async function addComment(
  author_name: string,
  kyoku_title: string,
  artist_name: string,
  body: string
) {
  // get kyoku (Kyoku)
  const kyoku = await prisma.kyoku.findFirst({
    where: {
      title: kyoku_title,
      artist: {
        name: artist_name,
      },
    },
  });

  if (!kyoku) {
    return { message: "Kyoku with given title/artist name not found" };
  }

  // get author (User)
  const author = await findAuthor(author_name);
  if (!author) {
    return { message: "Author with the name not found" };
  }

  // create comment
  const commentTemp = await prisma.comment.create({
    data: {
      body: body,
      authorId: author.id,
      kyokuId: kyoku.id,
    },
  });

  const reputation = await prisma.reputation.create({
    data: {
      points: 0,
      commentId: commentTemp.id,
    },
  });

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentTemp.id,
    },
    include: {
      reputation: true,
    },
  });
  return comment;
}

// Create? Comment
// Create? Reputation
export async function addCommentByKyokuId(
  author_name: string,
  kyoku_id: number,
  body: string
) {
  // get kyoku (Kyoku)
  const kyoku = await prisma.kyoku.findUnique({
    where: {
      id: kyoku_id,
    },
  });

  if (!kyoku) {
    return { message: "Kyoku with given id not found" };
  }

  // get author (User)
  const author = await findAuthor(author_name);
  if (!author) {
    return { message: "Author with the name not found" };
  }

  // create comment
  const commentTemp = await prisma.comment.create({
    data: {
      body: body,
      authorId: author.id,
      kyokuId: kyoku.id,
    },
  });

  const reputation = await prisma.reputation.create({
    data: {
      points: 0,
      commentId: commentTemp.id,
    },
  });

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentTemp.id,
    },
    include: {
      reputation: true,
    },
  });
  return comment;
}
