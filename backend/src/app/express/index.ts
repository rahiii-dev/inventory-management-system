import express, { Application } from 'express';
import { registerRoutes } from './appRoutes';
import { registerMiddlewares } from './appMiddlewares';


class Server {
    public app: Application;
    private server: any;

    constructor() {
        this.app = express();
        this.initialize();
    }

    async initialize() {
        try {
            registerMiddlewares(this.app);
            registerRoutes(this.app);
        } catch (error) {
            console.error("Error during initialization:", error);
            process.exit(1);
        }
    }

    start(PORT: string) {
        this.server = this.app.listen(PORT, () => {
            console.info(`Server running at PORT:${PORT}`);
        });
    }

    stop() {
        console.info("Shutting down Server...");
        try {
            this.server?.close(() => {
                console.info("Server shut down gracefully.");
            });

        } catch (error) {
            console.error("Error during shutdown:", error);
            process.exit(1);
        }
    }
}

export default Server;