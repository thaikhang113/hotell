import express from "express";
import adminController from "../controllers/adminController.js";
import customerController from "../controllers/customerController.js";
import serviceController from "../controllers/serviceController.js";
import roomTypeController from "../controllers/roomTypeController.js";
import invoiceController from "../controllers/InvoiceController.js";

const router = express.Router();

// Trang danh sách
router.get("/staff", adminController.listStaff);

// Xử lý Thêm
router.post("/staff/add", adminController.addStaff);

// Xử lý Sửa (Dùng POST để giả lập PUT từ form HTML)
router.post("/staff/edit/:id", adminController.updateStaff);

// Xử lý Xóa (Nên dùng POST hoặc DELETE nếu dùng AJAX, nhưng giữ nguyên GET nếu dùng link <a>)
router.get("/staff/delete/:id", adminController.deleteStaff);
// Hỗ trợ POST cho việc xóa từ form HTML (an toàn hơn khi dùng nút)
router.post("/staff/delete/:id", adminController.deleteStaff);

router.get("/customers", customerController.listCustomers);

// Xử lý Thêm Customer
router.post("/customers/add", customerController.addCustomer);

// Xử lý Sửa Customer
router.post("/customers/edit/:id", customerController.updateCustomer);

// Xử lý Xóa Customer
router.get("/customers/delete/:id", customerController.deleteCustomer);
router.post("/customers/delete/:id", customerController.deleteCustomer);

router.get("/services", serviceController.listServices);

// Xử lý Thêm Service
router.post("/services/add", serviceController.addService);

// Xử lý Sửa Service
router.post("/services/edit/:id", serviceController.updateService);

// Xử lý Xóa Service
router.post("/services/delete/:id", serviceController.deleteService);
router.get("/services/delete/:id", serviceController.deleteService);

// Hỗ trợ xóa qua link
router.get("/room-types", roomTypeController.listRoomTypes);

// Xử lý Thêm Loại phòng
router.post("/room-types/add", roomTypeController.addRoomType);

// Xử lý Sửa Loại phòng (dùng POST)
router.post("/room-types/edit/:id", roomTypeController.updateRoomType);

// Xử lý Xóa Loại phòng (dùng POST)
router.post("/room-types/delete/:id", roomTypeController.deleteRoomType);
router.get("/room-types/delete/:id", roomTypeController.deleteRoomType);

router.get("/invoices", invoiceController.listInvoices);
export default router;
