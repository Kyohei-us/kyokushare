import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

// Read
export async function getAllKyokus() {
  return await prisma.kyoku.findMany({
    include: {
      artist: true,
      comments: true
    },
  });
}

// Read
export async function getKyokusByArtistId(artistId: number) {
  return await prisma.kyoku.findMany({
    where: {
      artistId: artistId,
    },
    include: {
      artist: {},
    },
  });
}

// Create? Artist
// Create? Kyoku
export async function createKyokuIfNotExists(
  title: string,
  artist_name: string
) {
  const artist = await prisma.artist.findFirst({
    where: {
      name: artist_name,
    },
  });

  // if artist already exists, create kyoku with it
  if (artist) {
    const kyokuIfExists = await prisma.kyoku.findFirst({
      where: {
        title: title,
        artistId: artist.id,
      },
    });

    if (kyokuIfExists) {
      return kyokuIfExists;
    }

    // If Kyoku not exists
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

// Read
export async function getKyokuFullInfoByKyokuId(id: number) {
  return await prisma.kyoku.findUnique({
    where: {
      id: id,
    },
    include: {
      artist: true,
      comments: {
        include: {
          author: true,
          reputation: true,
        },
      },
    },
  });
}

// Create? User
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
  const author = await findOrCreateAuthor(author_name);

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

// Create? User
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
  const author = await findOrCreateAuthor(author_name);

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

// Create? User
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

export async function incrementReputationByCommentId(commentId: number) {
  const reputation = await prisma.reputation.update({
    where: {
      commentId: commentId
    },
    data: {
      points: {
        increment: 1
      }
    }
  });

  return reputation;
}

// Update Reputation
async function incrementReputationById(reputationId: number) {
  const reputation = await prisma.reputation.update({
    where: {
      id: reputationId
    },
    data: {
      points: {
        increment: 1
      }
    }
  });

  return reputation;
} 