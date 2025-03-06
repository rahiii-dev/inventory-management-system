import { Response } from "express";
import { injectable, inject } from "inversify";
import TYPES from '../../core/container/container.types';
import { ISaleService } from "./interfaces/sale.service.interface";
import asyncWrapper from "../../core/utils/asyncWrapper";
import { AuthRequest } from "../../core/token/user/userRequest";
import { ISaleItem, PaymentMethod } from "./sale.modal";
import { IProductService } from "../product/interfaces/product.service.interface";
import { ICustomerService } from "../customer/interfaces/customer.service.interface";

@injectable()
export class SaleController {
    @inject(TYPES.SaleService) private saleService!: ISaleService;
    @inject(TYPES.ProductService) private productService!: IProductService;
    @inject(TYPES.CustomerService) private customerService!: ICustomerService;

    /**
     * @route GET /sale/list
     * @scope Public
     * @desc Get paginated list of sales
     **/
    public listSales = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const managerId = req.payload?.userId!;

        const { query, page = 1, limit = 10 } = req.query;
        const products = await this.saleService.listSalesByManager(managerId, {
            query: query as string,
            page: parseInt(page as string, 10),
            limit: parseInt(limit as string, 10),
        });
        res.status(200).json(products);
    });

    /**
     * @route POST /sale
     * @scope Protected
     * @desc Create a new sale
     **/
    public createSale = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const managerId = req.payload?.userId!;
        const { items, paymentMethod, customer } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Items array cannot be empty." });
        }

        if (paymentMethod !== PaymentMethod.CASH && !customer) {
            return res.status(400).json({ message: "Customer is required for non-cash payments." });
        }
        let customerDetail = null;
        if (customer) {
            customerDetail = await this.customerService.getCustomerById(customer);
            if (!customerDetail) {
                return res.status(404).json({ message: "Customer not found." });
            }
        }

        let totalAmount = 0;
        const saleItems: ISaleItem[] = [];


        for (const { id, quantity } of items) {
            const product = await this.productService.getProductById(id);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${id} not found.` });
            }

            if (product.quantity < quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}. Available: ${product.quantity}, Requested: ${quantity}` });
            }

            const total = product.price * quantity;
            totalAmount += total;

            saleItems.push({
                product: product.id,
                productName: product.name,
                productDescription: product.description,
                quantity,
                price: product.price,
                total
            });
        }


        const sale = await this.saleService.createSale({
            managerId,
            items: saleItems,
            customer: customer || null,
            totalAmount,
            paymentMethod,
        });

        const stockUpdateData = saleItems.map(item => ({
            id: item.product.toString(),
            quantity: item.quantity
        }));

        await this.productService.bulkStockUpdate(stockUpdateData);


        return res.status(201).json({
            ...sale,
            customer: customerDetail
        });
    });

}