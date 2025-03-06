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

export const reportRoutes = router;