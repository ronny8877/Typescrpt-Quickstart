import mongoose from "mongoose";
import config from "../config";
import Logger from "../logging/logger";

const NAMESPACE = "init_db.ts";
let log: Logger = new Logger(NAMESPACE);

export default function () {
  mongoose
    .connect(config.dbUrl, config.dbOptions)
    .then(() => {
      log.info(`Connected to database ${config.dbUrl}`);
    })
    .catch((err) => {
      log.error("Error connecting to database", err);
    });
}
