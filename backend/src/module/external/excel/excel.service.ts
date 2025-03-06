import { injectable } from "inversify";
import { IExcelService } from "./excel.service.interface";
import { ISalesReportDTO } from "../../report/dto/report.dto";
import ExcelJS from "exceljs";
import { formatDate } from "../../../core/utils/helper";


@injectable()
export class ExcelService implements IExcelService {

    async generateSalesReportExcel(report: ISalesReportDTO, filePath: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const workbook = new ExcelJS.Workbook();
                const sheet = workbook.addWorksheet("Sales Report");

                // **Header Styling**
                const headerStyle = {
                    font: { bold: true, color: { argb: "FFFFFF" } },
                    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "007ACC" } },
                    alignment: { horizontal: "center" },
                    border: { top: { style: "thin" }, bottom: { style: "thin" } }
                };

                // **Summary Section**
                sheet.addRow(["Sales Report"]).font = { bold: true, size: 16 };
                sheet.addRow([]);
                sheet.addRow(["Total Sales", report.totalSales]);
                sheet.addRow(["Total Revenue (₹)", report.totalRevenue.toLocaleString()]);
                sheet.addRow(["Total Items Sold", report.totalItemsSold]);
                sheet.addRow(["Average Order Value (₹)", report.averageOrderValue.toFixed(2)]);
                sheet.addRow([]);
                sheet.addRow([]); 

                // **Table Headers**
                const headers = [
                    "Sale ID", "Total Amount (₹)", "Payment Method", "Date", "Product Name", "Quantity", "Price (₹)", "Subtotal (₹)"
                ];
                sheet.addRow(headers).eachCell((cell) => Object.assign(cell, headerStyle));

                // **Table Rows**
                report.transactions.forEach((txn) => {
                    txn.items.forEach((item, index) => {
                        const row = [
                            index === 0 ? txn.saleId : "", 
                            index === 0 ? txn.totalAmount.toLocaleString() : "", 
                            index === 0 ? txn.paymentMethod : "",
                            index === 0 ? formatDate(txn.createdAt) : "",
                            item.productName,
                            item.quantity,
                            item.price.toFixed(2),
                            (item.quantity * item.price).toFixed(2)
                        ];
                        sheet.addRow(row);
                    });
                });

                // **Auto-fit Column Widths**
                sheet.columns.forEach((column) => {
                    column.width = 20;
                });

                // **Save the File**
                await workbook.xlsx.writeFile(filePath);
                resolve(filePath);
            } catch (error) {
                reject(error);
            }
        });
    }
}