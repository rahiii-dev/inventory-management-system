import { IItemReportDTO, ISalesReportDTO } from "../../report/dto/report.dto";

export interface IExcelService {
    generateSalesReportExcel(report: ISalesReportDTO, filePath: string): Promise<string>;
    generateItemReportExcel(report: IItemReportDTO, filePath: string): Promise<string>;
}