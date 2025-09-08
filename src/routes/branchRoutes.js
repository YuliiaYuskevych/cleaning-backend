import express from 'express';
import {
  getAllBranches,
  createBranch,
  getBranchById,
  updateBranch,
  deleteBranch,
} from '../controllers/branchController.js';
import { isAdmin } from '../middlewares/requireRole.js';

const router = express.Router();

router.get('/', getAllBranches);
router.post('/', isAdmin, createBranch);
router.get('/:id', getBranchById);
router.put('/:id', isAdmin, updateBranch);
router.delete('/:id', isAdmin, deleteBranch);

export default router;
