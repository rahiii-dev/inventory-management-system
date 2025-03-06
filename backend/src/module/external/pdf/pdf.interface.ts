import { ISalesReportDTO } from "../../report/dto/report.dto";

export interface IPDFService {
    generateSalesReportPdf(report: ISalesReportDTO, filePath: string): Promise<string>;
}