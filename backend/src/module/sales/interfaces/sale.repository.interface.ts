import { IMongoRepository } from "../../../core/repository/repository.interface";
import { ICustomerReportDTO, IItemReportDTO, ISalesReportDTO } from "../../report/dto/report.dto";
import { ISale } from "../sale.modal";

export interface ISaleRepository extends IMongoRepository<ISale> {
    getSalesReportFromDate(managerId: string, startDate: Date, endDate: Date): Promise<ISalesReportDTO>;
    getItemReportFromDate(managerId: string, productId: string, startDate: Date, endDate: Date): Promise<IItemReportDTO>;
    getCustomerReportFromDate(managerId: string, customerId: string, startDate: Date, endDate: Date): Promise<ICustomerReportDTO>;
}