import dotenv from 'dotenv';
dotenv.config();

import ExpressServer from './app/express';
import Database from "./core/database";
import { checkEnvVariables } from "./core/utils/envChecker";

(async () => {
    checkEnvVariables('DATABASE_URL', 'JWT_SECRET_KEY');
    const databaseUrl = process.env.DATABASE_URL!;
    const expressPort = process.env.EXPRESS_PORT || '8080';
    const db = new Database(databaseUrl);
    const expressServer = new ExpressServer();
   
    db.connect(); 
    expressServer.start(expressPort);

    process.on('SIGINT', async () => {
        expressServer.stop();
        db.disconnect();
    });
    process.on("SIGTERM", () => {
        expressServer.stop();
        db.disconnect();
    });
})();