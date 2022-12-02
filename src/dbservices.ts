import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    // const bearToken = req.headers["authorization"];
    // const bearer = bearToken?.split(" ");
    // const token = bearer && bearer[1] ? bearer[1] : "";
    const token = req.cookies["userjwt"];
    if (!token) {
      throw new Error("JWT not found in cookie");
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET ? process.env.JWT_SECRET : "");
  
    if (typeof decoded === "string") {
      res.locals.username = decoded;
    } else {
      res.locals.username = decoded.username;
    }
    console.log(`Username: ${decoded}`);
    next();
  } catch (e) {
    res.status(401);
    res.json({message: "Not authenticated."});
  }
}

// Read User
export async function findAuthor(
  author_name: string
): Promise<User | undefined> {
  const author = await prisma.user.findFirst({
    where: {
      name: author_name,
    },
  });
  if (author) {
    return author;
  } else {
    return undefined;
  }
}

export async function signUpUser(username: string, password: string) {
  const saltRounds = 5;
  try {
    const user = await prisma.user.create({
      data: {
        name: username,
      },
    });
    const userAuth = await prisma.userAuth.create({
      data: {
        userId: user.id,
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

export async function findUserByName(username: string) {
  return await prisma.user.findUnique({
    where: {
      name: username,
    },
    include: {
      userAuth: true,
    },
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
