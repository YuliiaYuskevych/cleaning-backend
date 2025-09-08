import express from 'express';
import {
  createOrder,
  updateStatus,
  getAllOrders,
  getOrderById,
  deleteOrder,
  getTotalOrdersCount,
  getOrdersByBranchStats,
  pickupOrderController,
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/total', getTotalOrdersCount);
router.get('/branch/:branchId/stats', getOrdersByBranchStats);
router.post('/', createOrder);
router.put('/:id', updateStatus);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.delete('/:id', deleteOrder);
router.put('/:id/pickup', pickupOrderController);

export default router;
