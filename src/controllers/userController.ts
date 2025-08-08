import { Request, Response } from "express";
import { ResponseService } from "../utils/response";
import { GetAllUsers, UserInterface } from "../types/userInterface";
import { Database } from "../database";

interface IRequestUserData extends Request {
  body: UserInterface;
}

export const getAllUsers = async (req: IRequestUserData, res: Response) => {
  try {
    const users = await Database.User.findAll();
    if (!users) {
      return ResponseService({
        data: null,
        status: 409,
        success: false,
        message: "No users found",
        res,
      });
    }

    ResponseService<GetAllUsers>({
      data: { users },
      status: 200,
      success: true,
      message: "Users retrieved successfully",
      res,
    });
  } catch (err) {
    const { message, stack } = err as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};

export const createUser = async (req: IRequestUserData, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const role = await Database.Role.findOne({ where: { name: "customer" } });
    if (!role) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: "Default role 'customer' not found",
        res,
      });
    }

    const existingUser = await Database.User.findOne({ where: { email } });
    if (existingUser) {
      return ResponseService({
        data: null,
        status: 409,
        success: false,
        message: "User already exists",
        res,
      });
    }

    const user = await Database.User.create({
      name,
      email,
      password,
      roleId: role.id,
    });

    await user.save();

    ResponseService({
      data: user,
      message: "User created successfully",
      success: true,
      status: 201,
      res,
    });
  } catch (error) {
    const { message, stack } = error as Error;
    ResponseService({
      data: { message, stack },
      status: 500,
      success: false,
      res,
    });
  }
};
