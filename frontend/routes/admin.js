import express from "express";
import adminController from "../controllers/adminController.js";
import customerController from "../controllers/customerController.js";
import serviceController from "../controllers/serviceController.js";
import roomTypeController from "../controllers/roomTypeController.js";
import invoiceController from "../controllers/InvoiceController.js";

const router = express.Router();

router.get("/", (req, res) => res.render("admin/dashboard", { layout: "admin" }));

// Staff
router.get("/staff", adminController.getStaff);

// Customers
router.get("/customers", customerController.listCustomers);

// Services
router.get("/services", serviceController.listServices);
router.post("/services/add", serviceController.addService);
router.post("/services/edit/:id", serviceController.updateService);
router.get("/services/delete/:id", serviceController.deleteService);

// Room Types
router.get("/room-types", roomTypeController.listRoomTypes);
router.post("/room-types/add", roomTypeController.addRoomType);
router.post("/room-types/edit/:id", roomTypeController.updateRoomType);
router.get("/room-types/delete/:id", roomTypeController.deleteRoomType);

// Rooms (MỚI)
router.get("/rooms", adminController.getRooms);
router.post("/rooms/add", adminController.addRoom);
router.post("/rooms/edit/:id", adminController.updateRoom);
router.get("/rooms/delete/:id", adminController.deleteRoom);

// Invoices
router.get("/invoices", invoiceController.listInvoices);

export default router;