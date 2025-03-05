import { injectable } from "inversify";
import { MongoBaseRepository } from "../../core/repository/mongo.base.repository";
import { Customer, ICustomer } from "./customer.modal";
import { ICustomerRepository } from "./interfaces/customer.repository.interface";

@injectable()
export class CustomerRepository extends MongoBaseRepository<ICustomer> implements ICustomerRepository {
    constructor() {
        super(Customer);
    }
}