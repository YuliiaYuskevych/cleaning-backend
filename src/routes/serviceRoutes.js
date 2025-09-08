import express from 'express';
import {
  getAllServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { isAdmin } from '../middlewares/requireRole.js';

const router = express.Router();

router.get('/', getAllServices);
router.post('/', isAdmin, createService);
router.get('/:id', getServiceById);
router.put('/:id', isAdmin, updateService);
router.delete('/:id', isAdmin, deleteService);

export default router;
