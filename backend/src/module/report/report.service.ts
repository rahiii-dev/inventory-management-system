import { inject, injectable } from "inversify";
import TYPES from '../../core/container/container.types';
import { IReportService } from "./interfaces/report.service.interface";
import { ISaleRepository } from "../sales/interfaces/sale.repository.interface";
import { ICustomerReportDTO, IItemReportDTO, ISalesReportDTO } from "./dto/report.dto";

@injectable()
export class ReportService implements IReportService {
    @inject(TYPES.SaleRepository) private repo!: ISaleRepository;

    async getSalesReport(managerId: string, startDate: Date, endDate: Date): Promise<ISalesReportDTO> {
        return await this.repo.getSalesReportFromDate(managerId, startDate, endDate);
    }
    async getItemReport(managerId: string, productId: string, startDate: Date, endDate: Date): Promise<IItemReportDTO> {
        return await this.repo.getItemReportFromDate(managerId, productId, startDate, endDate)
    }
    async getCustomerReport(managerId: string, customerId: string, startDate: Date, endDate: Date): Promise<ICustomerReportDTO> {
        return await this.repo.getCustomerReportFromDate(managerId, customerId, startDate, endDate)
    }
}