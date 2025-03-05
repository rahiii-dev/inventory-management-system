import { IPaginationResponse } from "../../../core/repository/repository.interface";
import { CreateProductDTO, ProductDTO, UpdateProductDTO } from "../dto/product.dto";

export interface IProductService {
    createProduct(data: CreateProductDTO): Promise<ProductDTO>;
    updateProduct(id: string, data: UpdateProductDTO): Promise<ProductDTO | null>;
    deleteProduct(id: string): Promise<boolean>;
    restoreProduct(id: string): Promise<boolean>;
    listProducts(filter: {query?: string, page: number, limit: number}): Promise<IPaginationResponse<ProductDTO>>;
}