import User from '../models/user.js';
import Branch from '../models/branch.js';

import { UserRoleEnum } from '../enums/userRoleEnum.js';

export const findAllUsers = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const users = await User.find().skip(skip).limit(limit).lean();
  const total = await User.countDocuments();
  return {
    data: users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const createUser = async (userData) => {
  const { email, role, branch, password } = userData;

  if (password && password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  if (role === UserRoleEnum.MANAGER) {
    if (!branch) {
      throw new Error('Branch is required for managers');
    }
    const branchExists = await Branch.findById(branch);
    if (!branchExists) {
      throw new Error('Invalid branch ID');
    }
  }

  if (role === UserRoleEnum.USER && branch) {
    throw new Error('Users cannot be assigned a branch');
  }

  const user = new User({ ...userData, role: role || UserRoleEnum.USER });
  return await user.save();
};

export const findUserById = async (id) => {
  return await User.findById(id);
};

export const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};
