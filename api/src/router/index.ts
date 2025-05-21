import homeRoutes from "./routes/_home.js";
import authRoutes from "./routes/_auth.js";
import requestRoutes from "./routes/_request.js";
import vendorRoutes from "./routes/_vendor.js";
import vendorRequestRoutes from "./routes/_vendorRequests.js";
import whatsAppWebHookRoutes from "./routes/_whastappWebHook.js";

const routes = new Map([
  ["/", homeRoutes],
  ["/auth", authRoutes],
  ["/requests", requestRoutes],
  ["/vendors", vendorRoutes],
  ["/vendor-requests", vendorRequestRoutes],
  ["/webhook/whatsapp", whatsAppWebHookRoutes]
]);

const registerRoutes = (app) => {
  routes.forEach((value, key, map) => {
    app.use(key, value);
  });
};

export default registerRoutes;
