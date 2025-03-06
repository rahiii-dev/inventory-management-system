import { ISalesReportDTO } from "../dto/report.dto";

export interface IReportService {
    getSalesReport(managerId: string, startDate: Date, endDate: Date): Promise<ISalesReportDTO>;
    // getItemReport(startDate: Date, endDate: Date): Promise<IItemReportResponse>;
    // getCustomerReport(customerId: string, startDate: Date, endDate: Date): Promise<ICustomerReportResponse>;
}
