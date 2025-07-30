import crypto from "crypto";
const secret = () => crypto.randomBytes(32).toString("hex");

const keys = ["APP_SECRET", "JWT_SECRET"];

console.log('Set this to main .env\n')
keys.forEach((key) => {
  console.log(`${key}=${secret()}`)
});
