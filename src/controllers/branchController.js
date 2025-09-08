import * as branchService from '../services/branchService.js';

export const getAllBranches = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const branches = await branchService.findAllBranches({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.status(200).json(branches);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createBranch = async (req, res) => {
  try {
    const newBranch = await branchService.createBranch(req.body);
    res.status(201).json(newBranch);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to create branch', error: err.message });
  }
};

export const getBranchById = async (req, res) => {
  try {
    const branch = await branchService.findBranchById(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.status(200).json(branch);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const updatedBranch = await branchService.updateBranch(
      req.params.id,
      req.body,
    );
    if (!updatedBranch)
      return res.status(404).json({ message: 'Branch not found' });
    res.status(200).json(updatedBranch);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to update branch', error: err.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const deletedBranch = await branchService.deleteBranch(req.params.id);
    if (!deletedBranch)
      return res.status(404).json({ message: 'Branch not found' });
    res.status(200).json({ message: 'Branch deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete branch', error: err.message });
  }
};
