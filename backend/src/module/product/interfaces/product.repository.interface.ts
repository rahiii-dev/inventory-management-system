import { AnyBulkWriteOperation, MongooseBulkWriteOptions } from "mongoose";
import { IMongoRepository } from "../../../core/repository/repository.interface";
import { IProduct } from "../product.modal";

export interface IProductRepository extends IMongoRepository<IProduct> {
    bulkWrite(writes: AnyBulkWriteOperation<any>[], options?: MongooseBulkWriteOptions & { ordered: false; }): Promise<boolean>
}