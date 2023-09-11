import mongoose from "mongoose";
import log from "../logger";


export class DB {
    private static instance: DB;

    private constructor() {
        //BEEP BOOP
    }
    public static getInstanceAndConnect(): DB {
        if (!DB.instance) {
            DB.instance = new DB();
            DB.instance.connect();
        }
        return DB.instance;
    }
    private async connect() {
        try {
            await mongoose.connect(process.env.MONGO_URI as string, {
                dbName: process.env.MONGO_DB_NAME,
            });
            log.success("Connected to DB");
        } catch (error) {
            log.error("Error connecting to DB");
            log.trace(error);
        }
    }
}