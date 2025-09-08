import * as userService from '../services/userService.js';

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const users = await userService.findAllUsers({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    if (
      err.message === 'Password must be at least 6 characters long' ||
      err.message === 'User with this email already exists' ||
      err.message === 'Branch is required for managers' ||
      err.message === 'Invalid branch ID' ||
      err.message === 'Users cannot be assigned a branch'
    ) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser)
      return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (err) {
    if (
      err.message === 'Password must be at least 6 characters long' ||
      err.message === 'User with this email already exists' ||
      err.message === 'Branch is required for managers' ||
      err.message === 'Invalid branch ID' ||
      err.message === 'Users cannot be assigned a branch'
    ) {
      res.status(400).json({ message: err.message });
    } else {
      res
        .status(400)
        .json({ message: 'Failed to update user', error: err.message });
    }
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete user', error: err.message });
  }
};
