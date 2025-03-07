import { ISale, PaymentMethod } from "./sale.interface";

export type ReportExportType = "excel" | "pdf" | "print" | "email";

export interface ISalesReport {
    totalSales: number; 
    totalRevenue: number; 
    totalItemsSold: number; 
    averageOrderValue: number; 
    transactions: ISale[];
}

export interface IItemReport {
    productId: string;
    productName: string;
    productDescription?: string;
    totalQuantitySold: number; 
    totalRevenue: number;
    averageSellingPrice: number; 
    salesCount: number; 
    transactions: {
        saleId: string;
        date: Date;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
}


export interface ICustomerReport {
    customerId: string;
    customerName: string;
    totalSpent: number; 
    totalOrders: number;
    transactions: {
        saleId: string;
        date: Date;
        totalAmount: number;
        paymentMethod: PaymentMethod;
        itemsPurchased: number; 
    }[];
}
