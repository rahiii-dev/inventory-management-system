import { inject, injectable } from "inversify";
import TYPES from '../../core/container/container.types';
import { IProductService } from "./interfaces/product.service.interface";
import { IProductRepository } from "./interfaces/product.repository.interface";
import { CreateProductDTO, ProductDTO } from "./dto/product.dto";
import { IProduct } from "./product.modal";
import { capitalizeFirstLetter, querySanitizer } from "../../core/utils/helper";
import { FilterQuery, isValidObjectId } from "mongoose";
import { BadRequestError } from "../../core/utils/app.errors";
import { IPaginationResponse } from "../../core/repository/repository.interface";


@injectable()
export class ProductService implements IProductService {
    @inject(TYPES.ProductRepository) private repo!: IProductRepository;

    async createProduct(data: CreateProductDTO): Promise<ProductDTO> {
        const product = await this.repo.create({ ...data, name: capitalizeFirstLetter(data.name) });
        return this.toDTO(product);
    }

    async updateProduct(id: string, data: CreateProductDTO): Promise<ProductDTO | null> {
        if(!isValidObjectId(id)) {
            throw new BadRequestError('Invalid product id');
        }
        const product = await this.repo.update(id, { ...data, name: capitalizeFirstLetter(data.name) });
        return product ? this.toDTO(product) : null;
    }

    async deleteProduct(id: string): Promise<boolean> {
        if(!isValidObjectId(id)) {
            throw new BadRequestError('Invalid product id');
        }
        const product = await this.repo.update(id, { isDeleted: true });
        return !!product;
    }
    async restoreProduct(id: string): Promise<boolean> {
        if(!isValidObjectId(id)) {
            throw new BadRequestError('Invalid product id');
        }
        const product = await this.repo.update(id, { isDeleted: false });
        return !!product;
    }

    async listProducts(filter: { query?: string; page: number; limit: number; }): Promise<IPaginationResponse<ProductDTO>> {
        const { query, page, limit } = filter;
    
        const filterQuery: FilterQuery<IProduct> = {};
    
        if (query) {
            const sanitizedQuery = querySanitizer(query);
            filterQuery.$or = [
                { name: { $regex: sanitizedQuery, $options: "i" } }, 
                { description: { $regex: sanitizedQuery, $options: "i" } } 
            ];
        }
    
        const products = await this.repo.paginate(filterQuery, page, limit, {sort: {createdAt: -1}});
    
        return {
            ...products,
            data: products.data.map(product => this.toDTO(product))
        };
    }
    

    private toDTO(data: IProduct): ProductDTO {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            isDeleted: data.isDeleted,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };
    }
}