import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  managerId: string | Types.ObjectId;
  price: number;
  quantity: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    managerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);


const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
