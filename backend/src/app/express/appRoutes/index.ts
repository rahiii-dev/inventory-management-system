import { Application } from "express";
import { errorHandler, notFoundHandler } from "../errorHandler";
import { userRoutes } from "./user.routes";
import { productRoutes } from "./product.routes";

export function registerRoutes(app:Application, prefix="/api") {
    app.get(`${prefix}/health`, (req, res) => {
        res.json("Server is healthy 🚀")
    })

    app.use(`${prefix}/user`, userRoutes);
    app.use(`${prefix}/product`, productRoutes);
    
    app.use(notFoundHandler);
    app.use(errorHandler);
}