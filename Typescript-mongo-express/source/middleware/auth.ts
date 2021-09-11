import config from "../config";
import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");

declare global {
  namespace Express {
    interface Request {
      user: string;
    }
  }
}

function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied.");

  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

module.exports = auth;
