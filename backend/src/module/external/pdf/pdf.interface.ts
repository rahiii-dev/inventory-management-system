import { ICustomerReportDTO, IItemReportDTO, ISalesReportDTO } from "../../report/dto/report.dto";

export interface IPDFService {
    generateSalesReportPdf(report: ISalesReportDTO, filePath: string): Promise<string>;
    generateItemReportPdf(report: IItemReportDTO, filePath: string): Promise<string>;
    generateCustomerReportPdf(report: ICustomerReportDTO, filePath: string): Promise<string>;
}