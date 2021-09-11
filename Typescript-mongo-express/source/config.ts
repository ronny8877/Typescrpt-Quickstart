import dotenv from "dotenv";

dotenv.config();
const APP_NAME = "SAMPLE";
const SECRET_KEY = process.env.SECRET_KEY || "TEST_KEY";

//For mongo db

const MONGO_OPTIONS = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  retryWrites: false,
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || "Admin";
const MONGO_PASSWORD = process.env.MONGO_USERNAME || "password";
const MONGO_HOST = process.env.MONGO_URL || `mongodb://localhost/${APP_NAME}`;

//For server
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const PORT = process.env.SERVER_PORT || 5000;

const config = {
  hostname: SERVER_HOSTNAME,
  port: PORT,
  dbUrl: MONGO_HOST,
  dbOptions: MONGO_OPTIONS,
  dbUsername: MONGO_USERNAME,
  dbPassword: MONGO_PASSWORD,
  SECRET_KEY,
};

export default config;
