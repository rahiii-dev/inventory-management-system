import { injectable } from "inversify";
import { MongoBaseRepository } from "../../core/repository/mongo.base.repository";
import Sale, { ISale } from "./sale.modal";
import { ISaleRepository } from "./interfaces/sale.repository.interface";
import { ISalesReportDTO } from "../report/dto/report.dto";
import { InternalError } from "../../core/utils/app.errors";
import mongoose from "mongoose";

@injectable()
export class SaleRepository extends MongoBaseRepository<ISale> implements ISaleRepository {
    constructor() {
        super(Sale);
    }

    async getSalesReportFromDate(managerId: string, startDate: Date, endDate: Date): Promise<ISalesReportDTO> {
        try {            
            const report = await this.repository.aggregate([
                {
                    $match: {
                        managerId: new mongoose.Types.ObjectId(managerId),
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalSales: { $sum: 1 },
                        totalRevenue: { $sum: "$totalAmount" },
                        totalItemsSold: { $sum: "$items.quantity" },
                        averageOrderValue: { $avg: "$totalAmount" }
                    }
                }
            ]);

            const transactions = await this.repository.find({
                managerId,
                createdAt: { $gte: startDate, $lte: endDate }
            }).populate('customer');
    
            return {
                totalSales: report[0]?.totalSales || 0,
                totalRevenue: report[0]?.totalRevenue || 0,
                totalItemsSold: report[0]?.totalItemsSold || 0,
                averageOrderValue: report[0]?.averageOrderValue || 0,
                transactions
            };
        } catch (error) {
            throw new InternalError("Failed to fetch sales report")
        }
    }
}