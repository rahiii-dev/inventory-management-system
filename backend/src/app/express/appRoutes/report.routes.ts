import { Router } from "express";
import { container } from "../../../core/container";
import TYPES from "../../../core/container/container.types";
import { isAuthenticated } from "../../../core/token/user/userMiddleware";
import { ReportController } from "../../../module/report/report.controller";

const router = Router();
const reportController = container.get<ReportController>(TYPES.ReportController)

// baseurl: /api/report
router.get("/sales", isAuthenticated, reportController.getSalesReports);
router.get("/sales/export", isAuthenticated, reportController.exportSalesReport);
router.get("/item", isAuthenticated, reportController.getItemReports);
router.get("/item/export", isAuthenticated, reportController.exportItemReport);
router.get("/customer", isAuthenticated, reportController.getCustomerReports);
router.get("/customer/export", isAuthenticated, reportController.exportCustomerReport);

export const reportRoutes = router;