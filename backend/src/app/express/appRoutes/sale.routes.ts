import { Router } from "express";
import { container } from "../../../core/container";
import TYPES from "../../../core/container/container.types";
import { isAuthenticated } from "../../../core/token/user/userMiddleware";
import { SaleController } from "../../../module/sales/sale.controller";

const router = Router();
const saleController = container.get<SaleController>(TYPES.SaleController)

// baseurl: /api/sale
router.post("/", isAuthenticated, saleController.createSale);
router.get("/list", isAuthenticated, saleController.listSales);

export const saleRoutes = router;