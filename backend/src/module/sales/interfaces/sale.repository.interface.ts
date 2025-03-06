import { IMongoRepository } from "../../../core/repository/repository.interface";
import { ISalesReportDTO } from "../../report/dto/report.dto";
import { ISale } from "../sale.modal";

export interface ISaleRepository extends IMongoRepository<ISale> {
    getSalesReportFromDate(managerId: string, startDate: Date, endDate: Date): Promise<ISalesReportDTO>
}