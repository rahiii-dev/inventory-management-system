import { injectable } from "inversify";
import { MongoBaseRepository } from "../../core/repository/mongo.base.repository";
import Product, { IProduct } from "./product.modal";
import { IProductRepository } from "./interfaces/product.repository.interface";
import { AnyBulkWriteOperation, MongooseBulkWriteOptions } from "mongoose";
import { InternalError } from "../../core/utils/app.errors";

@injectable()
export class ProductRepository extends MongoBaseRepository<IProduct> implements IProductRepository {
    constructor() {
        super(Product);
    }

    async bulkWrite(writes: AnyBulkWriteOperation<any>[], options?: MongooseBulkWriteOptions & { ordered: false; }): Promise<boolean> {
        try {
            const updated = await this.repository.bulkWrite(writes, options);
            return updated.isOk();
        } catch (error) {
            throw new InternalError("Failed to perform bulk operation on products")
        }
    }
}