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

      // Payload đầy đủ gửi sang Backend
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

  // Hiển thị trang Thanh toán (QR)
  async showPayment(req, res) {
    try {
      const bookingId = req.params.id;
      
      // Gọi API Backend lấy chi tiết Booking để hiển thị số tiền
      const response = await axios.get(`${API_URL}/bookings/${bookingId}`);
      const booking = response.data;

      if (!booking) return res.redirect('/');

      // Format lại tiền tệ để hiển thị đẹp
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
}

export default new BookingController();