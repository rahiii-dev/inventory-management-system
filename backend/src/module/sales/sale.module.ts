import TYPES from '../../core/container/container.types';
import { Container } from "inversify";
import { SaleController } from './sale.controller';
import { ISaleService } from './interfaces/sale.service.interface';
import { SaleService } from './sale.service';
import { ISaleRepository } from './interfaces/sale.repository.interface';
import { SaleRepository } from './sale.repository';

function loadSaleContainer(container: Container) {
    container.bind<SaleController>(TYPES.SaleController).to(SaleController);
    container.bind<ISaleService>(TYPES.SaleService).to(SaleService);
    container.bind<ISaleRepository>(TYPES.SaleRepository).to(SaleRepository);
}

export { loadSaleContainer };