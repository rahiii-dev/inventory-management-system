import { ICustomerReportDTO, IItemReportDTO, ISalesReportDTO } from "../dto/report.dto";

export interface IReportService {
    getSalesReport(managerId: string, startDate: Date, endDate: Date): Promise<ISalesReportDTO>;
    getItemReport(managerId: string, productId: string, startDate: Date, endDate: Date): Promise<IItemReportDTO>
    getCustomerReport(managerId: string, customerId: string, startDate: Date, endDate: Date): Promise<ICustomerReportDTO>
}
