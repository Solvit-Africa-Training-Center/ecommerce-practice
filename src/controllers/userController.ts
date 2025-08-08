import { Request, Response } from "express";
import { ResponseService } from "../utils/response";
import { GetAllUsers, UserInterface } from "../types/userInterface";
import { Database } from "../database";

interface IRequestUserData extends Request {
  body: GetAllUsers;
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
