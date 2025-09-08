import mongoose from 'mongoose';
import { DifficultyServiceEnum } from '../enums/difficultyServiceEnum.js';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    difficulty: {
      type: String,
      enum: Object.values(DifficultyServiceEnum),
      default: DifficultyServiceEnum.SIMPLE,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Service', serviceSchema);
