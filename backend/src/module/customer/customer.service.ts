import { inject, injectable } from 'inversify';
import TYPES from '../../core/container/container.types';
import { ICustomerService } from './interfaces/customer.service.interface';
import { ICustomerRepository } from './interfaces/customer.repository.interface';
import { CreateCustomerDTO, CustomerDTO } from './dto/customer.dto';
import { ICustomer } from './customer.modal';
import { capitalize, querySanitizer } from '../../core/utils/helper';
import { FilterQuery, isValidObjectId } from 'mongoose';
import { BadRequestError } from '../../core/utils/app.errors';
import { IPaginationResponse } from '../../core/repository/repository.interface';

@injectable()
export class CustomerService implements ICustomerService {
    @inject(TYPES.CustomerRepository) private repo!: ICustomerRepository;

    async createCustomer(data: CreateCustomerDTO): Promise<CustomerDTO> {
        const existing  = await this.repo.findOne({mobile: data.mobile});
        if(existing){
            throw new BadRequestError("Customer already exist with mobile")
        }
        const customer = await this.repo.create({ ...data, fullName: capitalize(data.fullName) });
        return this.toDTO(customer);
    }

    async updateCustomer(id: string, managerId: string, data: CreateCustomerDTO): Promise<CustomerDTO | null> {
        if (!isValidObjectId(id)) {
            throw new BadRequestError('Invalid customer id');
        }
        const existing  = await this.repo.findOne({mobile: data.mobile, managerId, _id: {$ne: id}});
        if(existing){
            throw new BadRequestError("Customer already exist with mobile")
        }
        const customer = await this.repo.update(id, { ...data, fullName: capitalize(data.fullName) });
        return customer ? this.toDTO(customer) : null;
    }

    async deleteCustomer(id: string): Promise<boolean> {
        if (!isValidObjectId(id)) {
            throw new BadRequestError('Invalid customer id');
        }
        const customer = await this.repo.update(id, { isActive: false });
        return !!customer;
    }

    async restoreCustomer(id: string): Promise<boolean> {
        if (!isValidObjectId(id)) {
            throw new BadRequestError('Invalid customer id');
        }
        const customer = await this.repo.update(id, { isActive: true });
        return !!customer;
    }

    async listCustomers(filter: {managerId: string, query?: string; page: number; limit: number; }): Promise<IPaginationResponse<CustomerDTO>> {
        const { managerId, query, page, limit } = filter;

        const filterQuery: FilterQuery<ICustomer> = {managerId};

        if (query) {
            const sanitizedQuery = querySanitizer(query);
            filterQuery.$or = [
                { fullName: { $regex: sanitizedQuery, $options: "i" } },
                { mobile: { $regex: sanitizedQuery, $options: "i" } }
            ];
        }

        const customers = await this.repo.paginate(filterQuery, page, limit, { sort: { createdAt: -1 } });

        return {
            ...customers,
            data: customers.data.map(customer => this.toDTO(customer))
        };
    }

    private toDTO(data: ICustomer): CustomerDTO {
        return {
            id: data.id,
            fullName: data.fullName,
            managerId: data.managerId.toString(),
            mobile: data.mobile,
            address: data.address,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
}