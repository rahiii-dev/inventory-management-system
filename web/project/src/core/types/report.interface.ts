import { ISale } from "./sale.interface";

export type ReportExportType = "excel" | "pdf" | "print" | "email";

export interface ISalesReport {
    totalSales: number; 
    totalRevenue: number; 
    totalItemsSold: number; 
    averageOrderValue: number; 
    transactions: ISale[];
}

