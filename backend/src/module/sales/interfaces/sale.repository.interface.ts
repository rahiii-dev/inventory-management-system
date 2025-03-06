import { IMongoRepository } from "../../../core/repository/repository.interface";
import { ISale } from "../sale.modal";

export interface ISaleRepository extends IMongoRepository<ISale> {
}