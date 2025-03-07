import { injectable } from "inversify";
import { IPDFService } from "./pdf.interface";
import { IItemReportDTO, ISalesReportDTO } from "../../report/dto/report.dto";
import PDFDocument from "pdfkit";
import fs from "fs";
import { formatDate } from "../../../core/utils/helper";


@injectable()
export class PDFService implements IPDFService {

    async generateItemReportPdf(report: IItemReportDTO, filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 30 });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);
    
            // **Header**
            doc.fontSize(20).text("Item Report", { align: "center", underline: true });
            doc.moveDown(1.5);
    
            // **Product Details**
            doc.font("Helvetica-Bold").fontSize(14).text(`Product: ${report.productName}`);

            doc.font("Helvetica").fontSize(12);
            if (report.productDescription) {
                doc.text(`Description: ${report.productDescription}`);
            }
            doc.moveDown(1);
    
            // **Summary**
            doc.fontSize(12).text(`Total Quantity Sold: ${report.totalQuantitySold}`);
            doc.text(`Total Revenue: INR ${report.totalRevenue.toLocaleString()}`);
            doc.text(`Average Selling Price: INR ${report.averageSellingPrice.toFixed(2)}`);
            doc.text(`Total Sales Count: ${report.salesCount}`);
            doc.moveDown(1.5);
    
            // **Transactions Table Header**
            doc.fontSize(14).text("Transactions", { underline: true });
            doc.moveDown(0.5);
    
            // **Table Header**
            const tableTop = doc.y;
            doc.fontSize(10).text("Sale ID", 50, tableTop);
            doc.text("Date", 150, tableTop);
            doc.text("Quantity", 250, tableTop);
            doc.text("Unit Price (INR)", 350, tableTop);
            doc.text("Total (INR)", 450, tableTop);
    
            doc.moveDown(0.5);
            doc.strokeColor("#000").moveTo(50, doc.y).lineTo(570, doc.y).stroke();
    
            // **Table Rows**
            let currentY = doc.y + 5;
            report.transactions.forEach((txn) => {
                doc.fontSize(9);
                doc.text(txn.saleId, 50, currentY);
                doc.text(formatDate(txn.date), 150, currentY);
                doc.text(txn.quantity.toString(), 250, currentY);
                doc.text(txn.unitPrice.toFixed(2), 350, currentY);
                doc.text(txn.total.toFixed(2), 450, currentY);
    
                currentY += 20; 
            });
    
            doc.end();
    
            stream.on("finish", () => resolve(filePath));
            stream.on("error", reject);
        });
    }

    async generateSalesReportPdf(report: ISalesReportDTO, filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 30 });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);
    
            // **Header**
            doc.fontSize(20).text("Sales Report", { align: "center", underline: true });
            doc.moveDown(1.5);
    
            // **Summary**
            doc.fontSize(12).text(`Total Sales: ${report.totalSales}`);
            doc.text(`Total Revenue: INR ${report.totalRevenue.toLocaleString()}`);
            doc.text(`Total Items Sold: ${report.totalItemsSold}`);
            doc.text(`Average Order Value: INR ${report.averageOrderValue.toFixed(2)}`);
            doc.moveDown(1.5);
    
            // **Transactions Table Header**
            doc.fontSize(14).text("Transactions", { underline: true });
            doc.moveDown(0.5);
    
            // **Table Header**
            const tableTop = doc.y;
            doc.fontSize(10).text("SaleID", 50, tableTop);
            doc.text("Total (INR)", 150, tableTop);
            doc.text("Payment", 250, tableTop);
            doc.text("Date", 350, tableTop);
            doc.text("Items", 450, tableTop);
    
            doc.moveDown(0.5);
            doc.strokeColor("#000").moveTo(50, doc.y).lineTo(570, doc.y).stroke();
    
            // **Table Rows**
            let currentY = doc.y + 5;
            report.transactions.forEach((txn, index) => {
                doc.fontSize(9);
    
                // **Sale Data**
                doc.text(`${index + 1}`, 50, currentY);
                doc.text(`${txn.totalAmount.toFixed(2)}`, 150, currentY);
                doc.text(txn.paymentMethod, 250, currentY);
                doc.text(formatDate(txn.createdAt), 350, currentY);
    
                // **Item List (Each on a New Line)**
                txn.items.forEach((item, i) => {
                    if (i === 0) {
                        doc.text(`${item.productName} (${item.quantity}x)`, 450, currentY);
                    } else {
                        currentY += 15;
                        doc.text(`${item.productName} (${item.quantity}x)`, 450, currentY);
                    }
                });
    
                currentY += 25;
            });
    
            doc.end();
    
            stream.on("finish", () => resolve(filePath));
            stream.on("error", reject);
        });
    }
}