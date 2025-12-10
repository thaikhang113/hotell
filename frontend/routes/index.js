import siteController from "../controllers/siteController.js";
import bookingController from "../controllers/bookingController.js";
import checkLogin from "../Middleware/checkLogin.js";

function route(app) {
  // Chặn toàn bộ site trừ /auth/*
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

  // Route Trang thanh toán (Mới)
  app.get("/payment/:id", bookingController.showPayment);
}

export default route;