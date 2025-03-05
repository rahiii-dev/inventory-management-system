import { Router } from "express";
import { UserController } from "../../../module/user/user.controller";
import { container } from "../../../core/container";
import TYPES from "../../../core/container/container.types";
import { isAuthenticated } from "../../../core/token/user/userMiddleware";

const router = Router();
const userController = container.get<UserController>(TYPES.UserController)

// baseurl: /api/user
router.get("/", isAuthenticated, userController.getUser);

router.post("/login", userController.login);
router.post("/refresh-token", userController.refreshToken);

export const userRoutes = router;