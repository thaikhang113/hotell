import siteController from "../controllers/siteController.js";
import serviceController from "../controllers/serviceController.js";
import bookingController from "../controllers/bookingController.js"; // Import controller để dùng cho route lẻ nếu cần
import checkLogin from "../Middleware/checkLogin.js";

// Import các Router con
import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import bookingRouter from "./booking.js";

function route(app) {
  // 1. Middleware kiểm tra đăng nhập (Chặn toàn bộ trừ /auth và public)
  app.use((req, res, next) => {
    // Cho phép truy cập folder public, auth, và các trang public mà không cần login
    const publicPaths = ["/auth", "/css", "/img", "/js", "/favicon.ico"];
    if (publicPaths.some(path => req.path.startsWith(path))) return next();
    
    // Các trang chủ, about, room... cũng là public (không bắt login)
    if (req.path === "/" || 
        req.path === "/about" || 
        req.path === "/our-room" || 
        req.path === "/gallery" || 
        req.path === "/blog" || 
        req.path === "/contact-us" ||
        req.path.startsWith("/payment") || // Cho phép xem trang thanh toán
        req.path.startsWith("/api/services-list") // Cho phép lấy service
       ) {
        return next();
    }

    // Còn lại (VD: /admin) thì check login
    return checkLogin(req, res, next);
  });

  // 2. Đăng ký các Router con
  app.use("/auth", authRouter);       // Xử lý các đường dẫn bắt đầu bằng /auth (login, register...)
  app.use("/admin", adminRouter);     // Xử lý /admin/*
  app.use("/booking", bookingRouter); // Xử lý /booking/*

  // 3. Các Route Public (Trang chủ, Giới thiệu...)
  app.get("/", siteController.home);
  app.get("/about", siteController.about);
  app.get("/our-room", siteController.rooms);
  app.get("/gallery", siteController.gallery);
  app.get("/blog", siteController.blog);
  app.get("/contact-us", siteController.contact);

  // Route lẻ (Thanh toán & API Service Proxy)
  app.get("/payment/:id", bookingController.showPayment);
  app.get("/api/services-list", serviceController.getServiceListProxy);
}

export default route;