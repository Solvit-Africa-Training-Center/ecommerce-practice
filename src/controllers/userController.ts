
import { Request, Response } from 'express';
import { ResponseService } from '../utils/response';
import { GetAllUsers, UserInterface } from '../types/userInterface';
import { Database } from '../database';
import { IRequestUser } from '../middlewares/authMiddleware';
import { comparePassword, destroyToken, generateToken, hashPassword } from '../utils/helper';

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
        message: 'No users found',
        res,
      });
    }

    ResponseService<GetAllUsers>({
      data: { users },
      status: 200,
      success: true,
      message: 'Users retrieved successfully',
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

    const role = await Database.Role.findOne({ where: { name: 'customer' } });
    if (!role) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: 'Default role "customer" not found',
        res,
      });
    }

    const existingUser = await Database.User.findOne({ where: { email } });
    if (existingUser) {
      return ResponseService({
        data: null,
        status: 409,
        success: false,
        message: 'User already exists',
        res,
      });
    }

    const user = await Database.User.create({
      name,
      email,
      password: await hashPassword(password),
      roleId: role.id,
    });

    await user.save();

    ResponseService({
      data: user,
      message: 'User created successfully',
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

export const loginUser = async (req: IRequestUserData, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await Database.User.findOne({ where: { email } });
    if (!user) {
      return ResponseService({
        data: null,
        status: 404,
        success: false,
        message: 'User not found',
        res,
      });
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: 'Invalid email or password',
        res,
      });
    }

    const token = await generateToken({ id: user.id, email: user.email, role: user.roleId });

    ResponseService({
      data: { token },
      status: 200,
      success: true,
      message: 'Login successful',
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

export const logoutUser = async (req: IRequestUser, res: Response) => {
  try {
    const token = req.token;

    await destroyToken(token);

    ResponseService({
      data: null,
      status: 200,
      success: true,
      message: 'Logout successful',
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
