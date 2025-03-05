import { Router } from "express";
import { container } from "../../../core/container";
import TYPES from "../../../core/container/container.types";
import { isAuthenticated } from "../../../core/token/user/userMiddleware";
import { CustomerController } from "../../../module/customer/customer.controller";

const router = Router();
const customerController = container.get<CustomerController>(TYPES.CustomerController)

// baseurl: /api/customer
router.post("/", isAuthenticated, customerController.createCustomer);
router.get("/list", isAuthenticated, customerController.listCustomers);
router.put("/:id", isAuthenticated, customerController.updateCustomer);
router.put("/delete/:id", isAuthenticated, customerController.deleteCustomer);
router.put("/restore/:id", isAuthenticated, customerController.restoreCustomer);

export const customerRoutes = router;