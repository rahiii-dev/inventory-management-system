import { ICustomer } from "./customer.interface";

export interface ISaleItem {
    product: string;
    productName: string;
    productDescription: string;
    quantity: number;
    price: number;
    total: number;
}

export type PaymentMethod = "Cash" | "Customer";

export interface ISale {
    id: string;
    saleId: string;
    managerId: string;
    items: ISaleItem[];
    customer?: string | ICustomer;
    totalAmount: number;
    paymentMethod: PaymentMethod;
}