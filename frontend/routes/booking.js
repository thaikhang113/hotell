import express from "express";
import bookingController from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", bookingController.createBooking);
router.post("/confirm-payment", bookingController.confirmPayment); // Route mới

export default router;