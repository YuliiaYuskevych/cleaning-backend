import {
  createOrderService,
  updateOrderStatus,
  deleteOrderService,
  findOrderByIdService,
  findAllOrdersService,
  getTotalOrders,
  getOrdersByBranch,
  pickupOrder,
} from '../services/orderService.js';
import { UrgencyEnum } from '../enums/urgencyEnum.js';

export const createOrder = async (req, res) => {
  try {
    const {
      user: userId,
      service: serviceId,
      branch: branchId,
      urgency = UrgencyEnum.MONTH,
    } = req.body;

    if (!serviceId || !branchId) {
      return res
        .status(400)
        .json({ message: 'Missing required fields: service and branch' });
    }

    const targetUserId = userId || req.user._id;

    const order = await createOrderService({
      userId: targetUserId,
      serviceId,
      branchId,
      urgency,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const pickupOrderController = async (req, res) => {
  try {
    const order = await pickupOrder(req.params.id);
    res.status(200).json({ message: 'Order marked as picked up', order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, branch } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (branch) filters.branch = branch;

    const orders = await findAllOrdersService({
      page: parseInt(page),
      limit: parseInt(limit),
      filters,
    });

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await findOrderByIdService(req.params.id, req.user);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const result = await deleteOrderService(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getTotalOrdersCount = async (req, res) => {
  try {
    const total = await getTotalOrders();
    res.status(200).json({ totalOrders: total });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const getOrdersByBranchStats = async (req, res) => {
  try {
    const { branchId } = req.params;
    const stats = await getOrdersByBranch(branchId);
    res.status(200).json(stats);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error retrieving statistics', error: err.message });
  }
};
