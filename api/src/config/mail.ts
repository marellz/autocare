import dotenv from "dotenv";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

(() => {
  dotenv.config();
})();

export const host = process.env["SMTP_HOST"] || "smtp.example.com";
export const port = process.env["SMTP_PORT"] || 587;
export const user = process.env["SMTP_USER"];
export const pass = process.env["SMTP_PASSWORD"];

(() => {
  console.log({ host, port, user, pass });

  if (!host || !port) {
    throw new Error(
      "SMTP_HOST and SMTP_PORT must be set in the environment variables.",
    );
  }
  if (port === "465" && (!user || !pass)) {
    throw new Error(
      "SMTP_USER and SMTP_PASSWORD must be set for secure connections on port 465.",
    );
  }
})();

export const secure = port === "465";

export const credentials: {
  auth?: undefined | { user: string; pass: string };
} = {
  auth: user && pass ? { user, pass } : undefined,
};


const options: SMTPTransport.Options = {
  host,
  port: Number(port),
  secure,
  ...credentials,
};

const transporter = nodemailer.createTransport(options);

const __path = path.join(__dirname, "..",);

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      partialsDir: path.join(__path, "templates", "partials"),
      layoutsDir: path.join(__path, "templates", "layouts"),
      defaultLayout: "base.template.hbs",
    },
    viewPath: path.join(__path, "templates", "views"),
    extName: ".hbs",
  }),
);

export default transporter;
