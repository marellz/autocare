import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import registerRoutes from "./router/index.js";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

registerRoutes(app);

const appName = process.env.APP_NAME;
app.listen(3000, () => {
  console.log(` ${[appName]} API listening on port 3000`);
});
