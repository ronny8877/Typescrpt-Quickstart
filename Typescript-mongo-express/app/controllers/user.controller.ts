import { Request, Response, NextFunction } from "express";
import {
    userCreateValidator,
  } from "../validators/user.validator";



const demo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = userCreateValidator.validate(req.body);
      if (error) {
        throw ApiError.BadRequestError({ message: error.message });
      }
  
      let user = await User.findOne({
        $or: [
          { email: req.body.email },
          { username: req.body.username }
        ]
      });
      if (user) {
        throw ApiError.BadRequestError({ message: "Email already exists" });
      }
  
      //password is hased before saving
      const newUser = new User(req.body);
      await newUser.save();
      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      next(error);
    }
  };


  export { demo};