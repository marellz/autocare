import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env["API_PORT"] ?? "3000",
  appName: process.env.APP_NAME ?? "my-app",
};
