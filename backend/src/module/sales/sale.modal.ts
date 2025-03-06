import mongoose, { Schema, Document } from "mongoose";

export enum PaymentMethod {
  CASH = "Cash",
  CUSTOMER = "Customer",
}

export interface ISaleItem {
  product: mongoose.Types.ObjectId | string;
  productName: string; 
  productDescription: string; 
  quantity: number;
  price: number;
  total: number; 
}

export interface ISale extends Document {
  saleId: string;
  managerId: string | mongoose.Types.ObjectId;
  items: ISaleItem[];
  customer?: mongoose.Types.ObjectId | string; 
  totalAmount: number;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

const SaleSchema = new Schema<ISale>(
  {
    saleId: { type: String, unique: true, required: true },
    managerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        productName: { type: String, required: true },
        productDescription: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: false },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISale>("Sale", SaleSchema);
