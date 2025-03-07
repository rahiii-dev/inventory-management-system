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
import { IEmailService } from "../external/email/email.service.interface";

const EXPORT_OPTIONS = ["pdf", "excel"]

@injectable()
export class ReportController {
    @inject(TYPES.ReportService) private reportService!: IReportService;
    @inject(TYPES.PDFService) private PDFService!: IPDFService;
    @inject(TYPES.ExcelService) private excelService!: IExcelService;
    @inject(TYPES.EmailService) private emailService!: IEmailService;

    /**
    * @route GET /report/customer
    * @scope Public
    * @desc Get customer Report
    **/
    public getCustomerReports = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const managerId = req.payload?.userId!;
        const { startDate, endDate, customerId } = req.query;
        if (!customerId) {
            return res.status(400).json({ message: "Customer is required" });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        const report = await this.reportService.getCustomerReport(
            managerId,
            customerId as string,
            new Date(startDate as string),
            new Date(endDate as string)
        );

        return res.json(report)
    });

    /**
    * @route GET /report/customer/export
    * @scope Public
    * @desc Get export customer Reports
    **/
    public exportCustomerReport = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const managerId = req.payload?.userId!;
        const { startDate, endDate, type, email, customerId } = req.query;

        if (!customerId) {
            return res.status(400).json({ message: "Customer is required" });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        if (!EXPORT_OPTIONS.includes(type as string)) {
            return res.status(400).json({ message: `Invalid report type. Choose any of ${EXPORT_OPTIONS.join(", ")}.` });
        }

        const report = await this.reportService.getCustomerReport(
            managerId,
            customerId as string,
            new Date(startDate as string),
            new Date(endDate as string)
        );


        const reportsDir = path.join(__dirname, "../../tmp/reports");
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const timestamp = Date.now();
        const fileExtension = type === "excel" ? "xlsx" : "pdf";
        const fileName = `customer_report_${timestamp}.${fileExtension}`
        const filePath = path.join(reportsDir, fileName);

        try {
            if (type === "excel") {
                await this.excelService.generateCustomerReportExcel(report, filePath);
            } else if (type === "pdf") {
                await this.PDFService.generateCustomerReportPdf(report, filePath);
            }

            if (email) {
                await this.emailService.sendMail({
                    to: email as string,
                    subject: "Your Customer Report",
                    text: "Please find the attached customer report.",
                    attachments: [{ filename: fileName, path: filePath }],
                });

                fs.unlink(filePath, (deleteErr) => {
                    if (deleteErr) console.error("Error deleting file:", deleteErr);
                });

                return res.json({ message: "Report emailed successfully!" })
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

    /**
    * @route GET /report/item
    * @scope Public
    * @desc Get item Report
    **/
    public getItemReports = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const managerId = req.payload?.userId!;
        const { startDate, endDate, productId } = req.query;
        if (!productId) {
            return res.status(400).json({ message: "Product is reuired" });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        const report = await this.reportService.getItemReport(
            managerId,
            productId as string,
            new Date(startDate as string),
            new Date(endDate as string)
        );

        return res.json(report)
    });

    /**
    * @route GET /report/item/export
    * @scope Public
    * @desc Get export item Reports
 **/
    public exportItemReport = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const managerId = req.payload?.userId!;
        const { startDate, endDate, type, email, productId } = req.query;

        if (!productId) {
            return res.status(400).json({ message: "Product is reuired" });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        if (!EXPORT_OPTIONS.includes(type as string)) {
            return res.status(400).json({ message: `Invalid report type. Choose any of ${EXPORT_OPTIONS.join(", ")}.` });
        }

        const report = await this.reportService.getItemReport(
            managerId,
            productId as string,
            new Date(startDate as string),
            new Date(endDate as string)
        );


        const reportsDir = path.join(__dirname, "../../tmp/reports");
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const timestamp = Date.now();
        const fileExtension = type === "excel" ? "xlsx" : "pdf";
        const fileName = `item_report_${timestamp}.${fileExtension}`
        const filePath = path.join(reportsDir, fileName);

        try {
            if (type === "excel") {
                await this.excelService.generateItemReportExcel(report, filePath);
            } else if (type === "pdf") {
                await this.PDFService.generateItemReportPdf(report, filePath);
            }

            if (email) {
                await this.emailService.sendMail({
                    to: email as string,
                    subject: "Your Item Report",
                    text: "Please find the attached item report.",
                    attachments: [{ filename: fileName, path: filePath }],
                });

                fs.unlink(filePath, (deleteErr) => {
                    if (deleteErr) console.error("Error deleting file:", deleteErr);
                });

                return res.json({ message: "Report emailed successfully!" })
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
        const { startDate, endDate, type, email } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        if (!EXPORT_OPTIONS.includes(type as string)) {
            return res.status(400).json({ message: `Invalid report type. Choose any of ${EXPORT_OPTIONS.join(", ")}.` });
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

            if (email) {
                await this.emailService.sendMail({
                    to: email as string,
                    subject: "Your Sales Report",
                    text: "Please find the attached sales report.",
                    attachments: [{ filename: fileName, path: filePath }],
                });

                fs.unlink(filePath, (deleteErr) => {
                    if (deleteErr) console.error("Error deleting file:", deleteErr);
                });

                return res.json({ message: "Report emailed successfully!" })
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