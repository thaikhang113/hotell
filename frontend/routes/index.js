import siteController from "../controllers/siteController.js";
import bookingController from "../controllers/bookingController.js";
import serviceController from "../controllers/serviceController.js"; // Import thêm
import checkLogin from "../Middleware/checkLogin.js";
import express from "express"; // Import express

function route(app) {
  app.use((req, res, next) => {
    if (req.path.startsWith("/auth")) return next();
    return checkLogin(req, res, next);
  });

  app.get("/", siteController.home);
  app.get("/about", siteController.about);
  app.get("/our-room", siteController.rooms);
  app.get("/gallery", siteController.gallery);
  app.get("/blog", siteController.blog);
  app.get("/contact-us", siteController.contact);

  app.get("/payment/:id", bookingController.showPayment);
  
  // Route Proxy lấy dịch vụ (MỚI)
  app.get("/api/services-list", serviceController.getServiceListProxy);
}

export default route;