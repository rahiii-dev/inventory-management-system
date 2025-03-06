import { inject, injectable } from "inversify";
import TYPES from '../../core/container/container.types';
import { IReportService } from "./interfaces/report.service.interface";
import { ISaleRepository } from "../sales/interfaces/sale.repository.interface";
import { ISalesReportDTO } from "./dto/report.dto";

@injectable()
export class ReportService implements IReportService {
    @inject(TYPES.SaleRepository) private repo!: ISaleRepository;

    async getSalesReport(managerId: string, startDate: Date, endDate: Date): Promise<ISalesReportDTO> {
        return await this.repo.getSalesReportFromDate(managerId, startDate, endDate);
    }
}