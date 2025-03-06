import { injectable } from "inversify";
import { MongoBaseRepository } from "../../core/repository/mongo.base.repository";
import Sale, { ISale } from "./sale.modal";
import { ISaleRepository } from "./interfaces/sale.repository.interface";

@injectable()
export class SaleRepository extends MongoBaseRepository<ISale> implements ISaleRepository {
    constructor() {
        super(Sale);
    }
}