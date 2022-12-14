import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
        res.locals.email = decoded.email;
      }
      console.log(`Decoded: ${decoded}`);
      next();
    } catch (e) {
      res.status(401);
      res.json({message: "Not authenticated."});
    }
  }

/**
 * Return username if logged in.
 * Otherwise return empty string.
 * @param req: Request
 * @returns username: string
 */
export function getUsernameIfLoggedIn(req: Request): string {
  try {
    const token = req.cookies["userjwt"];
    if (!token) {
      console.log("JWT not found in cookie.");
      return "";
    } 

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ? process.env.JWT_SECRET : ""
    );

    if (typeof decoded === "string") {
      return decoded;
    } else {
      return decoded.username;
    }
  } catch (e) {
    console.log(e);
    return "";
  }
}

/**
 * Return email if logged in.
 * Otherwise return empty string.
 * @param req: Request
 * @returns email: string
 */
export function getEmailIfLoggedIn(req: Request): string {
  try {
    const token = req.cookies["userjwt"];
    if (!token) {
      console.log("JWT not found in cookie.");
      return "";
    } 

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ? process.env.JWT_SECRET : ""
    );

    if (typeof decoded === "string") {
      return decoded;
    } else {
      return decoded.email;
    }
  } catch (e) {
    console.log(e);
    return "";
  }
}