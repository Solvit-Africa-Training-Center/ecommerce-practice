import { Router } from "express";
import { ValidationMiddleware } from "../middlewares/validationMiddleware";
import { getAllUsers } from "../controllers/userController";

const userRouter = Router();

userRouter.get("/users", getAllUsers);

export { userRouter };
