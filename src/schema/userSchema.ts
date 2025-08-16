// schema/userSchema.ts
import joi from 'joi';

export const AddUserSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

export const LoginUserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const UserParamsSchema = joi.object({
  id: joi.string().min(24),
});

// New schemas for email verification and password reset
export const EmailVerificationSchema = joi.object({
  token: joi.string().required().messages({
    'string.empty': 'Verification token is required',
    'any.required': 'Verification token is required',
  }),
});

export const ResendEmailVerificationSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
});

export const ForgotPasswordSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
});

export const ResetPasswordSchema = joi.object({
  token: joi.string().required().messages({
    'string.empty': 'Reset token is required',
    'any.required': 'Reset token is required',
  }),
  password: joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,})).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
  confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Password confirmation is required',
    'any.required': 'Password confirmation is required',
  }),
});

export const ChangePasswordSchema = joi.object({
  currentPassword: joi.string().required().messages({
    'string.empty': 'Current password is required',
    'any.required': 'Current password is required',
  }),
  newPassword: joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,})).required().messages({
    'string.min': 'New password must be at least 8 characters long', 
    'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'string.empty': 'New password is required',
    'any.required': 'New password is required',
  }),
  confirmNewPassword: joi.string().valid(joi.ref('newPassword')).required().messages({
    'any.only': 'New passwords do not match',
    'string.empty': 'New password confirmation is required',
    'any.required': 'New password confirmation is required',
  }),
});