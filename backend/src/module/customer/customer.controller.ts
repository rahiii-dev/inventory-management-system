import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import TYPES from '../../core/container/container.types';
import asyncWrapper from "../../core/utils/asyncWrapper";
import { AuthRequest } from "../../core/token/user/userRequest";
import { ICustomerService } from "./interfaces/customer.service.interface";
import { CreateCustomerDTO, UpdateCustomerDTO } from "./dto/customer.dto";


@injectable()
export class CustomerController {
    @inject(TYPES.CustomerService) private customerService!: ICustomerService;

    /**
     * @route POST /customer
     * @scope Protected
     * @desc Create a new Customer
     **/
    public createCustomer = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const managerId = req.payload?.userId!;
        const {fullName, mobile, address} = req.body as CreateCustomerDTO;

        const Customer = await this.customerService.createCustomer({managerId, fullName, mobile, address});
        res.status(201).json(Customer);
    });

    /**
     * @route GET /customer/list
     * @scope Protected
     * @desc Get paginated list of Customers
     **/
    public listCustomers = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const managerId = req.payload?.userId!;
        const { query, page = 1, limit = 10 } = req.query;
        const Customers = await this.customerService.listCustomers({
            managerId,
            query: query as string,
            page: parseInt(page as string, 10),
            limit: parseInt(limit as string, 10),
        });
        res.status(200).json(Customers);
    });

    /**
     * @route PUT /customer/:id
     * @scope Protected
     * @desc Update a Customer
     **/
    public updateCustomer = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const managerId = req.payload?.userId!;
        const { id } = req.params;
        const updatedCustomer = await this.customerService.updateCustomer(id, managerId, req.body as UpdateCustomerDTO);
        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(updatedCustomer);
    });

    /**
     * @route PUT /customer/delete/:id
     * @scope Protected
     * @desc Soft Delete a Customer
     **/
    public deleteCustomer = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const deleted = await this.customerService.deleteCustomer(id);
        if (!deleted) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(204).send();
    });

    /**
     * @route DELETE /customer/restore/:id
     * @scope Protected
     * @desc Restore Deleted Customer
     **/
    public restoreCustomer = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const restored = await this.customerService.restoreCustomer(id);
        if (!restored) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(204).send();
    });
}

