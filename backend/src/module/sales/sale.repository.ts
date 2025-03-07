import { injectable } from "inversify";
import { MongoBaseRepository } from "../../core/repository/mongo.base.repository";
import Sale, { ISale } from "./sale.modal";
import { ISaleRepository } from "./interfaces/sale.repository.interface";
import { IItemReportDTO, ISalesReportDTO } from "../report/dto/report.dto";
import { InternalError } from "../../core/utils/app.errors";
import mongoose from "mongoose";

@injectable()
export class SaleRepository extends MongoBaseRepository<ISale> implements ISaleRepository {
    constructor() {
        super(Sale);
    }

    async getItemReportFromDate(managerId: string, productId: string, startDate: Date, endDate: Date): Promise<IItemReportDTO> {
        try {
            const report = await this.repository.aggregate([
                {
                    $match: {
                        managerId: new mongoose.Types.ObjectId(managerId),
                        "items.product": new mongoose.Types.ObjectId(productId),
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                { $unwind: "$items" },
                {
                    $match: {
                        "items.product": new mongoose.Types.ObjectId(productId) 
                    }
                }, 
                {
                    $group: {
                        _id: "$items.product",
                        productName: { $first: "$items.productName" },
                        productDescription: { $first: "$items.productDescription" },
                        totalQuantitySold: { $sum: "$items.quantity" },
                        totalRevenue: { $sum: "$items.total" }, 
                        averageSellingPrice: { $avg: "$items.price" },
                        salesCount: { $addToSet: "$saleId" },
                        transactions: {
                            $push: {
                                saleId: "$saleId",
                                date: "$createdAt",
                                quantity: "$items.quantity",
                                unitPrice: "$items.price",
                                total: "$items.total"
                            }
                        }
                    }
                }, 
                {
                    $project: {
                        _id: 0,
                        productId: "$_id",
                        productName: 1,
                        productDescription: 1,
                        totalQuantitySold: 1,
                        totalRevenue: 1,
                        averageSellingPrice: 1,
                        salesCount: { $size: "$salesCount" }, 
                        transactions: 1
                    }
                }
            ]);
    
            if (!report.length) {
                return {
                    productId,
                    productName: "Unknown Product",
                    productDescription: "",
                    totalQuantitySold: 0,
                    totalRevenue: 0,
                    averageSellingPrice: 0,
                    salesCount: 0,
                    transactions: []
                };
            }
            
    
            return report[0];
        } catch (error) {
            throw new InternalError("Failed to fetch item report");
        }
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