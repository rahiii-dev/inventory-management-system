import { IPaginationResponse } from "../../../core/repository/repository.interface";
import { CreateSaleDto, SaleDTO } from "../dto/sale.dto";

export interface ISaleService {
    createSale(data: CreateSaleDto): Promise<SaleDTO>;
    listSalesByManager(managerId: string, filter: {query?: string, page: number, limit: number}): Promise<IPaginationResponse<SaleDTO>>;
}
