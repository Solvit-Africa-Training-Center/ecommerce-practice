// controllers/userController.ts
import { Request, Response } from 'express';
import { ResponseService } from '../utils/response';
import { GetAllUsers, UserInterface } from '../types/userInterface';
import { Database } from '../database';
import { IRequestUser } from '../middlewares/authMiddleware';
import { comparePassword, destroyToken, generateToken, hashPassword } from '../utils/helper';
import {
  sendEmailVerification,
  verifyEmail,
  sendPasswordResetEmail,
  resetPassword,
} from '../utils/authHelper';

interface IRequestUserData extends Request {
  body: UserInterface;
}

interface IRequestPasswordReset extends Request {
  body: {
    token: string;
    password: string;
  };
}

interface IRequestEmailData extends Request {
  body: {
    email: string;
  };
}

interface IRequestTokenData extends Request {
  body: {
    token: string;
  };
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
      isEmailVerified: false,
    });

    await user.save();

    // Send email verification
    const emailSent = await sendEmailVerification(user.id);
    if (!emailSent) {
      // User is created but email failed to send
      return ResponseService({
        data: { userId: user.id },
        message: 'User created but failed to send verification email. Please request a new verification email.',
        success: true,
        status: 201,
        res,
      });
    }

    ResponseService({
      data: { userId: user.id },
      message: 'User created successfully. Please check your email to verify your account.',
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

    // Check if email is verified
    if (!user.isEmailVerified) {
      return ResponseService({
        data: { userId: user.id },
        status: 403,
        success: false,
        message: 'Please verify your email address before logging in',
        res,
      });
    }

    const token = await generateToken({ id: user.id, email: user.email, role: user.roleId });

    ResponseService({
      data: { 
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        }
      },
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

export const verifyEmailAddress = async (req: IRequestTokenData, res: Response) => {
  try {
    const { token } = req.body;

    const result = await verifyEmail(token);

    ResponseService({
      data: null,
      status: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
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

export const resendEmailVerification = async (req: IRequestEmailData, res: Response) => {
  try {
    const { email } = req.body;

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

    if (user.isEmailVerified) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: 'Email is already verified',
        res,
      });
    }

    const emailSent = await sendEmailVerification(user.id);
    if (!emailSent) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: 'Failed to send verification email',
        res,
      });
    }

    ResponseService({
      data: null,
      status: 200,
      success: true,
      message: 'Verification email sent successfully',
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

export const requestPasswordReset = async (req: IRequestEmailData, res: Response) => {
  try {
    const { email } = req.body;

    const result = await sendPasswordResetEmail(email);

    ResponseService({
      data: null,
      status: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
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

export const resetUserPassword = async (req: IRequestPasswordReset, res: Response) => {
  try {
    const { token, password } = req.body;

    const result = await resetPassword(token, password);

    ResponseService({
      data: null,
      status: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
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