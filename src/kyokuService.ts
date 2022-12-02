import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Read
export async function getAllKyokus(skip?: number, take?: number) {
  return await prisma.kyoku.findMany({
    skip,
    take,
    include: {
      artist: true,
      comments: {
        include: {
          reputation: true,
        },
      },
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

// Create? Artist
// Create? Kyoku
export async function createKyokuIfNotExists(
  title: string,
  artist_name: string,
  userId: number
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
        userId,
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
        userId,
      },
    });
    return kyoku;
  }
}
