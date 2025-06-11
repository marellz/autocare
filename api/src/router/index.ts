import homeRoutes from "./routes/_home";
import authRoutes from "./routes/_auth";
import requestRoutes from "./routes/_request";
import vendorRoutes from "./routes/_vendor";
import vendorRequestRoutes from "./routes/_vendorRequests";
import whatsAppWebHookRoutes from "./routes/_whatsappWebhook";
import fakeWhatsappWebhookRoutes from "./routes/_whatsappWebhook.fake";

import { Express } from "express";

const routes = new Map([
  ["/", homeRoutes],
  ["/auth", authRoutes],
  ["/requests", requestRoutes],
  ["/vendors", vendorRoutes],
  ["/vendor-requests", vendorRequestRoutes],
  ["/webhook/whatsapp", whatsAppWebHookRoutes],
  ["/fake-webhook", fakeWhatsappWebhookRoutes],
]);

const registerRoutes = (app: Express) => {
  routes.forEach((value, key) => {
    app.use(key, value);
  });
};

export default registerRoutes;
