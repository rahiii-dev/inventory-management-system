import { IMongoRepository } from "../../../core/repository/repository.interface";
import { ICustomer } from "../customer.modal";

export interface ICustomerRepository extends IMongoRepository<ICustomer> {
}