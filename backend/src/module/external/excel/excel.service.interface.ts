import { ICustomerReportDTO, IItemReportDTO, ISalesReportDTO } from "../../report/dto/report.dto";

export interface IExcelService {
    generateSalesReportExcel(report: ISalesReportDTO, filePath: string): Promise<string>;
    generateItemReportExcel(report: IItemReportDTO, filePath: string): Promise<string>;
    generateCustomerReportExcel(report: ICustomerReportDTO, filePath: string): Promise<string>;
}