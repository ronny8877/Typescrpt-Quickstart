import { Router } from "express";
import {
demo
} from "../controllers/user.controller";

const UserRouter = Router();

UserRouter.post("/", demo);


export default UserRouter;