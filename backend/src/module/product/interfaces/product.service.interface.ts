import { IPaginationResponse } from "../../../core/repository/repository.interface";
import { CreateProductDTO, ProductDTO, UpdateProductDTO } from "../dto/product.dto";

export interface IProductService {
    createProduct(data: CreateProductDTO): Promise<ProductDTO>;
    updateProduct(id: string, data: UpdateProductDTO): Promise<ProductDTO | null>;
    getProductById(id: string): Promise<ProductDTO | null>;
    bulkStockUpdate(data: {id: string, quantity: number}[]): Promise<boolean>;
    deleteProduct(id: string): Promise<boolean>;
    restoreProduct(id: string): Promise<boolean>;
    listProducts(filter: { managerId: string, isActive?: boolean, query?: string, page: number, limit: number}): Promise<IPaginationResponse<ProductDTO>>;
}