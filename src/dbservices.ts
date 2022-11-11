import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllKyokus() {
  return await prisma.kyoku.findMany({
    include: {
      artist: {},
    },
  });
}

export async function createKyoku(title: string, artist_name: string) {
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

export async function getAllComments() {
  return await prisma.comment.findMany({
    include: {
      kyoku: true,
      author: true,
    },
  });
}

export async function getCommentsByKyokuId(id: number) {
  return await prisma.comment.findMany({
    where: {
      kyokuId: id
    },
    include: {
      kyoku: true,
      author: true,
    },
  });
}

export async function addComment(
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

export async function findOrCreateAuthor(author_name: string): Promise<User> {
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
