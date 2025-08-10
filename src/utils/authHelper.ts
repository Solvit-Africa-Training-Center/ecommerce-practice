// utils/authHelper.ts
import { config } from 'dotenv';
import crypto from 'crypto';
import { Database } from '../database';
import { emailService } from './emailService';
import { errorLogger } from './logger';

config();

interface TokenData {
  token: string;
  expires: Date;
}

export const generateEmailVerificationToken = (): TokenData => {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return { token, expires };
};

export const generatePasswordResetToken = (): TokenData => {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return { token, expires };
};

export const sendEmailVerification = async (userId: string): Promise<boolean> => {
  try {
    const user = await Database.User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.isEmailVerified) {
      throw new Error('Email already verified');
    }

    const { token, expires } = generateEmailVerificationToken();

    // Update user with verification token
    await user.update({
      emailVerificationToken: token,
      emailVerificationExpires: expires,
    });

    // Send verification email
    const emailSent = await emailService.sendEmailVerification(
      user.email,
      user.name,
      token
    );

    if (!emailSent) {
      throw new Error('Failed to send verification email');
    }

    return true;
  } catch (error) {
    errorLogger(error as Error, 'Send Email Verification');
    return false;
  }
};

export const verifyEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await Database.User.findOne({
      where: {
        emailVerificationToken: token,
      },
    });

    if (!user) {
      return { success: false, message: 'Invalid or expired verification token' };
    }

    if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      return { success: false, message: 'Verification token has expired' };
    }

    if (user.isEmailVerified) {
      return { success: false, message: 'Email is already verified' };
    }

    // Update user as verified
    await user.update({
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    return { success: true, message: 'Email verified successfully' };
  } catch (error) {
    errorLogger(error as Error, 'Verify Email');
    return { success: false, message: 'An error occurred during email verification' };
  }
};

export const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await Database.User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists or not for security
      return { success: true, message: 'If an account with that email exists, we have sent a password reset link' };
    }

    if (!user.isEmailVerified) {
      return { success: false, message: 'Please verify your email address first' };
    }

    const { token, expires } = generatePasswordResetToken();

    // Update user with reset token
    await user.update({
      passwordResetToken: token,
      passwordResetExpires: expires,
    });

    // Send reset email
    const emailSent = await emailService.sendPasswordReset(
      user.email,
      user.name,
      token
    );

    if (!emailSent) {
      throw new Error('Failed to send password reset email');
    }

    return { success: true, message: 'Password reset link sent to your email' };
  } catch (error) {
    errorLogger(error as Error, 'Send Password Reset Email');
    return { success: false, message: 'An error occurred while sending the password reset email' };
  }
};

export const resetPassword = async (
  token: string, 
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await Database.User.findOne({
      where: {
        passwordResetToken: token,
      },
    });

    if (!user) {
      return { success: false, message: 'Invalid or expired reset token' };
    }

    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return { success: false, message: 'Reset token has expired' };
    }

    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await user.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    // Send confirmation email
    await emailService.sendPasswordResetConfirmation(user.email, user.name);

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    errorLogger(error as Error, 'Reset Password');
    return { success: false, message: 'An error occurred while resetting the password' };
  }
};