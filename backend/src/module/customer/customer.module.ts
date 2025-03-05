import TYPES from '../../core/container/container.types';
import { Container } from "inversify";
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { ICustomerService } from './interfaces/customer.service.interface';
import { ICustomerRepository } from './interfaces/customer.repository.interface';
import { CustomerRepository } from './customer.repository';

function loadCustomerContainer(container: Container) {
    container.bind<CustomerController>(TYPES.CustomerController).to(CustomerController);
    container.bind<ICustomerService>(TYPES.CustomerService).to(CustomerService);
    container.bind<ICustomerRepository>(TYPES.CustomerRepository).to(CustomerRepository);
}

export { loadCustomerContainer };