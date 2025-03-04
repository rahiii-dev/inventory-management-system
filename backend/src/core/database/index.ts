import mongoose from "mongoose";

class Database {
    private dbUrl: string;

    constructor(dbUrl: string) {
        this.dbUrl = dbUrl;
    }

    async connect(): Promise<void> {
        try {
            await mongoose.connect(this.dbUrl, {dbName: 'job-service'});
            console.info(`Database connected to: ${this.dbUrl}`);
        } catch (error) {
            console.error(`Error connecting to database: ${error}`);
            process.exit(1); 
        }
    }

    async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.warn('Database connection closed');
        } catch (error) {
            console.error(`Error disconnecting from database: ${error}`);
        }
    }
}

export default Database;