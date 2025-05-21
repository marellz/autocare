import dotenv from "dotenv";
dotenv.config();

const dbName = process.env["DB_DATABASE"];
const userName = process.env["DB_USERNAME"];
const password = process.env["DB_PASSWORD"];

export default {
  dbName,
  userName,
  password,
};
