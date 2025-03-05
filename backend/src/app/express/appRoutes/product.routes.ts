import { Router } from "express";
import { container } from "../../../core/container";
import TYPES from "../../../core/container/container.types";
import { isAuthenticated } from "../../../core/token/user/userMiddleware";
import { ProductController } from "../../../module/product/product.controller";

const router = Router();
const productController = container.get<ProductController>(TYPES.ProductController)

// baseurl: /api/product
router.post("/", isAuthenticated, productController.createProduct);
router.get("/list", productController.listProducts);
router.put("/:id", isAuthenticated, productController.updateProduct);
router.put("/delete/:id", isAuthenticated, productController.deleteProduct);
router.put("/restore/:id", isAuthenticated, productController.restoreProduct);

export const productRoutes = router;