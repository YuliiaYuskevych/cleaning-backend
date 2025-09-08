import * as authService from '../services/authService.js';

export const login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
