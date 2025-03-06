import { Response } from "express";
import { injectable, inject } from "inversify";
import TYPES from '../../core/container/container.types';
import { IProductService } from "./interfaces/product.service.interface";
import asyncWrapper from "../../core/utils/asyncWrapper";
import { AuthRequest } from "../../core/token/user/userRequest";
import { CreateProductDTO, UpdateProductDTO } from "./dto/product.dto";


@injectable()
export class ProductController {
    @inject(TYPES.ProductService) private productService!: IProductService;

    /**
     * @route POST /product
     * @scope Protected
     * @desc Create a new product
     **/
    public createProduct = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const managerId = req.payload?.userId!;
        const {name, description, price, quantity} = req.body as CreateProductDTO
        const product = await this.productService.createProduct({
            managerId,
            name, description, price, quantity
        });
        res.status(201).json(product);
    });

    /**
     * @route GET /product/list
     * @scope Public
     * @desc Get paginated list of products
     **/
    public listProducts = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const managerId = req.payload?.userId!;

        const { query, page = 1, limit = 10 } = req.query;
        const products = await this.productService.listProducts({
            managerId,
            query: query as string,
            page: parseInt(page as string, 10),
            limit: parseInt(limit as string, 10),
        });
        res.status(200).json(products);
    });

    /**
     * @route PUT /product/:id
     * @scope Protected
     * @desc Update a product
     **/
    public updateProduct = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const updatedProduct = await this.productService.updateProduct(id, req.body as UpdateProductDTO);
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    });

    /**
     * @route PUT /product/delete/:id
     * @scope Protected
     * @desc Soft Delete a product
     **/
    public deleteProduct = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const deleted = await this.productService.deleteProduct(id);
        if (!deleted) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(204).send();
    });

    /**
     * @route DELETE /product/restore/:id
     * @scope Protected
     * @desc Restore Deleted product
     **/
    public restoreProduct = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const restored = await this.productService.restoreProduct(id);
        if (!restored) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(204).send();
    });
}

