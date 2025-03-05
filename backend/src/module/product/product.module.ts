import TYPES from '../../core/container/container.types';
import { Container } from "inversify";
import { ProductController } from './product.controller';
import { IProductService } from './interfaces/product.service.interface';
import { ProductService } from './product.service';
import { IProductRepository } from './interfaces/product.repository.interface';
import { ProductRepository } from './product.repository';

function loadProductContainer(container: Container) {
    container.bind<ProductController>(TYPES.ProductController).to(ProductController);
    container.bind<IProductService>(TYPES.ProductService).to(ProductService);
    container.bind<IProductRepository>(TYPES.ProductRepository).to(ProductRepository);
}

export { loadProductContainer };