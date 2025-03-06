import { ISale, PaymentMethod } from "../../sales/sale.modal";

export interface ISalesReportDTO {
    totalSales: number; 
    totalRevenue: number; 
    totalItemsSold: number; 
    averageOrderValue: number; 
    transactions: ISale[];
}

export interface IItemReportDTO {
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


export interface ICustomerReportDTO {
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
