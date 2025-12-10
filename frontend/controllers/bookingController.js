import axios from "axios";

const API_URL = "http://217.216.72.223:3000/api";

class BookingController {
  // Tạo Booking
  async createBooking(req, res) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Bạn cần đăng nhập!" });
      }

      const { roomId, checkIn, checkOut, guests, services, promotionCode } = req.body;

      if (!roomId || !checkIn || !checkOut) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin đặt phòng!" });
      }

      const payload = {
        user_id: parseInt(req.session.user.user_id || req.session.user.id), 
        room_ids: [parseInt(roomId)],
        check_in: checkIn,
        check_out: checkOut,
        total_guests: parseInt(guests) || 1,
        services: services || [], 
        promotionCode: promotionCode || "" 
      };

      console.log("--- BOOKING PAYLOAD ---", payload);

      const response = await axios.post(`${API_URL}/bookings`, payload);
      const bookingData = response.data.data;

      return res.json({ success: true, data: bookingData });

    } catch (error) {
      console.error("Booking Error:", error.response?.data || error.message);
      return res.status(500).json({ 
        success: false, 
        message: error.response?.data?.message || "Đặt phòng thất bại. Vui lòng thử lại!" 
      });
    }
  }

  // Hiển thị trang Thanh toán
  async showPayment(req, res) {
    try {
      const bookingId = req.params.id;
      
      const response = await axios.get(`${API_URL}/bookings/${bookingId}`);
      const booking = response.data;

      if (!booking) return res.redirect('/');

      booking.total_amount_formatted = new Intl.NumberFormat('vi-VN', { 
        style: 'currency', currency: 'VND' 
      }).format(booking.total_amount);

      res.render("payment", { 
        title: "Thanh toán | KETO",
        booking: booking
      });

    } catch (error) {
      console.error("Payment Page Error:", error.message);
      res.redirect('/');
    }
  }

  // Xác nhận thanh toán (MỚI)
  async confirmPayment(req, res) {
    try {
      const { bookingId, invoiceId } = req.body;

      // Gọi API Backend để update trạng thái Invoice thành 'paid'
      await axios.put(`${API_URL}/invoices/${invoiceId}/payment`, {
        status: 'paid',
        method: 'transfer' // Mặc định là chuyển khoản
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Confirm Payment Error:", error.message);
      res.status(500).json({ success: false, message: "Lỗi cập nhật thanh toán" });
    }
  }
}

export default new BookingController();