import { injectable } from "inversify";
import { MongoBaseRepository } from "../../core/repository/mongo.base.repository";
import Product, { IProduct } from "./product.modal";
import { IProductRepository } from "./interfaces/product.repository.interface";

@injectable()
export class ProductRepository extends MongoBaseRepository<IProduct> implements IProductRepository {
    constructor() {
        super(Product);
    }
}