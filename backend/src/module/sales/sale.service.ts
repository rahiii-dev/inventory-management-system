import { inject, injectable } from "inversify";
import TYPES from '../../core/container/container.types';
import { ISaleService } from "./interfaces/sale.service.interface";
import { ISaleRepository } from "./interfaces/sale.repository.interface";
import { CreateSaleDto, SaleDTO } from "./dto/sale.dto";
import { ISale } from "./sale.modal";
import { IPaginationResponse } from "../../core/repository/repository.interface";
import { FilterQuery } from "mongoose";
import { querySanitizer } from "../../core/utils/helper";

@injectable()
export class SaleService implements ISaleService {
    @inject(TYPES.SaleRepository) private repo!: ISaleRepository;

    async createSale(data: CreateSaleDto): Promise<SaleDTO> {
        const saleId = await this.genrateSaleId();
        const sale = await this.repo.create({ ...data, saleId });
        return this.toDTO(sale);
    }

    async listSalesByManager(managerId: string, filter: { query?: string, page: number; limit: number; }): Promise<IPaginationResponse<SaleDTO>> {
        const { page, limit, query } = filter;

        const filterQuery: FilterQuery<ISale> = { managerId };

        if (query) {
            const sanitizedQuery = querySanitizer(query);
            filterQuery.saleId = { $regex: sanitizedQuery, $options: "i" };
        }

        const sales = await this.repo.paginate(filterQuery, page, limit, { sort: { createdAt: -1 }, populate: 'customer' });

        return {
            ...sales,
            data: sales.data.map(sale => this.toDTO(sale))
        };
    }

    private async genrateSaleId(): Promise<string> {
        const lastSale = await this.repo.findOne({}, { sort: { createdAt: -1 }, limit: 1 });
        if (!lastSale) return `SALE-0001`;
        const lastSaleId = lastSale.saleId;
        const lastId = parseInt(lastSaleId.split('-')[1]);
        return `SALE-${(lastId + 1).toString().padStart(4, '0')}`;
    }

    private toDTO(data: ISale): SaleDTO {
        return {
            id: data.id,
            saleId: data.saleId,
            managerId: data.managerId.toString(),
            items: data.items,
            customer: data.customer,
            totalAmount: data.totalAmount,
            paymentMethod: data.paymentMethod
        }
    }
}