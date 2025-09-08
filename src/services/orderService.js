import User from '../models/user.js';
import Service from '../models/service.js';
import Order from '../models/order.js';
import calculatePrice from '../utils/calculatePrice.js';
import { OrderStatusEnum } from '../enums/OrderStatusEnum.js';
import mongoose from 'mongoose';

export const createOrderService = async ({
  userId,
  serviceId,
  branchId,
  urgency,
}) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const service = await Service.findById(serviceId);
  if (!service) throw new Error('Service not found');

  const price = calculatePrice({ service, urgency, user });

  const order = new Order({
    user: userId,
    service: serviceId,
    branch: branchId,
    urgency,
    totalPrice: price,
  });

  await order.save();

  user.visitsCount += 1;
  await user.save();

  return order;
};

export const pickupOrder = async (orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) throw new Error('Order not found');
    if (order.status !== OrderStatusEnum.DONE)
      throw new Error("Order can only be picked up if status is 'done'");

    const result = await Order.updateOne(
      { _id: orderId },
      { $set: { status: OrderStatusEnum.PICKED_UP, pickupDate: new Date() } },
      { session },
    );
    if (result.modifiedCount === 0) throw new Error('Order not updated');

    const updatedOrder = await Order.findById(orderId).session(session);
    if (!updatedOrder || updatedOrder.status !== OrderStatusEnum.PICKED_UP) {
      throw new Error('Failed to verify status update');
    }
    await session.commitTransaction();
    return updatedOrder;
  } catch (err) {
    await session.abortTransaction();
    console.error('Pickup error:', err);
    throw err;
  } finally {
    session.endSession();
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const validStatuses = Object.values(OrderStatusEnum);
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Invalid order status');
  }

  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  if (
    newStatus === OrderStatusEnum.PICKED_UP &&
    order.status !== OrderStatusEnum.DONE
  ) {
    throw new Error(
      "Status can only be set to 'picked_up' if current status is 'done'",
    );
  }

  order.status = newStatus;

  if (newStatus === OrderStatusEnum.PICKED_UP) {
    order.pickupDate = new Date();
  } else if (newStatus !== OrderStatusEnum.PICKED_UP && order.pickupDate) {
    order.pickupDate = null;
  }

  return await order.save();
};

export const findAllOrdersService = async ({
  page = 1,
  limit = 20,
  filters = {},
}) => {
  const skip = (page - 1) * limit;

  let query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.branch) {
    query.branch = filters.branch;
  }

  const orders = await Order.find(query)
    .populate('user', 'email')
    .populate('service', 'name')
    .populate('branch', 'name')
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Order.countDocuments(query);

  return {
    data: orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const findOrderByIdService = async (orderId, user) => {
  const order = await Order.findById(orderId)
    .populate('user', 'email')
    .populate('service', 'name')
    .populate('branch', 'name');
  if (!order) throw new Error('Order not found');

  return order;
};

export const deleteOrderService = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  await order.deleteOne();
  return { message: 'Order deleted successfully' };
};

export const getTotalOrders = async () => {
  return await Order.countDocuments();
};

export const getOrdersByBranch = async (branchId) => {
  if (!mongoose.Types.ObjectId.isValid(branchId)) {
    throw new Error('Invalid branch ID');
  }

  const result = await Order.aggregate([
    { $match: { branch: new mongoose.Types.ObjectId(branchId) } },
    { $group: { _id: '$branch', count: { $sum: 1 } } },
    {
      $lookup: {
        from: 'branches',
        localField: '_id',
        foreignField: '_id',
        as: 'branch',
      },
    },
    { $unwind: '$branch' },
    {
      $project: {
        _id: 0,
        branchId: '$_id',
        branchName: '$branch.name',
        count: 1,
      },
    },
  ]);

  return result.length > 0
    ? result[0]
    : { branchId, branchName: 'Unknown', count: 0 };
};
