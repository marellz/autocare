import fs from "fs";
import crypto from "crypto";

const secret = () => crypto.randomBytes(32).toString("hex");

const envFilePath = "../.env";
const keys = ["APP_SECET", "JWT_SECRET"];

keys.forEach((key) => {
  const entry = `${key}=${secret()}\n`;
  fs.readFile(envFilePath, "utf-8", (err, data) => {
    let updatedEnv;

    if (err) {
      if (err.code === "ENOENT") {
        updatedEnv = entry;
      } else {
        console.error("Error reading .env file", err);
        return;
      }
    } else {
      const regex = new RegExp(`^${key}=.*`, "m");
      updatedEnv = data.match(regex)
        ? data.replace(regex, entry.trim())
        : data + `\n` + entry;
    }

    fs.writeFile(envFilePath, updatedEnv, "utf-8", (err) => {
      if (err) {
        console.error("Error writing env file:", err);
      } else {
        console.log(`${key} set successfully to .env file`);
      }
    });
  });
});
