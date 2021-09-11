import http from "http";
import express from "express";
import config from "./config";

import Logger from "./logging/logger";

const NAMESPACE = "index.ts";
//express initialization
const app = express();
//initialization of logger
let log: Logger = new Logger(NAMESPACE);
const server = http.createServer(app);
//using middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//logging every request and response
app.use((req, res, next) => {
  log.info(
    `METHOD: [ ${req.method}] -URL: [${req.url}] -IP [${req.socket.remoteAddress}] :`
  );

  res.on("finish", () => {
    log.info(
      ` METHOD: [ ${req.method}] -URL: [${req.url}] STATUS: [${res.statusCode}] -IP [${req.socket.remoteAddress}]`
    );
  });

  next();
});

//API_RULES
app.use((req, res, next) => {
  //TODO: Whitelist only the apps/sites ip address
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  //exposing custom header x-auth-token
  res.header("Access-Control-Expose-Headers", "x-auth-token");
  //letting user know what is possible
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//initialization of routes
import routes from "./startup/init_routes";
import db from "./startup/init_db";
db();
routes(app);

//starting the server
server.listen(config.port, () => {
  log.info(
    `Listening on port ${config.port}...in ${process.env.NODE_ENV} environment `
  );
});

export default server;
