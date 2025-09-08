import Branch from '../models/branch.js';

export const findAllBranches = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const branches = await Branch.find().skip(skip).limit(limit).lean();
  const total = await Branch.countDocuments();
  return {
    data: branches,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const createBranch = async (BranchData) => {
  const branch = new Branch(BranchData);
  return await branch.save();
};

export const findBranchById = async (id) => {
  return await Branch.findById(id);
};

export const updateBranch = async (id, updateData) => {
  return await Branch.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteBranch = async (id) => {
  return await Branch.findByIdAndDelete(id);
};
