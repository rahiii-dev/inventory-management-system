import { injectable } from "inversify";
import { IPDFService } from "./pdf.interface";
import { ISalesReportDTO } from "../../report/dto/report.dto";
import PDFDocument from "pdfkit";
import fs from "fs";
import { formatDate } from "../../../core/utils/helper";


@injectable()
export class PDFService implements IPDFService {

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