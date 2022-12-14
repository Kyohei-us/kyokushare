import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Read User
// export async function findAuthor(
//   author_name: string
// ): Promise<User | undefined> {
//   const author = await prisma.user.findFirst({
//     where: {
//       name: author_name,
//     },
//   });
//   if (author) {
//     return author;
//   } else {
//     return undefined;
//   }
// }

export async function findAuthorByEmail(email: string) {
  const userAuth = await prisma.userAuth.findUnique({
    where: {
      email,
    },
    include: {
      user: true
    }
  });
  if (userAuth && userAuth.user) {
    return userAuth.user;
  } else {
    return null;
  }
}

export async function signUpUser(email: string, password: string, username?: string) {
  const saltRounds = 5;
  try {
    const user = await prisma.user.create({
      data: {
        name: username ? username : "",
      },
    });
    const userAuth = await prisma.userAuth.create({
      data: {
        userId: user.id,
        email: email,
        hashedPassword: bcrypt.hashSync(password, saltRounds),
      },
    });
    const userRet = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        userAuth: true,
      },
    });

    return userRet;
  } catch (e) {
    return "error";
  }
}

// export async function deleteAllUsers() {
//   await prisma.reputation.deleteMany({});
//   await prisma.comment.deleteMany({});
//   await prisma.userAuth.deleteMany({});
//   await prisma.user.deleteMany({});
//   return true;
// }

// export async function findUserByName(username: string) {
//   return await prisma.user.findUnique({
//     where: {
//       name: username,
//     },
//     include: {
//       userAuth: true,
//     },
//   });
// }

export async function findUserByEmail(email: string) {
  const userAuth = await prisma.userAuth.findUnique({
    where: {
      email
    },
  });

  if (!userAuth) {
    return null;
  }

  return await prisma.user.findUnique({
    where: {
      id: userAuth.userId
    },
    include: {
      userAuth: true
    }
  });
}

export async function incrementReputationByCommentId(commentId: number) {
  const reputation = await prisma.reputation.update({
    where: {
      commentId: commentId,
    },
    data: {
      points: {
        increment: 1,
      },
    },
  });

  return reputation;
}

export async function geteAllArtists() {
  const artists = await prisma.artist.findMany({});
  return artists;
}

export async function getArtistById(artistId: number) {
  const artist = await prisma.artist.findUnique({
    where: {
      id: artistId,
    },
    include: {
      kyokus: {
        include: {
          comments: {
            include: {
              reputation: true,
            },
          },
        },
      },
    },
  });

  return artist;
}
