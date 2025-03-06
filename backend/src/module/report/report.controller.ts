import { Response } from "express";
import { injectable, inject } from "inversify";
import TYPES from '../../core/container/container.types';
import { AuthRequest } from "../../core/token/user/userRequest";
import asyncWrapper from "../../core/utils/asyncWrapper";
import { IReportService } from "./interfaces/report.service.interface";
import { IPDFService } from "../external/pdf/pdf.interface";
import { IExcelService } from "../external/excel/excel.service.interface";
import path from "path";
import fs from "fs";


@injectable()
export class ReportController {
    @inject(TYPES.ReportService) private reportService!: IReportService;
    @inject(TYPES.PDFService) private PDFService!: IPDFService;
    @inject(TYPES.ExcelService) private excelService!: IExcelService;

    /**
     * @route GET /report/sales
     * @scope Public
     * @desc Get sales Reports
     **/
    public getSalesReports = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const managerId = req.payload?.userId!;
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        const report = await this.reportService.getSalesReport(managerId, new Date(startDate as string), new Date(endDate as string));

        return res.json(report)
    });

    /**
     * @route GET /report/sales/export
     * @scope Public
     * @desc Get sales Reports
     **/
    public exportSalesReport = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const managerId = req.payload?.userId!;
        const { startDate, endDate, type } = req.query;
    
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }
    
        if (!["excel", "pdf"].includes(type as string)) {
            return res.status(400).json({ message: "Invalid report type. Choose 'excel' or 'pdf'." });
        }
    
        const report = await this.reportService.getSalesReport(
            managerId,
            new Date(startDate as string),
            new Date(endDate as string)
        );
    
        const reportsDir = path.join(__dirname, "../../tmp/reports");
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }
    
        const timestamp = Date.now();
        const fileExtension = type === "excel" ? "xlsx" : "pdf";
        const fileName = `sales_report_${timestamp}.${fileExtension}`
        const filePath = path.join(reportsDir, fileName);

        try {
            if (type === "excel") {
                await this.excelService.generateSalesReportExcel(report, filePath);
            } else if (type === "pdf") {
                await this.PDFService.generateSalesReportPdf(report, filePath);
            }

            res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
            res.setHeader("Content-Type", type === "excel" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "application/pdf");
    
            res.download(filePath, (err) => {
                if (!err) {
                    fs.unlink(filePath, (deleteErr) => {
                        if (deleteErr) console.error("Error deleting file:", deleteErr);
                    });
                } else {
                    console.error("Error sending file:", err);
                }
            });
        } catch (error) {
            res.status(500).json({ message: "Failed to generate report" });
        }
    });
}