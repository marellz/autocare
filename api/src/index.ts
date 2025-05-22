import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Express } from "express";

import registerRoutes from "./router/index";
import errorMiddleware from "./middleware/error.middleware";

dotenv.config();

const app: Express = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(errorMiddleware);

registerRoutes(app);

const appName = process.env.APP_NAME;
const apiPort = process.env.API_PORT;
app.listen(apiPort, () => {
  console.log(` ${[appName]} API listening nicely on port ${apiPort}`);
});

export default app;
