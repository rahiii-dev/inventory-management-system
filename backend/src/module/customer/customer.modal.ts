import { Schema, model, Document, Types } from "mongoose";

export interface IAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface ICustomer extends Document {
    managerId: string | Types.ObjectId;
    fullName: string;
    mobile: string;
    address: IAddress;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
    {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    { _id: false }
);

const CustomerSchema = new Schema<ICustomer>(
    {
        managerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        fullName: { type: String, required: true, trim: true },
        mobile: { type: String, required: true, unique: true },
        address: { type: AddressSchema, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Customer = model<ICustomer>("Customer", CustomerSchema);
