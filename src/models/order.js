import mongoose from 'mongoose';
import { OrderStatusEnum } from '../enums/OrderStatusEnum.js';
import { UrgencyEnum } from '../enums/urgencyEnum.js';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
    },
    dateIn: {
      type: Date,
      default: Date.now,
    },
    pickupDate: {
      type: Date,
      default: null,
    },
    totalPrice: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatusEnum),
      default: OrderStatusEnum.RECEIVED,
    },
    urgency: {
      type: String,
      enum: Object.values(UrgencyEnum),
      default: UrgencyEnum.MONTH,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Order', orderSchema);
