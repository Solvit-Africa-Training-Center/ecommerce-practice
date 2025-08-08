import { Router } from "express";
import { ValidationMiddleware } from "../middlewares/validationMiddleware";
import { getAllUsers, createUser } from "../controllers/userController";
import { AddUserSchema } from "../schema/userSchema";

const userRouter = Router();

userRouter.get("/users", getAllUsers);
userRouter.post(
  "/users",
  ValidationMiddleware({ type: "body", schema: AddUserSchema }),
  createUser,
);

export { userRouter };
