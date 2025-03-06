import { IPaginationResponse } from "../../../core/repository/repository.interface";
import { CreateCustomerDTO, CustomerDTO, UpdateCustomerDTO } from "../dto/customer.dto";

export interface ICustomerService {
  createCustomer(data: CreateCustomerDTO): Promise<CustomerDTO>;
  updateCustomer(id: string, managerId: string, data: UpdateCustomerDTO): Promise<CustomerDTO | null>;
  getCustomerById(id: string): Promise<CustomerDTO | null>;
  listCustomers(filter: {managerId: string, query?: string, page: number, limit: number}): Promise<IPaginationResponse<CustomerDTO>>;
  deleteCustomer(id: string): Promise<boolean>; 
  restoreCustomer(id: string): Promise<boolean>; 
}
