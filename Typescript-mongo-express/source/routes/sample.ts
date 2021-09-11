import { NextFunction, Request, Response } from "express";
const express = require("express");
const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  //setting x-auth-token
  res.setHeader("x-auth-token", "Hello World").send("Hello World");
});

router.post("/:message", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "You said: " + req.params.message,
  });
});

module.exports = router;
