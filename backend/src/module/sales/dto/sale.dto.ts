import mongoose from "mongoose";
import { ICustomer } from "../../customer/customer.modal";
import { ISaleItem, PaymentMethod } from "../sale.modal";

export interface CreateSaleDto {
    managerId: string;
    items: ISaleItem[];
    customer?: string;
    paymentMethod: PaymentMethod;
    totalAmount: number;
}

export interface SaleDTO {
    id: string;
    saleId: string;
    managerId: string;
    items: ISaleItem[];
    customer?: string | ICustomer | mongoose.Types.ObjectId;
    totalAmount: number;
    paymentMethod: PaymentMethod;
}