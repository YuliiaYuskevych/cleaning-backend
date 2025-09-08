import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { UserRoleEnum } from '../enums/userRoleEnum.js';

const ERROR_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required and cannot be empty',
  PASSWORD_REQUIRED: 'Password is required and cannot be empty',
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
  ACCESS_DENIED: 'Access denied: Only managers or admins can log in',
};

const validateUserInput = ({ email, password }) => {
  if (!email || email.trim() === '') {
    throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);
  }
  if (!password || password.trim() === '') {
    throw new Error(ERROR_MESSAGES.PASSWORD_REQUIRED);
  }
};

export const login = async ({ email, password }) => {
  validateUserInput({ email, password });

  const user = await User.findOne({ email });

  if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

  if (![UserRoleEnum.MANAGER, UserRoleEnum.ADMIN].includes(user.role)) {
    throw new Error(ERROR_MESSAGES.ACCESS_DENIED);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    },
  );

  return { user: { ...user.toObject(), role: user.role }, token };
};
