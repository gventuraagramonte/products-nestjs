import { Schema } from 'mongoose';

export const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  imageURL: String,
  price: Number,
  dateDomain: String,
  daysExp: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
