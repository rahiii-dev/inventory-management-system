import { IMongoRepository } from "../../../core/repository/repository.interface";
import { IProduct } from "../product.modal";

export interface IProductRepository extends IMongoRepository<IProduct> {
}